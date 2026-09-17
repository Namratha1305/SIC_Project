import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  generateEmailWithFewShot,
  generateEmailBaseline,
  runPromptComparison,
  refineEmail,
  hasValidGeminiKey,
} from './server/geminiService.js';
import { EmailFormData } from './src/types.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logger for post-deployment debugging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'AI Email Assistant Backend',
      timestamp: new Date().toISOString(),
      hasGeminiKey: hasValidGeminiKey(),
    });
  });

  // Validation middleware
  function validateEmailInput(data: EmailFormData): { isValid: boolean; message?: string } {
    if (!data) {
      return { isValid: false, message: 'No input data provided.' };
    }
    const missing: string[] = [];
    if (!data.purpose?.trim()) missing.push('email purpose');
    if (!data.recipient?.trim()) missing.push('recipient');
    if (!data.senderName?.trim()) missing.push('sender name');
    if (!data.objective?.trim()) missing.push('main objective');
    if (!data.details?.trim()) missing.push('important details/context');

    if (missing.length > 0) {
      return {
        isValid: false,
        message: `Please provide the ${missing.join(', ')} before generating the email.`,
      };
    }

    if (data.recipient.length > 150) {
      return { isValid: false, message: 'Recipient name exceeds maximum allowed length (150 chars).' };
    }
    if (data.senderName.length > 150) {
      return { isValid: false, message: 'Sender name exceeds maximum allowed length (150 chars).' };
    }
    if (data.objective.length > 1500) {
      return { isValid: false, message: 'Main objective exceeds maximum allowed length (1500 chars).' };
    }
    if (data.details.length > 3000) {
      return { isValid: false, message: 'Important details exceed maximum allowed length (3000 chars).' };
    }

    return { isValid: true };
  }

  // 1. Generate Email (Few-shot, grounded)
  app.post('/api/generate-email', async (req: Request, res: Response): Promise<void> => {
    try {
      const formData = req.body as EmailFormData;
      const validation = validateEmailInput(formData);
      if (!validation.isValid) {
        res.status(400).json({ error: validation.message });
        return;
      }

      console.log(`Generating few-shot email for: ${formData.purpose} -> ${formData.recipient}`);
      const result = await generateEmailWithFewShot(formData);
      res.json(result);
    } catch (error: unknown) {
      console.error('Server error in /api/generate-email:', error);
      res.status(500).json({
        error: 'Something went wrong while generating the email. Please check your input and try again.',
      });
    }
  });

  // 2. Baseline generation (for experiment)
  app.post('/api/generate-baseline', async (req: Request, res: Response): Promise<void> => {
    try {
      const formData = req.body as EmailFormData;
      const validation = validateEmailInput(formData);
      if (!validation.isValid) {
        res.status(400).json({ error: validation.message });
        return;
      }

      console.log(`Generating baseline email for: ${formData.purpose}`);
      const result = await generateEmailBaseline(formData);
      res.json(result);
    } catch (error: unknown) {
      console.error('Server error in /api/generate-baseline:', error);
      res.status(500).json({
        error: 'Something went wrong while running the baseline prompt. Please check your input and try again.',
      });
    }
  });

  // 3. Prompting Experiment (Baseline vs Few-shot comparison)
  app.post('/api/experiment-compare', async (req: Request, res: Response): Promise<void> => {
    try {
      const formData = req.body as EmailFormData;
      const validation = validateEmailInput(formData);
      if (!validation.isValid) {
        res.status(400).json({ error: validation.message });
        return;
      }

      console.log(`Running experiment comparison for: ${formData.purpose}`);
      const comparison = await runPromptComparison(formData);
      res.json(comparison);
    } catch (error: unknown) {
      console.error('Server error in /api/experiment-compare:', error);
      res.status(500).json({
        error: 'Something went wrong while comparing baseline and few-shot prompts.',
      });
    }
  });

  // 4. Refine Email
  app.post('/api/refine-email', async (req: Request, res: Response): Promise<void> => {
    try {
      const { currentEmail, originalData, action } = req.body;
      if (!currentEmail?.subject || !currentEmail?.body) {
        res.status(400).json({ error: 'Current email draft is required for refinement.' });
        return;
      }
      if (!originalData) {
        res.status(400).json({ error: 'Original context is required to ground the refinement.' });
        return;
      }

      console.log(`Refining email with action: ${action}`);
      const refined = await refineEmail(currentEmail, originalData, action || 'regenerate');
      res.json(refined);
    } catch (error: unknown) {
      console.error('Server error in /api/refine-email:', error);
      res.status(500).json({
        error: 'Something went wrong while refining the email. Please try again.',
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Email Assistant Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
