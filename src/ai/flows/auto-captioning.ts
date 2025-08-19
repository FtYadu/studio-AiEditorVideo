// Auto-generates captions from video audio.

'use server';

/**
 * @fileOverview A flow that automatically generates captions from the audio in a video.
 *
 * - autoCaption - A function that handles the auto captioning process.
 * - AutoCaptionInput - The input type for the autoCaption function.
 * - AutoCaptionOutput - The return type for the autoCaption function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const AutoCaptionInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The audio from the video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AutoCaptionInput = z.infer<typeof AutoCaptionInputSchema>;

const AutoCaptionOutputSchema = z.object({
  captions: z.string().describe('The generated captions.'),
});
export type AutoCaptionOutput = z.infer<typeof AutoCaptionOutputSchema>;

export async function autoCaption(input: AutoCaptionInput): Promise<AutoCaptionOutput> {
  return autoCaptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoCaptionPrompt',
  input: {schema: AutoCaptionInputSchema},
  output: {schema: AutoCaptionOutputSchema},
  prompt: `You are an AI that generates video captions from audio.

  Given the following audio, generate captions for the video. Return the captions as a single string.
  Audio: {{media url=audioDataUri}}`,
});

const autoCaptionFlow = ai.defineFlow(
  {
    name: 'autoCaptionFlow',
    inputSchema: AutoCaptionInputSchema,
    outputSchema: AutoCaptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
