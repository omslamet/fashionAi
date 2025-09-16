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
  style: z.string().describe('The desired style for the product photography (e.g., Mockup, Female Model, Male Model).'),
  modelType: z.string().describe('The ethnicity of the model (e.g., Indonesian Model, Caucasian Model).'),
  pose: z.string().describe('The desired pose for the model.'),
  additionalDetails: z.string().describe('Additional details about the product, such as lighting, and background.'),
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
  prompt: `You are an expert in creating prompts for AI image generation models like Stable Diffusion or MidJourney.
Your task is to generate a concise, single-sentence English prompt for e-commerce product photography based on the provided details.

Product Description: {{{productDescription}}}
Photography Style: {{{style}}}
Model Ethnicity: {{{modelType}}}
Model Pose: {{{pose}}}
Additional Details: {{{additionalDetails}}}

The prompt must include the keywords: 'high resolution, professional studio photography, clean background'.
Do not add any explanations or introductory text. Only output the final prompt.`,
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
