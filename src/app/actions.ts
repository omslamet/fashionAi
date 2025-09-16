"use server";

import { generateFashionPrompt, GenerateFashionPromptInput } from "@/ai/flows/generate-fashion-prompt";
import { describeImage, DescribeImageInput } from "@/ai/flows/describe-image-flow";
import { configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

async function initializeGenkit(clientApiKey?: string) {
  const apiKey = clientApiKey || process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("Tidak ada API Key Gemini yang dikonfigurasi. Harap masukkan satu di sisi klien atau atur di lingkungan server.");
  }
  
  // Re-configure Genkit with the determined API key
  configureGenkit({
    plugins: [
      googleAI({
        apiKey: apiKey,
      }),
    ],
  });
}

export async function handleGeneratePrompt(input: GenerateFashionPromptInput, apiKey: string) {
  try {
    await initializeGenkit(apiKey);
    const result = await generateFashionPrompt(input);
    return { prompt: result.prompt };
  } catch (error: any) {
    console.error("Error generating prompt:", error);
    let errorMessage = "Gagal membuat prompt. Silakan coba lagi.";
    if (error.message && error.message.includes('API key not valid')) {
        errorMessage = "API Key tidak valid. Silakan periksa kembali kunci Anda.";
    } else if (error.message) {
        errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}

export async function handleDescribeImage(input: DescribeImageInput, apiKey: string) {
  try {
    await initializeGenkit(apiKey);
    const result = await describeImage(input);
    return { description: result.description };
  } catch (error: any) {
    console.error("Error describing image:", error);
    let errorMessage = "Gagal membuat deskripsi dari gambar. Silakan coba lagi.";
    if (error.message && error.message.includes('API key not valid')) {
        errorMessage = "API Key tidak valid. Silakan periksa kembali kunci Anda.";
    } else if (error.message) {
        errorMessage = error.message;
    }
    return { error: errorMessage };
  }
}
