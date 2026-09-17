import React from 'react';
import {
  EmailFormData,
  EmailPurpose,
  DesiredTone,
  EmailLength,
  SubjectPreference,
  ValidationResult,
} from '../types.js';
import { Send, AlertCircle, Sparkles, RefreshCw, User, Briefcase, FileText } from 'lucide-react';

interface EmailInputFormProps {
  formData: EmailFormData;
  setFormData: React.Dispatch<React.SetStateAction<EmailFormData>>;
  validation: ValidationResult;
  isGenerating: boolean;
  onGenerate: () => void;
  onReset: () => void;
}

const PURPOSES: EmailPurpose[] = [
  'Job Application',
  'Internship Inquiry',
  'Meeting Request',
  'Follow-up',
  'Leave Request',
  'Apology',
  'Thank You',
  'Complaint',
  'Client Communication',
  'General Business Email',
];

const TONES: DesiredTone[] = [
  'Professional',
  'Formal',
  'Friendly Professional',
  'Concise',
  'Polite',
  'Apologetic',
];

const LENGTHS: EmailLength[] = ['Short', 'Medium', 'Detailed'];

const ROLE_PRESETS = [
  'Hiring Manager',
  'Professor',
  'Client',
  'Team Lead',
  'HR Director',
  'Colleague',
];

export const EmailInputForm: React.FC<EmailInputFormProps> = ({
  formData,
  setFormData,
  validation,
  isGenerating,
  onGenerate,
  onReset,
}) => {
  const handleChange = (
    field: keyof EmailFormData,
    value: string | SubjectPreference | DesiredTone | EmailLength | EmailPurpose
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Email Configuration</h2>
          <p className="text-xs text-slate-500">Provide verified facts; the AI will not invent missing details.</p>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Reset Form
        </button>
      </div>

      {validation.summaryMessage && (
        <div className="mb-5 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Incomplete Required Information</span>
            <span>{validation.summaryMessage}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Email Purpose & Desired Tone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email-purpose" className="block text-xs font-semibold text-slate-700 mb-1.5">
              1. Email Purpose <span className="text-rose-500">*</span>
            </label>
            <select
              id="email-purpose"
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value as EmailPurpose)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            >
              {PURPOSES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="desired-tone" className="block text-xs font-semibold text-slate-700 mb-1.5">
              7. Desired Tone <span className="text-rose-500">*</span>
            </label>
            <select
              id="desired-tone"
              value={formData.tone}
              onChange={(e) => handleChange('tone', e.target.value as DesiredTone)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Recipient & Sender Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="recipient-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              2. Recipient Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="recipient-input"
                type="text"
                placeholder="e.g. Dr. Eleanor Vance or Hiring Manager"
                value={formData.recipient}
                onChange={(e) => handleChange('recipient', e.target.value)}
                className={`w-full text-xs sm:text-sm pl-9 pr-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                  validation.errors.recipient
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            {validation.errors.recipient && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{validation.errors.recipient}</p>
            )}
          </div>

          <div>
            <label htmlFor="sender-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              3. Sender Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="sender-input"
                type="text"
                placeholder="e.g. Alex Rivera"
                value={formData.senderName}
                onChange={(e) => handleChange('senderName', e.target.value)}
                className={`w-full text-xs sm:text-sm pl-9 pr-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                  validation.errors.senderName
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            {validation.errors.senderName && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{validation.errors.senderName}</p>
            )}
          </div>
        </div>

        {/* Recipient Role / Relationship */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="recipient-role-input" className="block text-xs font-semibold text-slate-700">
              4. Recipient Role / Relationship
            </label>
            <div className="flex gap-1.5">
              {ROLE_PRESETS.slice(0, 4).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleChange('recipientRole', role)}
                  className="text-[11px] px-2 py-0.5 rounded-sm bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer transition-colors"
                >
                  +{role}
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <input
              id="recipient-role-input"
              type="text"
              placeholder="e.g. Hiring Manager, Professor, Client, Team Lead"
              value={formData.recipientRole}
              onChange={(e) => handleChange('recipientRole', e.target.value)}
              className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Main Objective */}
        <div>
          <label htmlFor="main-objective-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
            5. Main Objective <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="main-objective-input"
            rows={2}
            placeholder="What is the primary action or question you need to communicate? (e.g. Inquire about summer internship openings)"
            value={formData.objective}
            onChange={(e) => handleChange('objective', e.target.value)}
            className={`w-full text-xs sm:text-sm p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 resize-y ${
              validation.errors.objective
                ? 'border-rose-300 focus:ring-rose-500'
                : 'border-slate-300 focus:ring-blue-500'
            }`}
          />
          {validation.errors.objective && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{validation.errors.objective}</p>
          )}
        </div>

        {/* Important Details / Context */}
        <div>
          <label htmlFor="details-context-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
            6. Important Details / Context (Grounding Source) <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="details-context-input"
            rows={3}
            placeholder="Supply all factual context here (timelines, dates if known, specifics). The AI will only use facts provided here."
            value={formData.details}
            onChange={(e) => handleChange('details', e.target.value)}
            className={`w-full text-xs sm:text-sm p-3 bg-white border rounded-lg focus:outline-none focus:ring-2 resize-y ${
              validation.errors.details
                ? 'border-rose-300 focus:ring-rose-500'
                : 'border-slate-300 focus:ring-blue-500'
            }`}
          />
          {validation.errors.details && (
            <p className="mt-1 text-xs text-rose-600 font-medium">{validation.errors.details}</p>
          )}
        </div>

        {/* Additional Options: Length & Subject Preference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label htmlFor="email-length" className="block text-xs font-semibold text-slate-700 mb-1.5">
              9. Email Length
            </label>
            <select
              id="email-length"
              value={formData.length}
              onChange={(e) => handleChange('length', e.target.value as EmailLength)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LENGTHS.map((l) => (
                <option key={l} value={l}>
                  {l === 'Short'
                    ? 'Short (Concise & direct)'
                    : l === 'Medium'
                    ? 'Medium (A little bit detailed)'
                    : 'Detailed (More detailed & in-depth)'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subject-preference" className="block text-xs font-semibold text-slate-700 mb-1.5">
              10. Subject Preference
            </label>
            <select
              id="subject-preference"
              value={formData.subjectPreference}
              onChange={(e) => handleChange('subjectPreference', e.target.value as SubjectPreference)}
              className="w-full text-xs sm:text-sm px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="auto">Generate automatically</option>
              <option value="custom">I will provide subject</option>
            </select>
          </div>
        </div>

        {formData.subjectPreference === 'custom' && (
          <div>
            <label htmlFor="custom-subject-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Custom Subject Line <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="custom-subject-input"
                type="text"
                placeholder="Enter your exact desired email subject line"
                value={formData.customSubject || ''}
                onChange={(e) => handleChange('customSubject', e.target.value)}
                className={`w-full text-xs sm:text-sm pl-9 pr-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                  validation.errors.customSubject
                    ? 'border-rose-300 focus:ring-rose-500'
                    : 'border-slate-300 focus:ring-blue-500'
                }`}
              />
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            {validation.errors.customSubject && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{validation.errors.customSubject}</p>
            )}
          </div>
        )}

        {/* 8. Additional Instructions */}
        <div>
          <label htmlFor="additional-instructions" className="block text-xs font-semibold text-slate-700 mb-1.5">
            8. Additional Instructions (Optional)
          </label>
          <input
            id="additional-instructions"
            type="text"
            placeholder="e.g. Include a polite sign-off wishing them a pleasant weekend"
            value={formData.additionalInstructions || ''}
            onChange={(e) => handleChange('additionalInstructions', e.target.value)}
            className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            id="generate-email-btn"
            type="submit"
            disabled={isGenerating}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white shadow-xs transition-all cursor-pointer ${
              isGenerating
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-md'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating your email...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate Email
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
