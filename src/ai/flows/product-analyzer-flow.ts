'use server';
/**
 * @fileOverview Product Image Analyzer AI for SS SMART HAAT.
 * Extracts product name, description, and category from an image.
 *
 * - analyzeProductImage - Function to handle the analysis.
 * - ProductAnalysisInput - Input type (data URI).
 * - ProductAnalysisOutput - Output type (name, description, category).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProductAnalysisInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of a product, as a data URI. Format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ProductAnalysisInput = z.infer<typeof ProductAnalysisInputSchema>;

const ProductAnalysisOutputSchema = z.object({
  name: z.string().describe('A premium, uppercase title for the product.'),
  description: z.string().describe('A high-end, concise description in uppercase.'),
  category: z.string().describe('The most fitting category (e.g., FASHION, ACCESSORIES, FOOTWEAR, BEAUTY).'),
});
export type ProductAnalysisOutput = z.infer<typeof ProductAnalysisOutputSchema>;

export async function analyzeProductImage(input: ProductAnalysisInput): Promise<ProductAnalysisOutput> {
  return productAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productAnalyzerPrompt',
  input: { schema: ProductAnalysisInputSchema },
  output: { schema: ProductAnalysisOutputSchema },
  prompt: `You are a high-end luxury fashion consultant for "SS SMART HAAT". 
Analyze the provided image and generate metadata for the product archive.

RULES:
1. NAME: Must be short, bold, and in ALL UPPERCASE (e.g., "PREMIUM SILK JAMDANI").
2. DESCRIPTION: Must be elegant, professional, and in ALL UPPERCASE. Focus on quality and exclusivity.
3. CATEGORY: Choose one: FASHION, ACCESSORIES, FOOTWEAR, BEAUTY, or WATCHES.

Photo: {{media url=photoDataUri}}`,
});

const productAnalyzerFlow = ai.defineFlow(
  {
    name: 'productAnalyzerFlow',
    inputSchema: ProductAnalysisInputSchema,
    outputSchema: ProductAnalysisOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
