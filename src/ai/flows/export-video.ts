// src/ai/flows/export-video.ts
'use server';
/**
 * @fileOverview A flow that generates a video based on a text prompt.
 *
 * - exportVideo - A function that handles the video generation process.
 * - ExportVideoInput - The input type for the exportVideo function.
 * - ExportVideoOutput - The return type for the exportVideo function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'genkit';
import * as fs from 'fs';
import {Readable} from 'stream';

const ExportVideoInputSchema = z.object({
  prompt: z.string().describe('The text prompt to generate the video from.'),
});
export type ExportVideoInput = z.infer<typeof ExportVideoInputSchema>;

const ExportVideoOutputSchema = z.object({
  videoDataUri: z
    .string()
    .describe('The generated video, as a data URI in base64 encoding.'),
});
export type ExportVideoOutput = z.infer<typeof ExportVideoOutputSchema>;

async function downloadVideo(video: any): Promise<string> {
  const fetch = (await import('node-fetch')).default;
  const videoDownloadResponse = await fetch(
    `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
  );
  if (
    !videoDownloadResponse ||
    videoDownloadResponse.status !== 200 ||
    !videoDownloadResponse.body
  ) {
    throw new Error('Failed to fetch video');
  }

  const buffer = await videoDownloadResponse.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

export const exportVideoFlow = ai.defineFlow(
  {
    name: 'exportVideoFlow',
    inputSchema: ExportVideoInputSchema,
    outputSchema: ExportVideoOutputSchema,
  },
  async ({prompt}) => {
    let {operation} = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: prompt,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find(p => !!p.media);
    if (!video) {
      throw new Error('Failed to find the generated video');
    }

    const videoBase64 = await downloadVideo(video);
    return {
      videoDataUri: `data:video/mp4;base64,${videoBase64}`,
    };
  }
);

export async function exportVideo(
  input: ExportVideoInput
): Promise<ExportVideoOutput> {
  return exportVideoFlow(input);
}
