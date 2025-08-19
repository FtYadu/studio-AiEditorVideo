'use server';

/**
 * @fileOverview An AI flow for automatic color correction and grading of a video.
 *
 * - autoColor - A function that initiates the auto-color process.
 * - AutoColorInput - The input type for the autoColor function.
 * - AutoColorOutput - The return type for the autoColor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoColorInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AutoColorInput = z.infer<typeof AutoColorInputSchema>;

const AutoColorOutputSchema = z.object({
  summary: z.string().describe('A summary of the color corrections made.'),
  lut: z.string().describe('The suggested Look-Up Table (LUT) to apply.'),
  exposure: z.number().describe('The suggested exposure adjustment, from 0.0 to 2.0.'),
  contrast: z.number().describe('The suggested contrast adjustment, from 0.0 to 2.0.'),
  saturation: z.number().describe('The suggested saturation adjustment, from 0.0 to 2.0.'),
});
export type AutoColorOutput = z.infer<typeof AutoColorOutputSchema>;

export async function autoColor(input: AutoColorInput): Promise<AutoColorOutput> {
  return autoColorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoColorPrompt',
  input: {schema: AutoColorInputSchema},
  output: {schema: AutoColorOutputSchema},
  prompt: `You are an expert colorist for video. Your task is to analyze a video and suggest color correction and grading settings.

  Analyze the video provided and suggest adjustments for exposure, contrast, and saturation. The values should be floats between 0.0 and 2.0, where 1.0 is the default. Also, recommend a creative Look-Up Table (LUT) that would fit the mood of the video (e.g., "Teal & Orange", "Vintage Film", "Bleach Bypass").

  Return a JSON object with your suggestions.

  Video: {{media url=videoDataUri}}
  `,
});

const autoColorFlow = ai.defineFlow(
  {
    name: 'autoColorFlow',
    inputSchema: AutoColorInputSchema,
    outputSchema: AutoColorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
