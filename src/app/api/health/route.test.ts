import { GET } from './route';

describe('GET /api/health', () => {
  it('returns ok status', async () => {
    const res = GET();
    const json = await res.json();
    expect(json).toEqual({ status: 'ok' });
  });
});
