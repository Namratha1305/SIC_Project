export type EmailPurpose =
  | 'Job Application'
  | 'Internship Inquiry'
  | 'Meeting Request'
  | 'Follow-up'
  | 'Leave Request'
  | 'Apology'
  | 'Thank You'
  | 'Complaint'
  | 'Client Communication'
  | 'General Business Email';

export type DesiredTone =
  | 'Professional'
  | 'Formal'
  | 'Friendly Professional'
  | 'Concise'
  | 'Polite'
  | 'Apologetic';

export type EmailLength = 'Short' | 'Medium' | 'Detailed';

export type SubjectPreference = 'auto' | 'custom';

export interface EmailFormData {
  purpose: EmailPurpose;
  recipient: string;
  senderName: string;
  recipientRole: string;
  objective: string;
  details: string;
  tone: DesiredTone;
  additionalInstructions?: string;
  length: EmailLength;
  subjectPreference: SubjectPreference;
  customSubject?: string;
}

export interface GeneratedEmailResponse {
  subject: string;
  body: string;
  tone_check: string;
  grammar_check: string;
  grounding_check: string;
  warnings: string[];
  sensitiveContentFlagged?: boolean;
  modelUsed?: string;
  promptType?: 'few-shot' | 'baseline' | 'refinement';
  timestamp?: string;
}

export interface ComparisonResult {
  baseline: GeneratedEmailResponse;
  fewShot: GeneratedEmailResponse;
  metrics: {
    structureConsistency: {
      baseline: string;
      fewShot: string;
      observation: string;
    };
    toneConsistency: {
      baseline: string;
      fewShot: string;
      observation: string;
    };
    completeness: {
      baseline: string;
      fewShot: string;
      observation: string;
    };
    unsupportedClaims: {
      baseline: string;
      fewShot: string;
      observation: string;
    };
    overallObservations: string;
  };
}

export interface TestCase {
  id: string;
  name: string;
  category: string;
  description: string;
  formData: EmailFormData;
  expectedBehavior: string;
  expectedOutcome: 'success' | 'validation_error' | 'clarification' | 'refusal' | 'sensitive_limit';
}

export interface ValidationResult {
  isValid: boolean;
  errors: Partial<Record<keyof EmailFormData, string>>;
  summaryMessage?: string;
}
