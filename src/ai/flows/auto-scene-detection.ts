'use server';

/**
 * @fileOverview A flow for automatically detecting scene changes in a video.
 *
 * - autoSceneDetection - A function that initiates the scene detection process.
 * - AutoSceneDetectionInput - The input type for the autoSceneDetection function.
 * - AutoSceneDetectionOutput - The return type for the autoSceneDetection function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoSceneDetectionInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AutoSceneDetectionInput = z.infer<typeof AutoSceneDetectionInputSchema>;

const AutoSceneDetectionOutputSchema = z.object({
  sceneTimestamps: z
    .array(z.number())
    .describe('An array of timestamps (in seconds) where scene changes occur.'),
});
export type AutoSceneDetectionOutput = z.infer<typeof AutoSceneDetectionOutputSchema>;

export async function autoSceneDetection(input: AutoSceneDetectionInput): Promise<AutoSceneDetectionOutput> {
  return autoSceneDetectionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoSceneDetectionPrompt',
  input: {schema: AutoSceneDetectionInputSchema},
  output: {schema: AutoSceneDetectionOutputSchema},
  prompt: `You are an expert video editor. Your task is to identify scene changes in a video.

  Analyze the video provided and identify the timestamps where scene transitions occur. A scene transition is defined as a noticeable change in the visual content of the video, such as a different camera angle, location, or subject.

  Return a JSON object containing an array of timestamps (in seconds) where scene changes occur.

  Video: {{media url=videoDataUri}}
  `,
});

const autoSceneDetectionFlow = ai.defineFlow(
  {
    name: 'autoSceneDetectionFlow',
    inputSchema: AutoSceneDetectionInputSchema,
    outputSchema: AutoSceneDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
