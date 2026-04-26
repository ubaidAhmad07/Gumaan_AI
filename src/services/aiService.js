const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Read configuration from environment variables
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const SYSTEM_MESSAGE = import.meta.env.VITE_AI_SYSTEM_MESSAGE;
const PROMPT_TEMPLATE = import.meta.env.VITE_AI_PROMPT;

export async function processEmails(emails, profile) {
  if (!API_KEY) throw new Error('API key not set. Please add VITE_GROQ_API_KEY to your .env file.');
  if (!PROMPT_TEMPLATE) throw new Error('Prompt template not set. Please add VITE_AI_PROMPT to your .env file.');

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

  // Build the prompt by replacing placeholders in the template
  const prompt = PROMPT_TEMPLATE
    .replace(/\\n/g, '\n')
    .replace('{{PROFILE_SUMMARY}}', profileSummary)
    .replace('{{EMAIL_LIST}}', emailList)
    .replace('{{TODAY_DATE}}', new Date().toISOString().split('T')[0]);

  const systemMessage = (SYSTEM_MESSAGE || 'You are a helpful AI assistant that analyzes opportunity emails for students. You MUST respond with valid JSON only — no markdown, no code fences, no extra text.')
    .replace(/\\n/g, '\n');

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: systemMessage
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

