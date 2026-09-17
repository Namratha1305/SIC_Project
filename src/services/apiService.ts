import { EmailFormData, GeneratedEmailResponse, ComparisonResult } from '../types.js';

export async function generateEmail(formData: EmailFormData): Promise<GeneratedEmailResponse> {
  const response = await fetch('/api/generate-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to generate email.');
  }

  return response.json();
}

export async function comparePrompts(formData: EmailFormData): Promise<ComparisonResult> {
  const response = await fetch('/api/experiment-compare', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to run prompting comparison.');
  }

  return response.json();
}

export async function refineEmailDraft(
  currentEmail: { subject: string; body: string },
  originalData: EmailFormData,
  action: 'concise' | 'formal' | 'friendly' | 'grammar' | 'tone' | 'regenerate'
): Promise<GeneratedEmailResponse> {
  const response = await fetch('/api/refine-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentEmail, originalData, action }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to refine email.');
  }

  return response.json();
}

export async function checkServerHealth(): Promise<{ status: string; hasGeminiKey: boolean }> {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) return { status: 'error', hasGeminiKey: false };
    return await response.json();
  } catch {
    return { status: 'offline', hasGeminiKey: false };
  }
}
