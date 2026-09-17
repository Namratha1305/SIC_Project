import React from 'react';
import {
  FileText,
  CheckCircle2,
  AlertOctagon,
  GitCommit,
  Sparkles,
  Layers,
  Shield,
  Cpu,
} from 'lucide-react';

export const ProjectNotes: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <FileText className="w-3.5 h-3.5" />
            Project 11 Deliverable
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Project Completion Notes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Formal retrospective analysis, technical evaluations, empirical takeaways, and strategic future roadmap for the AI Email Generator prototype.
          </p>
        </div>
      </div>

      {/* The 4 Standard Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. What worked well */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">What Worked Well</h3>
          </div>
          <div className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
            &quot;The application successfully generated professional business emails from structured user inputs. Few-shot examples improved consistency of the output structure and tone.&quot;
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside pt-1">
            <li>Strict JSON schema parsing eliminated markdown formatting artifacts.</li>
            <li>Low temperature (0.3) minimized creative hallucinations.</li>
            <li>Modular AI service enables seamless model swappability (e.g. Gemini Flash to Pro).</li>
          </ul>
        </div>

        {/* 2. What failed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-700">
            <AlertOctagon className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">What Failed</h3>
          </div>
          <div className="p-3.5 rounded-lg bg-rose-50/70 border border-rose-200 text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
            &quot;Some ambiguous inputs may not contain enough context for a fully specific email.&quot;
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside pt-1">
            <li>When given extremely sparse input like &quot;follow up on the thing&quot;, zero-shot models often hallucinated specific meeting dates or project titles.</li>
            <li>Enforcing strict grounding required fine-tuned clarification heuristics rather than guessing.</li>
          </ul>
        </div>

        {/* 3. What I changed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-blue-700">
            <GitCommit className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">What I Changed</h3>
          </div>
          <div className="p-3.5 rounded-lg bg-blue-50/70 border border-blue-200 text-xs sm:text-sm text-blue-950 font-medium leading-relaxed">
            &quot;Added input validation, few-shot examples, grounding rules, tone and grammar checks, unsupported-claim warnings, and human review.&quot;
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside pt-1">
            <li>Implemented pre-flight validation preventing empty or invalid submissions from wasting tokens.</li>
            <li>Created multi-layer post-processing checking for missing salutations or signature brackets.</li>
            <li>Added an empirical side-by-side experiment mode comparing baseline with few-shot prompting.</li>
          </ul>
        </div>

        {/* 4. What I would improve next */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-purple-700">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">What I Would Improve Next</h3>
          </div>
          <div className="p-3.5 rounded-lg bg-purple-50/70 border border-purple-200 text-xs sm:text-sm text-purple-950 font-medium leading-relaxed">
            &quot;Add retrieval from approved company templates, multilingual email generation, stronger automated fact checking, and optional integration with an email service after explicit user confirmation.&quot;
          </div>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside pt-1">
            <li>Enterprise RAG vector store for brand guidelines and corporate policy documentation.</li>
            <li>Deterministic grammar scoring integration using specialized natural language analysis.</li>
            <li>OAuth Google Workspace integration for single-click Gmail draft creation.</li>
          </ul>
        </div>
      </div>

      {/* Architecture & Tech Stack summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-600" />
          Technical Architecture Specification
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">Frontend Stack</span>
            React 19 + TypeScript + Vite + Tailwind CSS with modular component hierarchy.
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">Backend Server</span>
            Node.js + Express with server-side proxying ensuring API keys are never leaked to client bundles.
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-900 block mb-1">Model &amp; Prompting</span>
            Gemini 3.8 Flash via <code>@google/genai</code> with structured JSON schema and 3 safe few-shot exemplars.
          </div>
        </div>
      </div>
    </div>
  );
};
