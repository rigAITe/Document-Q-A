import type { QAPair } from '@/types';
import { generateId } from '@/utils/idGenerator';
import { OPENAI_MODEL, OPENAI_MAX_TOKENS, OPENAI_TEMPERATURE, OPENAI_MAX_CONTENT_CHARS } from '@/config/constants';

// OpenAI API configuration
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
    type: string;
  };
}


/**
 * Call OpenAI API to answer a question about a document
 */
export async function askOpenAI(
  apiKey: string,
  documentContent: string,
  documentName: string,
  question: string,
  documentId: string
): Promise<QAPair> {
  // Truncate document content if too long (GPT-3.5 has ~16k token limit)
  const truncatedContent = documentContent.length > OPENAI_MAX_CONTENT_CHARS
    ? documentContent.substring(0, OPENAI_MAX_CONTENT_CHARS) + '\n\n[Document truncated due to length...]'
    : documentContent;

  const messages: OpenAIMessage[] = [
    {
      role: 'system',
      content: `You are a helpful document assistant. You answer questions about documents provided by the user. 
Be concise but thorough. If the answer is not in the document, say so clearly.
Format your responses using markdown when appropriate (lists, code blocks, etc.).`,
    },
    {
      role: 'user',
      content: `Document: "${documentName}"

Content:
${truncatedContent}

Question: ${question}`,
    },
  ];

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages,
      temperature: OPENAI_TEMPERATURE,
      max_tokens: OPENAI_MAX_TOKENS,
    }),
  });

  const data: OpenAIResponse = await response.json();

  if (!response.ok || data.error) {
    const errorMessage = data.error?.message || `API Error: ${response.status}`;
    throw new Error(errorMessage);
  }

  if (!data.choices || data.choices.length === 0) {
    throw new Error('AI returned no choices in the response.');
  }

  const rawAnswer = data.choices[0]?.message?.content ?? '';
  const answer = rawAnswer.trim() || 'AI returned an empty response. Please try again.';

  return {
    id: generateId('qa'),
    documentId,
    question,
    answer,
    timestamp: new Date(),
  };
}

/**
 * Validate an OpenAI API key by making a test request
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5,
      }),
    });

    // 401 means invalid key, other errors might be rate limits etc.
    return response.status !== 401;
  } catch {
    return false;
  }
}
