import React, { useState } from 'react';
import { Header } from './components/Header.js';
import { EmailInputForm } from './components/EmailInputForm.js';
import { EmailPreview } from './components/EmailPreview.js';
import { PromptingExperiment } from './components/PromptingExperiment.js';
import { TestingPanel } from './components/TestingPanel.js';
import { ResponsibleAIPanel } from './components/ResponsibleAIPanel.js';
import { ProjectNotes } from './components/ProjectNotes.js';
import { InteractivePresentation } from './components/InteractivePresentation.js';
import { EmailFormData, GeneratedEmailResponse, ValidationResult } from './types.js';
import { validateEmailForm } from './services/validationService.js';
import { generateEmail, refineEmailDraft } from './services/apiService.js';
import { AlertCircle, ShieldAlert } from 'lucide-react';

const INITIAL_DEMO_DATA: EmailFormData = {
  purpose: 'Internship Inquiry',
  recipient: 'Hiring Manager',
  senderName: 'Alex',
  recipientRole: 'Hiring Manager',
  objective: 'Ask about internship opportunities.',
  details:
    'I am interested in learning more about internship opportunities and would like to know whether applications are currently open.',
  tone: 'Professional',
  length: 'Short',
  subjectPreference: 'auto',
  additionalInstructions: '',
};

const BLANK_FORM_DATA: EmailFormData = {
  purpose: 'Job Application',
  recipient: '',
  senderName: '',
  recipientRole: 'Hiring Manager',
  objective: '',
  details: '',
  tone: 'Professional',
  length: 'Short',
  subjectPreference: 'auto',
  additionalInstructions: '',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('generator');
  const [formData, setFormData] = useState<EmailFormData>(INITIAL_DEMO_DATA);
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, errors: {} });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmailResponse | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Load Demo scenario (Section 13)
  const handleLoadDemo = () => {
    setFormData(INITIAL_DEMO_DATA);
    setValidation({ isValid: true, errors: {} });
    setGlobalError(null);
    setActiveTab('generator');
  };

  // Load test case from testing suite
  const handleLoadTestCase = (testData: EmailFormData) => {
    setFormData(testData);
    setValidation({ isValid: true, errors: {} });
    setGlobalError(null);
    setActiveTab('generator');
  };

  // Reset form to blank
  const handleResetForm = () => {
    setFormData(BLANK_FORM_DATA);
    setValidation({ isValid: true, errors: {} });
    setGeneratedEmail(null);
    setGlobalError(null);
  };

  // Main generation handler
  const handleGenerate = async () => {
    setGlobalError(null);

    // 1. Input Validation
    const val = validateEmailForm(formData);
    setValidation(val);
    if (!val.isValid) {
      return;
    }

    // 2. AI Model Call
    setIsGenerating(true);
    try {
      const emailResponse = await generateEmail(formData);
      setGeneratedEmail(emailResponse);
    } catch (err: unknown) {
      setGlobalError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while generating the email. Please check your input and try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // Refine handler
  const handleRefine = async (
    action: 'concise' | 'formal' | 'friendly' | 'grammar' | 'tone' | 'regenerate'
  ) => {
    if (!generatedEmail) return;
    setIsRefining(true);
    setGlobalError(null);

    try {
      const refined = await refineEmailDraft(
        { subject: generatedEmail.subject, body: generatedEmail.body },
        formData,
        action
      );
      setGeneratedEmail(refined);
    } catch (err: unknown) {
      setGlobalError(
        err instanceof Error ? err.message : 'Failed to refine email. Please try again.'
      );
    } finally {
      setIsRefining(false);
    }
  };

  // Inline draft edit updater
  const handleUpdateEmailDraft = (updated: Partial<GeneratedEmailResponse>) => {
    if (!generatedEmail) return;
    setGeneratedEmail({
      ...generatedEmail,
      ...updated,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100/60 text-slate-900 font-sans antialiased flex flex-col">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoadDemo={handleLoadDemo}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Global Error Alert Banner */}
        {globalError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Action Notice</span>
              <p>{globalError}</p>
            </div>
          </div>
        )}

        {/* Tab 1: Email Generator (Default) */}
        {activeTab === 'generator' && (
          <div className="space-y-6">
            {/* Grounding Context Note Banner */}
            <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <span className="font-medium">
                  <span className="font-semibold text-slate-900">Grounding Source:</span> User-provided form data + few-shot reference examples. Fictional facts/dates will not be invented.
                </span>
              </div>
              <span className="text-[11px] text-slate-500 italic shrink-0">
                Human review required before sending
              </span>
            </div>

            {/* Two-column responsive dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Input Panel (5 cols on large screens) */}
              <div className="lg:col-span-5">
                <EmailInputForm
                  formData={formData}
                  setFormData={setFormData}
                  validation={validation}
                  isGenerating={isGenerating}
                  onGenerate={handleGenerate}
                  onReset={handleResetForm}
                />
              </div>

              {/* Right Column: Output Panel (7 cols on large screens) */}
              <div className="lg:col-span-7">
                <EmailPreview
                  email={generatedEmail}
                  formData={formData}
                  isGenerating={isGenerating}
                  isRefining={isRefining}
                  onRefine={handleRefine}
                  onClear={() => setGeneratedEmail(null)}
                  onUpdateEmailDraft={handleUpdateEmailDraft}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Prompting Experiment */}
        {activeTab === 'experiment' && <PromptingExperiment formData={formData} />}

        {/* Tab 3: Prototype Testing */}
        {activeTab === 'testing' && <TestingPanel onLoadTestCase={handleLoadTestCase} />}

        {/* Tab 4: Responsible AI & Grounding */}
        {activeTab === 'responsible-ai' && <ResponsibleAIPanel />}

        {/* Tab 5: Presentation & Report */}
        {activeTab === 'presentation' && <InteractivePresentation />}

        {/* Tab 6: Project Notes */}
        {activeTab === 'notes' && <ProjectNotes />}
      </main>

      {/* Professional Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div>
            AI Email Generator – Project 11 Business Email Assistant (Student Prototype)
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Few-Shot Prompting</span>
            <span>•</span>
            <span className="font-medium text-amber-700">Strictly No Automatic Sending</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
