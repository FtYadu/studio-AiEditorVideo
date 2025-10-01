import {getLLMProvider, GoogleProvider, OpenAIProvider} from './llm';

describe('getLLMProvider', () => {
  const OLD_ENV = process.env;
  afterEach(() => {
    process.env = {...OLD_ENV};
  });

  it('returns GoogleProvider by default', () => {
    process.env = {...OLD_ENV, GEMINI_API_KEY: 'test-key'};
    const provider = getLLMProvider();
    expect(provider).toBeInstanceOf(GoogleProvider);
  });

  it('returns OpenAIProvider when AI_PROVIDER=openai', () => {
    process.env = {...OLD_ENV, AI_PROVIDER: 'openai', OPENAI_API_KEY: 'sk-test'};
    const provider = getLLMProvider();
    expect(provider).toBeInstanceOf(OpenAIProvider);
  });
});
