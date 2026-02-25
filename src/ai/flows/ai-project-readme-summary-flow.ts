'use server';
/**
 * @fileOverview An AI agent that summarizes a project's README file.
 *
 * - summarizeProjectReadme - A function that generates a concise summary of a project README.
 * - ProjectReadmeSummaryInput - The input type for the summarizeProjectReadme function.
 * - ProjectReadmeSummaryOutput - The return type for the summarizeProjectReadme function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectReadmeSummaryInputSchema = z.object({
  readmeContent: z.string().describe("The full content of the project's README.md file."),
});
export type ProjectReadmeSummaryInput = z.infer<typeof ProjectReadmeSummaryInputSchema>;

const ProjectReadmeSummaryOutputSchema = z.object({
  summary: z.string().describe("A concise, AI-generated summary of the project's README, highlighting its purpose and key features."),
});
export type ProjectReadmeSummaryOutput = z.infer<typeof ProjectReadmeSummaryOutputSchema>;

export async function summarizeProjectReadme(input: ProjectReadmeSummaryInput): Promise<ProjectReadmeSummaryOutput> {
  return aiProjectReadmeSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiProjectReadmeSummaryPrompt',
  input: {schema: ProjectReadmeSummaryInputSchema},
  output: {schema: ProjectReadmeSummaryOutputSchema},
  prompt: `You are an expert technical writer and summarizer. Your task is to provide a concise, high-level summary of a project's README file.

Focus on the project's main purpose, its key features, and any notable technologies or functionalities.
The summary should be easy to understand for someone who needs to quickly grasp what the project does without reading the entire README.
Keep the summary to a maximum of 3-4 sentences.

README Content:

---
{{{readmeContent}}}
---

Generate the summary below:`,
});

const aiProjectReadmeSummaryFlow = ai.defineFlow(
  {
    name: 'aiProjectReadmeSummaryFlow',
    inputSchema: ProjectReadmeSummaryInputSchema,
    outputSchema: ProjectReadmeSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
