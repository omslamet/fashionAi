import { genkit, configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

// Konfigurasi Genkit untuk menggunakan Google AI.
// Kunci API digunakan dari variabel lingkungan.
configureGenkit({
  plugins: [
    googleAI({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
    }),
  ],
  logLevel: 'debug',
  flowStateStore: 'file',
});

// Contoh sederhana
export const simplePrompt = genkit.prompt('simplePrompt', {
  models: [googleAI('gemini-1.5-flash')],
  tools: [],
  config: {
    safetySettings: [],
  },
  output: {},
});
