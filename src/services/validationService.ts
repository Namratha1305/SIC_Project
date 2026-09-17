import { EmailFormData, ValidationResult } from '../types.js';

export function validateEmailForm(data: EmailFormData): ValidationResult {
  const errors: Partial<Record<keyof EmailFormData, string>> = {};
  const missingLabels: string[] = [];

  if (!data.purpose || !data.purpose.trim()) {
    errors.purpose = 'Email purpose is required.';
    missingLabels.push('email purpose');
  }

  if (!data.recipient || !data.recipient.trim()) {
    errors.recipient = 'Recipient is required.';
    missingLabels.push('recipient');
  }

  if (!data.senderName || !data.senderName.trim()) {
    errors.senderName = 'Sender name is required.';
    missingLabels.push('sender name');
  }

  if (!data.objective || !data.objective.trim()) {
    errors.objective = 'Main objective is required.';
    missingLabels.push('main objective');
  }

  if (!data.details || !data.details.trim()) {
    errors.details = 'Important details/context are required.';
    missingLabels.push('important details/context');
  }

  if (data.subjectPreference === 'custom' && (!data.customSubject || !data.customSubject.trim())) {
    errors.customSubject = 'Please provide your custom subject line.';
  }

  // Length checks
  if (data.recipient && data.recipient.length > 150) {
    errors.recipient = 'Recipient name must not exceed 150 characters.';
  }
  if (data.senderName && data.senderName.length > 150) {
    errors.senderName = 'Sender name must not exceed 150 characters.';
  }
  if (data.objective && data.objective.length > 1500) {
    errors.objective = 'Objective must not exceed 1500 characters.';
  }
  if (data.details && data.details.length > 3000) {
    errors.details = 'Details must not exceed 3000 characters.';
  }

  let summaryMessage: string | undefined;
  if (missingLabels.length > 0) {
    summaryMessage = `Please provide the ${missingLabels.join(' and ')} before generating the email.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    summaryMessage,
  };
}
