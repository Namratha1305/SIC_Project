import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck2,
  Lock,
  CheckCircle2,
  BookOpen,
  Info,
  Scale,
} from 'lucide-react';

export const ResponsibleAIPanel: React.FC = () => {
  const rules = [
    'Use only information available in the supplied input and grounded context.',
    'Never invent facts, dates, job titles, credentials, prices, achievements, promises, policies, or other unsupported claims.',
    'If important information is missing, either ask for clarification or use neutral wording that does not invent information.',
    'Maintain the requested tone.',
    'Keep the email concise and professional.',
    'Do not include fabricated details.',
    'Do not claim that an action has already happened unless the user explicitly states it.',
    'Do not make legal, medical, financial, or employment decisions on behalf of the user.',
    'Preserve the user\'s intended meaning.',
    'Produce a clear subject and email body.',
    'The output must be appropriate for human review before sending.',
  ];

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <ShieldCheck className="w-3.5 h-3.5" />
            Safety, Grounding &amp; Guardrails Architecture
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Responsible AI System Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Professional communication requires unwavering factual accuracy and professional decorum.
            Our prototype implements multi-layer guardrails to prevent hallucinations, enforce tone calibration, and mandate human verification.
          </p>
        </div>
      </div>

      {/* Grounding Context Section (Section 7 Specification) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <FileCheck2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Prompt-Provided Grounding Context
          </h3>
        </div>

        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs sm:text-sm text-blue-950 space-y-2">
          <div className="font-semibold text-blue-900 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-600" />
            Grounding Source: User-provided context and approved example templates.
          </div>
          <p className="text-blue-900/90 leading-relaxed">
            The AI model treats user-provided form information as its strict source of truth.
            If the user provides incomplete or sparse information, the model is forbidden from extrapolating fictional milestones,
            dates, salaries, or names; it must employ neutral wording or explicitly ask for clarification.
          </p>
        </div>

        {/* Mandatory Specification Grounding Note */}
        <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700">
          <span className="font-bold text-slate-900 block mb-0.5">Grounding Architecture Decision:</span>
          <p className="leading-relaxed font-mono text-[11px] text-slate-800">
            &quot;Grounding decision: Prompt-provided context is sufficient for this prototype because the task only requires transforming user-provided information into a professional email. External or continuously changing information is not required.&quot;
          </p>
        </div>
      </div>

      {/* Guardrails Matrix (Section 8 Specification) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Scale className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Automated Guardrail Pipeline
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900">A. Tone Validation</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verifies that the generated email matches the requested tone register (e.g. Formal, Polite, Friendly Professional).
              If informal colloquialisms or hostile language are detected, a warning is raised:
              <span className="block mt-1 font-mono text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-sm">
                &quot;Tone Warning: The generated email may not fully match the requested tone.&quot;
              </span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900">B. Unsupported Claims Detection</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspects generated drafts against input fields. If the model generates unprovided specifics (dates, degrees, past agreements),
              it triggers:
              <span className="block mt-1 font-mono text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded-sm">
                &quot;Fact Warning: The generated email may contain information that was not explicitly provided. Please review before using it.&quot;
              </span>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-900">C. Grammar &amp; Structure Validation</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Automated syntax verification evaluates sentence completeness, repetitive phrases, spelling,
              missing salutations (Dear, Hello), and professional closings (Best regards, Sincerely).
              Outputs clean status badges: <code>Passed</code> or <code>Review recommended</code>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <h4 className="text-xs font-bold text-amber-950">D. Mandatory Human Review</h4>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Under strict safety regulations, this application strictly omits any automatic send capability.
              Every output requires explicit human review and manual approval before transmission.
            </p>
          </div>
        </div>
      </div>

      {/* High-Impact & Sensitive Policy (Section 9 Specification) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <Lock className="w-5 h-5 text-rose-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            High-Impact &amp; Sensitive Content Safeguard
          </h3>
        </div>

        <p className="text-xs text-slate-600">
          The system refuses to generate or validate emails that attempt to assert:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {[
            'Medical Diagnoses',
            'Legal Conclusions',
            'Financial Promises',
            'Employment Terminations',
            'Discriminatory Content',
            'Impersonation / Fraud',
            'Credential Fabrication',
            'False Factual Claims',
          ].map((topic) => (
            <div
              key={topic}
              className="p-2 rounded-md bg-rose-50 border border-rose-100 text-rose-800 font-medium text-center text-[11px]"
            >
              {topic}
            </div>
          ))}
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800">
          <span className="font-semibold block mb-1">Standard Fallback Safety Response:</span>
          <p className="italic text-slate-700">
            &quot;I can help draft a neutral professional message, but I cannot create unsupported claims or make this decision on your behalf. Please verify the relevant information before using the email.&quot;
          </p>
        </div>
      </div>

      {/* The 11 Core AI Prompt Rules (Section 4 Specification) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <BookOpen className="w-5 h-5 text-purple-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Core AI Prompt Rules (System Directives)
          </h3>
        </div>

        <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside">
          {rules.map((rule, idx) => (
            <li key={idx} className="leading-relaxed p-1.5 rounded-md hover:bg-slate-50">
              <span className="text-slate-900 font-medium">{rule}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
