import { EmailFormData } from '../src/types.js';

export const CORE_SYSTEM_PROMPT = `You are an expert business email writing assistant.

Goal:
Generate a professional business email based only on the information supplied by the user and the grounded reference examples.

Rules:
1. Use only information available in the supplied input and grounded context.
2. Never invent facts, dates, job titles, credentials, prices, achievements, promises, policies, or other unsupported claims.
3. If important information is missing, either ask for clarification or use neutral wording that does not invent information.
4. Maintain and literally embody the requested tone throughout the entire body.
5. LENGTH CALIBRATION:
   - "Short": Keep concise and direct (1-2 brief paragraphs).
   - "Medium": Provide a little bit detailed email (2-3 well-developed paragraphs expanding on the context, background, and next steps).
   - "Detailed": Provide a more detailed email (3-4 comprehensive paragraphs thoroughly breaking down all supplied context, logistical readiness, and specific points).
6. MANDATORY SIGN-OFF REQUIREMENT:
   Every generated email MUST conclude with this exact format:
   Thank you,
   Regards,
   [Sender Name]
7. Do not include fabricated details.
8. Do not claim that an action has already happened unless the user explicitly states it.
9. Do not make legal, medical, financial, or employment decisions on behalf of the user.
10. Preserve the user's intended meaning.
11. Produce a clear subject and email body.
12. The output must be appropriate for human review before sending.`;

export const FEW_SHOT_EXAMPLES = [
  {
    exampleNumber: 1,
    input: {
      purpose: 'Internship Inquiry',
      recipientRole: 'Hiring Manager',
      objective: 'Ask whether internship opportunities are available.',
      tone: 'Professional',
      length: 'Medium',
      details: 'The student is interested in learning more about internship opportunities in software engineering.',
    },
    expectedOutput: {
      subject: 'Inquiry About Internship Opportunities – Software Engineering',
      body: `Dear Hiring Manager,

I am writing to respectfully inquire whether software engineering internship opportunities are currently available within your team. I have been following your team's work and am very interested in contributing while expanding my technical skills.

To provide a brief overview, I am currently pursuing coursework in software development and am eager to apply my foundational programming knowledge to active team projects. I am particularly interested in learning about upcoming openings for the coming term and the expectations for potential candidates.

If opportunities are currently open, could you please provide details regarding the application timeline or direct me to the appropriate point of contact?

Thank you,
Regards,
[Sender Name]`,
      tone_check: 'Tone: Professional (respectful, objective, clear)',
      grammar_check: 'Passed (standard business syntax, complete sentences)',
      grounding_check: 'Based on provided information (no fabricated credentials or dates)',
      warnings: [],
    },
  },
  {
    exampleNumber: 2,
    input: {
      purpose: 'Meeting Request',
      recipientRole: 'Team Lead',
      objective: 'Request a meeting to discuss project progress.',
      tone: 'Formal',
      length: 'Detailed',
      details: 'The sender would like to discuss current project status, upcoming milestone deadlines, and resource allocation.',
    },
    expectedOutput: {
      subject: 'Formal Request for Project Status Review and Milestone Alignment',
      body: `Dear [Recipient Name],

I hope this communication finds you well. I am writing to formally request a dedicated meeting to conduct a thorough review of our current project progress and coordinate our upcoming deliverables.

With several pivotal milestone deadlines approaching on the schedule, it is essential that we review the completed deliverables, evaluate our current operational velocity, and discuss the allocation of necessary project resources. Aligning on these facets will ensure all tasks remain strictly synchronized and on track.

I have prepared an outline covering our active status points and potential discussion items for your review. I would be grateful if we could schedule approximately 30 minutes at your convenience during the upcoming week.

Please let me know which dates and times work best with your calendar, or if you would prefer to review the discussion outline beforehand.

Thank you,
Regards,
[Sender Name]`,
      tone_check: 'Tone: Formal (elevated diction, respectful deference, structured)',
      grammar_check: 'Passed (impeccable grammar and transition flow)',
      grounding_check: 'Based on provided information (no invented meeting topics or milestones)',
      warnings: [],
    },
  },
  {
    exampleNumber: 3,
    input: {
      purpose: 'Thank You',
      recipientRole: 'Professor',
      objective: 'Thank the professor for guidance on a project.',
      tone: 'Polite',
      length: 'Short',
      details: 'The professor provided useful guidance and code reviews during the term project.',
    },
    expectedOutput: {
      subject: 'Thank You for Your Guidance and Support',
      body: `Dear Professor [Recipient Name],

I wanted to take a moment to express my sincere gratitude for the valuable guidance and detailed code reviews you provided throughout our term project. Your feedback was instrumental in helping us navigate the key technical challenges.

I truly appreciate your time, patience, and mentorship.

Thank you,
Regards,
[Sender Name]`,
      tone_check: 'Tone: Polite (sincere, appreciative, deferential)',
      grammar_check: 'Passed (flawless syntax, concise body)',
      grounding_check: 'Based on provided information (no fabricated project titles or course codes)',
      warnings: [],
    },
  },
];

export function buildFewShotPrompt(data: EmailFormData): string {
  const examplesText = FEW_SHOT_EXAMPLES.map(
    (ex) => `--- Few-Shot Example ${ex.exampleNumber} ---
Input:
Purpose: ${ex.input.purpose}
Recipient Role: ${ex.input.recipientRole}
Objective: ${ex.input.objective}
Tone: ${ex.input.tone}
Length: ${ex.input.length}
Details: ${ex.input.details}

Expected Response:
Subject: ${ex.expectedOutput.subject}
Body:
${ex.expectedOutput.body}
Tone Check: ${ex.expectedOutput.tone_check}
Grammar Check: ${ex.expectedOutput.grammar_check}
Grounding Check: ${ex.expectedOutput.grounding_check}
`
  ).join('\n\n');

  let lengthGuidance = '';
  if (data.length === 'Short') {
    lengthGuidance = 'Short (Keep the email concise and directly to the point, 1–2 brief paragraphs).';
  } else if (data.length === 'Medium') {
    lengthGuidance = 'Medium (Provide a little bit detailed email: 2–3 well-developed paragraphs explaining the context, objective, and specific background).';
  } else {
    lengthGuidance = 'Detailed (Provide a more detailed email: 3–4 comprehensive paragraphs thoroughly elaborating on all background details, explaining the relevance, logistical readiness, and proposing structured next steps).';
  }

  return `You are following the FEW-SHOT prompting approach. Observe the structure, level of detail, and strict factual grounding from the reference examples below.

${examplesText}

==================================================
CURRENT REQUEST TO PROCESS:
==================================================
Email Purpose: ${data.purpose}
Recipient: ${data.recipient}
Sender Name: ${data.senderName}
Recipient Role / Relationship: ${data.recipientRole || 'Business Associate'}
Main Objective: ${data.objective}
Important Details / Grounding Context: ${data.details}
Desired Tone: ${data.tone}
LITERAL TONE DIRECTIVE: Embody "${data.tone}" literally and uncompromisingly throughout the entire email body, vocabulary, and transitions.
Desired Length: ${lengthGuidance}
Subject Preference: ${
    data.subjectPreference === 'custom' && data.customSubject
      ? `User provided subject: "${data.customSubject}". Use this subject directly.`
      : 'Generate subject automatically based strictly on the objective.'
  }
Additional Instructions: ${data.additionalInstructions || 'None provided'}

MANDATORY SIGN-OFF FORMAT:
The email MUST conclude with this exact format:
Thank you,
Regards,
${data.senderName}

Strict Grounding Directive:
- Use only facts present in the inputs above.
- Do NOT invent companies, dates, technical certifications, phone numbers, or promises.
- If context is sparse or ambiguous, ask for clarification neutrally or use safe, general wording.
- Return valid structured JSON conforming to the schema with fields: subject, body, tone_check, grammar_check, grounding_check, warnings.`;
}

export function buildBaselinePrompt(data: EmailFormData): string {
  let lengthGuidance = '';
  if (data.length === 'Short') {
    lengthGuidance = 'Short (1–2 concise paragraphs).';
  } else if (data.length === 'Medium') {
    lengthGuidance = 'Medium (A little bit detailed: 2–3 paragraphs).';
  } else {
    lengthGuidance = 'Detailed (More detailed: 3–4 comprehensive paragraphs).';
  }

  return `You are following the BASELINE prompting approach (zero-shot without reference examples).

Generate a business email based on this input:
Email Purpose: ${data.purpose}
Recipient: ${data.recipient}
Sender Name: ${data.senderName}
Recipient Role / Relationship: ${data.recipientRole || 'Not specified'}
Main Objective: ${data.objective}
Important Details / Context: ${data.details}
Desired Tone: ${data.tone} (Embody this tone literally)
Desired Length: ${lengthGuidance}
Subject Preference: ${
    data.subjectPreference === 'custom' && data.customSubject
      ? `User provided subject: "${data.customSubject}".`
      : 'Generate subject automatically.'
  }
Additional Instructions: ${data.additionalInstructions || 'None'}

Rules:
1. Keep the email professional.
2. Produce a subject and body.
3. MANDATORY SIGN-OFF: Conclude with:
Thank you,
Regards,
${data.senderName}
4. Return valid structured JSON conforming to the schema.`;
}

export function buildRefinementPrompt(
  currentEmail: { subject: string; body: string },
  originalData: EmailFormData,
  action: 'concise' | 'formal' | 'friendly' | 'grammar' | 'tone' | 'regenerate'
): string {
  const instructions: Record<string, string> = {
    concise:
      'Make the email body significantly more concise and direct while preserving all key facts, names, and the core objective.',
    formal:
      'Elevate the language to a strictly formal business register with traditional salutations, dignified phrasing, and elevated professional etiquette.',
    friendly:
      'Infuse a warm, approachable, and friendly professional tone while maintaining proper business decorum and avoiding overly casual slang.',
    grammar:
      'Perform an exhaustive grammar, syntax, flow, and clarity check. Polish sentence transitions, eliminate redundancy, and ensure impeccable punctuation.',
    tone: 'Adjust and align the tone strictly to match the requested business tone: ' + originalData.tone,
    regenerate:
      'Regenerate an alternative fresh phrasing for this email, adhering strictly to the user objective and grounded facts.',
  };

  return `You are refining an existing business email draft.

REFINEMENT DIRECTIVE:
${instructions[action] || 'Improve the clarity and business quality.'}

ORIGINAL CONTEXT (Source of Truth):
Purpose: ${originalData.purpose}
Recipient: ${originalData.recipient}
Sender: ${originalData.senderName}
Recipient Role: ${originalData.recipientRole}
Objective: ${originalData.objective}
Details: ${originalData.details}
Requested Tone: ${originalData.tone}

CURRENT DRAFT TO REFINE:
Subject: ${currentEmail.subject}
Body:
${currentEmail.body}

CRITICAL RULES FOR REFINEMENT:
- Preserve original facts, names, and objective.
- Do NOT introduce any new unsupported claims or fabricated information.
- Return valid structured JSON with subject, body, tone_check, grammar_check, grounding_check, warnings.`;
}

export const SENSITIVE_TOPICS_REGEX =
  /(medical diagnos|prescribe medication|legal conclusion|sue them|legal advice|guaranteed investment|insider trading|terminate employment for misconduct|fire employee|discriminat|racial slur|fake diploma|forged credential|fabricated degree|bogus certificate|fraudulent invoice)/i;
