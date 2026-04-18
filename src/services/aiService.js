const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

let apiKey = null;

export function initAI(key) {
  apiKey = key;
}

export async function processEmails(emails, profile) {
  if (!apiKey) throw new Error('API key not set. Please enter your Groq API key.');

  const profileSummary = `
Student Profile:
- Name: ${profile.name || 'Not specified'}
- Degree/Program: ${profile.program || 'Not specified'}
- Semester: ${profile.semester || 'Not specified'}
- CGPA: ${profile.cgpa || 'Not specified'}
- Skills/Interests: ${(profile.skills || []).join(', ') || 'Not specified'}
- Preferred Opportunity Types: ${(profile.preferredTypes || []).join(', ') || 'Any'}
- Financial Need: ${profile.financialNeed || 'Not specified'}
- Location Preference: ${profile.location || 'No preference'}
- Past Experience: ${profile.experience || 'None specified'}
  `.trim();

  const emailList = emails.map((email, i) => `--- EMAIL ${i + 1} ---\n${email}\n--- END EMAIL ${i + 1} ---`).join('\n\n');

  const prompt = `You are an AI Opportunity Copilot. Analyze the following emails and student profile.

${profileSummary}

Here are the emails to analyze:

${emailList}

For EACH email, do the following:
1. Classify whether it contains a genuine opportunity (scholarship, internship, fellowship, competition, financial aid) or is irrelevant (spam, ads, general messages).
2. For genuine opportunities, extract structured data.
3. Score and rank opportunities by relevance to the student profile.

Return a JSON object with this EXACT structure (no markdown, no code fences, just raw JSON):
{
  "opportunities": [
    {
      "emailIndex": <number, 0-based index of the email>,
      "isGenuine": true,
      "title": "<opportunity title>",
      "type": "<Scholarship|Internship|Fellowship|Competition|Financial Aid|Other>",
      "organization": "<offering organization>",
      "deadline": "<deadline date string or 'Not specified'>",
      "eligibility": ["<criterion 1>", "<criterion 2>"],
      "requiredDocuments": ["<doc 1>", "<doc 2>"],
      "benefits": "<brief summary of benefits>",
      "applicationLink": "<URL or 'Not provided'>",
      "contactInfo": "<email/phone or 'Not provided'>",
      "profileFitScore": <0-100, how well this matches the student>,
      "urgencyScore": <0-100, based on deadline proximity and time sensitivity>,
      "completenessScore": <0-100, how complete the info is>,
      "overallScore": <0-100, weighted composite>,
      "fitReason": "<1-2 sentences explaining why this is/isn't a good fit>",
      "actionSteps": ["<step 1>", "<step 2>", "<step 3>"]
    }
  ],
  "rejected": [
    {
      "emailIndex": <number>,
      "reason": "<why this was rejected, e.g. 'Advertisement/spam', 'Not an opportunity'>"
    }
  ],
  "summary": "<2-3 sentence overall summary for the student>"
}

Important rules:
- Only include genuine opportunities in the "opportunities" array
- Rank opportunities by overallScore descending
- Be specific in fitReason based on the student's actual profile
- For urgency, consider today's date is ${new Date().toISOString().split('T')[0]}
- Action steps should be concrete and actionable
- If deadline has passed, still include but note it and give low urgency`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI assistant that analyzes opportunity emails for students. You MUST respond with valid JSON only — no markdown, no code fences, no extra text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 401) {
      throw new Error('Invalid Groq API key. Please check your key and try again.');
    }
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    throw new Error(`Groq API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('Empty response from Groq API. Please try again.');
  }

  // Clean response - remove markdown code fences if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Failed to parse AI response:', cleaned);
    throw new Error('Failed to parse AI response. Please try again.');
  }
}
