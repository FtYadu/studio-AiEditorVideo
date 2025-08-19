
'use server';

/**
 * @fileOverview An AI flow for generating audio waveform data from a media file.
 *
 * - generateWaveform - A function that initiates the waveform generation process.
 * - GenerateWaveformInput - The input type for the generateWaveform function.
 * - GenerateWaveformOutput - The return type for the generateWaveform function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWaveformInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A media file (video or audio), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateWaveformInput = z.infer<typeof GenerateWaveformInputSchema>;

const GenerateWaveformOutputSchema = z.object({
  waveform: z.array(z.number()).describe('An array of numbers representing the audio waveform.'),
});
export type GenerateWaveformOutput = z.infer<typeof GenerateWaveformOutputSchema>;

export async function generateWaveform(input: GenerateWaveformInput): Promise<GenerateWaveformOutput> {
  return generateWaveformFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWaveformPrompt',
  input: {schema: GenerateWaveformInputSchema},
  output: {schema: GenerateWaveformOutputSchema},
  prompt: `You are an audio analysis tool. Your task is to generate waveform data from an audio or video file.

Analyze the provided media file and generate a simplified waveform. The waveform should be an array of 100 integers, where each integer ranges from 0 to 100, representing the audio amplitude at that point in time.

Media: {{media url=mediaDataUri}}`,
});


const generateWaveformFlow = ai.defineFlow(
  {
    name: 'generateWaveformFlow',
    inputSchema: GenerateWaveformInputSchema,
    outputSchema: GenerateWaveformOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate waveform data.");
    }
    return output;
  }
);
