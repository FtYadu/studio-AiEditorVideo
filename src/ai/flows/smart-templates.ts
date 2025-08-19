
// src/ai/flows/smart-templates.ts
'use server';
/**
 * @fileOverview A flow that uses AI-powered templates to create punch-cut edits.
 *
 * - generatePunchCutEdit - A function that handles the punch-cut edit generation process.
 * - GeneratePunchCutEditInput - The input type for the generatePunchCutEdit function.
 * - GeneratePunchCutEditOutput - The return type for the generatePunchCutEdit function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TemplateSchema = z.object({
  name: z.string().describe('The name of the template.'),
  description: z.string().describe('A description of the template.'),
  instructions: z.string().describe('Instructions for how to apply the template.'),
});

const GeneratePunchCutEditInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  template: TemplateSchema.describe('The template to use for generating the punch-cut edit.'),
});
export type GeneratePunchCutEditInput = z.infer<typeof GeneratePunchCutEditInputSchema>;

const EditDecisionSchema = z.object({
  start: z.number().describe('The start time of the clip in seconds.'),
  end: z.number().describe('The end time of the clip in seconds.'),
});

const GeneratePunchCutEditOutputSchema = z.object({
  editDecisionList: z.array(EditDecisionSchema).describe('An array of edit decisions, representing the new timeline clips.'),
  summary: z.string().describe('A summary of the edits that were made.'),
});
export type GeneratePunchCutEditOutput = z.infer<typeof GeneratePunchCutEditOutputSchema>;

export async function generatePunchCutEdit(input: GeneratePunchCutEditInput): Promise<GeneratePunchCutEditOutput> {
  return generatePunchCutEditFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePunchCutEditPrompt',
  input: {schema: GeneratePunchCutEditInputSchema},
  output: {schema: GeneratePunchCutEditOutputSchema},
  prompt: `You are an expert video editor specializing in creating engaging short-form content.

You will use the provided video and template to generate a punch-cut edit.

Template Name: {{{template.name}}}
Template Description: {{{template.description}}}
Template Instructions: {{{template.instructions}}}

Video: {{media url=videoDataUri}}

Create a punch-cut edit of the video based on the template instructions. Generate an Edit Decision List (EDL) with start and end times for each new clip.
Also provide a summary of the edits that were made.
`,
});

const generatePunchCutEditFlow = ai.defineFlow(
  {
    name: 'generatePunchCutEditFlow',
    inputSchema: GeneratePunchCutEditInputSchema,
    outputSchema: GeneratePunchCutEditOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
