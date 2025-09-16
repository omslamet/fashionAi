import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// We will no longer rely on the environment variable for the API key by default.
// The key will be passed dynamically from the client.
export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GOOGLE_API_KEY || 'dummy-key'})],
  model: 'googleai/gemini-1.5-flash',
});
