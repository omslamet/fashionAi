import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Konfigurasi Genkit untuk menggunakan Google AI.
// Kunci API yang digunakan di sini berasal dari Google AI Studio dan berada di tingkat gratis (free tier).
// Tingkat gratis ini memiliki batasan permintaan (misalnya, 60 permintaan per menit) tetapi tidak mengenakan biaya per token.
// Kunci akan diteruskan secara dinamis dari klien, tetapi jika tidak ada, kunci dummy digunakan untuk inisialisasi.
export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY || 'dummy-key'})],
  model: 'googleai/gemini-1.5-flash',
});
