"use server";

import { generateFashionPrompt, GenerateFashionPromptInput } from "@/ai/flows/generate-fashion-prompt";

export async function handleGeneratePrompt(input: GenerateFashionPromptInput) {
  try {
    const result = await generateFashionPrompt(input);
    return { prompt: result.prompt };
  } catch (error) {
    console.error("Error generating prompt:", error);
    return { error: "Gagal membuat prompt. Silakan coba lagi." };
  }
}
