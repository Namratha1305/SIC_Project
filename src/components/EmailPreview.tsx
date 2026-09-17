import React, { useState } from 'react';
import { GeneratedEmailResponse, EmailFormData } from '../types.js';
import {
  Copy,
  Check,
  RefreshCw,
  Edit3,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Code,
  ArrowRight,
  Eye,
  CheckSquare,
} from 'lucide-react';

interface EmailPreviewProps {
  email: GeneratedEmailResponse | null;
  formData: EmailFormData;
  isGenerating: boolean;
  isRefining: boolean;
  onRefine: (action: 'concise' | 'formal' | 'friendly' | 'grammar' | 'tone' | 'regenerate') => void;
  onClear: () => void;
  onUpdateEmailDraft: (updated: Partial<GeneratedEmailResponse>) => void;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({
  email,
  formData,
  isGenerating,
  isRefining,
  onRefine,
  onClear,
  onUpdateEmailDraft,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [showDebugJson, setShowDebugJson] = useState(false);

  // Sync edits
  const handleStartEdit = () => {
    if (!email) return;
    setEditSubject(email.subject);
    setEditBody(email.body);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdateEmailDraft({
      subject: editSubject,
      body: editBody,
    });
    setIsEditing(false);
  };

  const handleCopy = async () => {
    if (!email) return;
    const fullText = `Subject: ${email.subject}\n\n${email.body}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = fullText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (isGenerating) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-8 flex flex-col items-center justify-center min-h-[480px] text-center">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
          <RefreshCw className="w-7 h-7 text-blue-600 animate-spin" />
        </div>
        <h3 className="text-base font-semibold text-slate-800">Generating your email...</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1.5">
          Constructing few-shot prompt, applying strict grounding rules, and running Gemini 3.8 Flash model.
        </p>
        <div className="w-48 h-1.5 bg-slate-100 rounded-full mt-5 overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center min-h-[480px] text-center">
        <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
          <Eye className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-slate-700">No Email Generated Yet</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">
          Complete the configuration on the left and click &quot;Generate Email&quot; or click &quot;Load Demo&quot; to test.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-5">
      {/* Header bar with controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Generated Email Draft</h2>
          {email.promptType && (
            <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              {email.promptType}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="copy-email-btn"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Copied to clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Email</span>
              </>
            )}
          </button>

          {!isEditing ? (
            <button
              type="button"
              id="edit-email-btn"
              onClick={handleStartEdit}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
          ) : (
            <button
              type="button"
              id="save-edit-btn"
              onClick={handleSaveEdit}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              Save Edits
            </button>
          )}

          <button
            type="button"
            id="clear-email-btn"
            onClick={onClear}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Clear current generated draft"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* Copy notification toast banner */}
      {copied && (
        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          Email copied to clipboard.
        </div>
      )}

      {/* Email Body Card */}
      <div className="bg-slate-50/60 rounded-xl border border-slate-200/80 p-4 sm:p-5 space-y-3">
        {/* Subject */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Subject
          </span>
          {isEditing ? (
            <input
              type="text"
              id="inline-edit-subject"
              value={editSubject}
              onChange={(e) => setEditSubject(e.target.value)}
              className="w-full text-sm font-semibold text-slate-900 bg-white px-3 py-1.5 border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <h3 className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
              {email.subject}
            </h3>
          )}
        </div>

        <div className="border-t border-slate-200/70 pt-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Email Body
          </span>
          {isEditing ? (
            <textarea
              id="inline-edit-body"
              rows={10}
              value={editBody}
              onChange={(e) => setEditBody(e.target.value)}
              className="w-full text-xs sm:text-sm font-mono p-3 bg-white border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-pre-wrap leading-relaxed"
            />
          ) : (
            <div className="text-xs sm:text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed bg-white p-4 rounded-lg border border-slate-200/70 shadow-2xs">
              {email.body}
            </div>
          )}
        </div>
      </div>

      {/* Refinement Controls */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Refine Email (Fact-Preserving Prompts)
          </span>
          {isRefining && (
            <span className="text-xs font-medium text-blue-600 flex items-center gap-1 animate-pulse">
              <RefreshCw className="w-3 h-3 animate-spin" /> Refining draft...
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            id="refine-concise-btn"
            disabled={isRefining}
            onClick={() => onRefine('concise')}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-300 rounded-md cursor-pointer transition-colors"
          >
            Make More Concise
          </button>
          <button
            type="button"
            id="refine-formal-btn"
            disabled={isRefining}
            onClick={() => onRefine('formal')}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-300 rounded-md cursor-pointer transition-colors"
          >
            Make More Formal
          </button>
          <button
            type="button"
            id="refine-friendly-btn"
            disabled={isRefining}
            onClick={() => onRefine('friendly')}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-300 rounded-md cursor-pointer transition-colors"
          >
            Make Friendlier
          </button>
          <button
            type="button"
            id="refine-grammar-btn"
            disabled={isRefining}
            onClick={() => onRefine('grammar')}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-300 rounded-md cursor-pointer transition-colors"
          >
            Improve Grammar
          </button>
          <button
            type="button"
            id="refine-regenerate-btn"
            disabled={isRefining}
            onClick={() => onRefine('regenerate')}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Regenerate
          </button>
        </div>
      </div>

      {/* Validation Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Validation &amp; Guardrails Report
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Tone Check */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Tone Check</span>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-xs font-medium text-slate-800 truncate" title={email.tone_check}>
                {email.tone_check || `Tone: ${formData.tone}`}
              </span>
            </div>
          </div>

          {/* Grammar Check */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Grammar Check</span>
            <div className="flex items-center gap-1.5 mt-1">
              {email.grammar_check?.toLowerCase().includes('pass') ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              )}
              <span className="text-xs font-medium text-slate-800 truncate" title={email.grammar_check}>
                {email.grammar_check || 'Passed'}
              </span>
            </div>
          </div>

          {/* Grounding / Fact Check */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Grounding / Fact Check</span>
            <div className="flex items-center gap-1.5 mt-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="text-xs font-medium text-slate-800 truncate" title={email.grounding_check}>
                {email.grounding_check || 'Based on provided information'}
              </span>
            </div>
          </div>
        </div>

        {/* Warnings list if any */}
        {email.warnings && email.warnings.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {email.warnings.map((warn, i) => (
              <div
                key={i}
                className="p-2 rounded-md bg-amber-50/90 border border-amber-200 text-amber-900 text-xs flex items-start gap-2"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{warn}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Human Review Guardrail Banner (MANDATORY REQUIREMENT: No Send Button, Human Review Required) */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
            Human Review Required Before Sending
          </span>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            Review the generated email before sending. AI-generated content may require correction.
            This application is an email generator and assistant, not an email client, and will never automatically send messages.
          </p>
        </div>
      </div>

      {/* Debug Structured JSON toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowDebugJson(!showDebugJson)}
          className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Code className="w-3.5 h-3.5" />
          {showDebugJson ? 'Hide Debug JSON' : 'Show Raw Structured Output (JSON)'}
        </button>

        {showDebugJson && (
          <pre className="mt-2.5 p-3 rounded-lg bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto max-h-60">
            {JSON.stringify(email, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};
