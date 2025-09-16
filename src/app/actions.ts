"use server";

import { config } from "dotenv";
config();

import { generateFashionPrompt, GenerateFashionPromptInput } from "@/ai/flows/generate-fashion-prompt";
import { describeImage, DescribeImageInput } from "@/ai/flows/describe-image-flow";

export async function handleGeneratePrompt(input: GenerateFashionPromptInput) {
  try {
    const result = await generateFashionPrompt(input);
    return { prompt: result.prompt };
  } catch (error: any) {
    console.error("Error generating prompt:", error);
    const errorMessage = error.message || "Gagal membuat prompt. Silakan coba lagi.";
    return { error: errorMessage };
  }
}

export async function handleDescribeImage(input: DescribeImageInput) {
  try {
    const result = await describeImage(input);
    return { description: result.description };
  } catch (error: any) {
    console.error("Error describing image:", error);
    const errorMessage = error.message || "Gagal membuat deskripsi dari gambar. Silakan coba lagi.";
    return { error: errorMessage };
  }
}
