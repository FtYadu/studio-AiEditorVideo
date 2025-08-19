'use server';
/**
 * @fileOverview An AI flow for categorizing media assets.
 *
 * - categorizeAsset - A function that initiates the asset categorization process.
 * - CategorizeAssetInput - The input type for the categorizeAsset function.
 * - CategorizeAssetOutput - The return type for the categorizeAsset function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { AssetCategory } from '@/types/editor';

const CategorizeAssetInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      "A media file (video or audio), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  fileName: z.string().describe('The original filename of the media.'),
});
export type CategorizeAssetInput = z.infer<typeof CategorizeAssetInputSchema>;

const CategorizeAssetOutputSchema = z.object({
  category: z
    .enum(["Talking Head", "B-Roll", "Music", "Sound Effects", "Images", "General"])
    .describe('The determined category for the asset.'),
});
export type CategorizeAssetOutput = z.infer<typeof CategorizeAssetOutputSchema>;


export async function categorizeAsset(input: CategorizeAssetInput): Promise<CategorizeAssetOutput> {
  return categorizeAssetFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeAssetPrompt',
  input: {schema: CategorizeAssetInputSchema},
  output: {schema: CategorizeAssetOutputSchema},
  prompt: `You are an expert media asset manager. Your task is to categorize an incoming media file into one of the following bins based on its content and filename.

Categories:
- Talking Head: Videos primarily featuring a person speaking directly to the camera.
- B-Roll: Supplementary or alternative footage intercut with the main shot.
- Music: Background music tracks.
- Sound Effects: Sound effects to be used in the video.
- Images: Still images or graphics.
- General: Anything that doesn't fit into the other categories.

Analyze the provided media file and its filename to determine the most appropriate category.

Filename: {{{fileName}}}
Media: {{media url=mediaDataUri}}
`,
});

const categorizeAssetFlow = ai.defineFlow(
  {
    name: 'categorizeAssetFlow',
    inputSchema: CategorizeAssetInputSchema,
    outputSchema: CategorizeAssetOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

    