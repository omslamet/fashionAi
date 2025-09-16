// @ts-nocheck
'use server';
/**
 * @fileOverview Generates an AI prompt for fashion product photography based on user inputs.
 *
 * - generateFashionPrompt - A function that takes product description, style, and additional details as input and returns an AI prompt.
 * - GenerateFashionPromptInput - The input type for the generateFashionPrompt function.
 * - GenerateFashionPromptOutput - The return type for the generateFashionPrompt function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateFashionPromptInputSchema = z.object({
  productDescription: z.string().describe('The description of the fashion product.'),
  style: z.string().describe('The desired style for the product photography (e.g., Ghost Mannequin, Female Model, Male Model).'),
  additionalDetails: z.string().describe('Additional details about the product, such as pose, lighting, and background.'),
});
export type GenerateFashionPromptInput = z.infer<typeof GenerateFashionPromptInputSchema>;

const GenerateFashionPromptOutputSchema = z.object({
  prompt: z.string().describe('The generated AI prompt for fashion product photography.'),
});
export type GenerateFashionPromptOutput = z.infer<typeof GenerateFashionPromptOutputSchema>;

export async function generateFashionPrompt(input: GenerateFashionPromptInput): Promise<GenerateFashionPromptOutput> {
  return generateFashionPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFashionPromptPrompt',
  input: { schema: GenerateFashionPromptInputSchema },
  output: { schema: GenerateFashionPromptOutputSchema },
  prompt: `Generate an AI art prompt for e-commerce product photography. Product: {{{productDescription}}}. Style: {{{style}}}. Extra details: {{{additionalDetails}}}. Output in one concise English sentence, suitable for Stable Diffusion or MidJourney. Add keywords: 'high resolution, professional studio photography, clean background'.`,
});

const generateFashionPromptFlow = ai.defineFlow(
  {
    name: 'generateFashionPromptFlow',
    inputSchema: GenerateFashionPromptInputSchema,
    outputSchema: GenerateFashionPromptOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
