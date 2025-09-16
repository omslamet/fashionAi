'use server';
/**
 * @fileOverview Generates a description for an image.
 *
 * - describeImage - A function that takes an image data URI and returns a description.
 * - DescribeImageInput - The input type for the describeImage function.
 * - DescribeImageOutput - The return type for the describeImage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DescribeImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DescribeImageInput = z.infer<typeof DescribeImageInputSchema>;

const DescribeImageOutputSchema = z.object({
  description: z.string().describe('The generated description of the product in the image.'),
});
export type DescribeImageOutput = z.infer<typeof DescribeImageOutputSchema>;

export async function describeImage(input: DescribeImageInput): Promise<DescribeImageOutput> {
  return describeImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'describeImagePrompt',
  input: { schema: DescribeImageInputSchema },
  output: { schema: DescribeImageOutputSchema },
  prompt: `You are an expert in fashion e-commerce. Describe the following product image for a product listing. Be concise and focus on the product itself.

Photo: {{media url=photoDataUri}}`,
});

const describeImageFlow = ai.defineFlow(
  {
    name: 'describeImageFlow',
    inputSchema: DescribeImageInputSchema,
    outputSchema: DescribeImageOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
