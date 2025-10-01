
export interface LLMProvider {
  generate(prompt: string): Promise<string>;
}

export class GoogleProvider implements LLMProvider {
  constructor(private apiKey: string) {}
  async generate(prompt: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`;
    const body = {contents: [{parts: [{text: prompt}]}]};
    const res = await fetch(url, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    } satisfies RequestInit);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }
}

export class OpenAIProvider implements LLMProvider {
  constructor(private apiKey: string) {}
  async generate(prompt: string): Promise<string> {
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({model: 'gpt-4o-mini', input: prompt}),
    });
    const data = await res.json();
    return data.output?.[0]?.content?.[0]?.text ?? '';
  }
}

export function getLLMProvider(): LLMProvider {
  const provider = (process.env.AI_PROVIDER || 'google').toLowerCase();
  if (provider === 'openai') {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      throw new Error('OPENAI_API_KEY is required');
    }
    return new OpenAIProvider(key);
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error('GEMINI_API_KEY is required');
  }
  return new GoogleProvider(key);
}
