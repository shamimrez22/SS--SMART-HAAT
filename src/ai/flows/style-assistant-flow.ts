
'use server';
/**
 * @fileOverview A Business & Style Strategist AI for SS SMART HAAT.
 * Provides advice on fashion, inventory management, and site optimization.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StyleAssistantInputSchema = z.object({
  userQuery: z.string().describe('The user question about fashion, products, or site management.'),
  context: z.string().optional().describe('Context like current season, stock levels, or site performance.'),
});

const StyleAssistantOutputSchema = z.object({
  advice: z.string().describe('Styling advice, business strategy, or management recommendation.'),
  suggestedColors: z.array(z.string()).describe('A list of colors or themes that would work well.'),
  vibe: z.string().describe('The overall aesthetic or strategic vibe.'),
});

export type StyleAssistantInput = z.infer<typeof StyleAssistantInputSchema>;
export type StyleAssistantOutput = z.infer<typeof StyleAssistantOutputSchema>;

export async function getStyleAdvice(input: StyleAssistantInput): Promise<StyleAssistantOutput> {
  return styleAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleAssistantPrompt',
  input: { schema: StyleAssistantInputSchema },
  output: { schema: StyleAssistantOutputSchema },
  prompt: `You are the "Ultimate Business & Style Strategist" for "SS SMART HAAT", the most exclusive luxury marketplace in Bangladesh.
Your role is twofold:
1. EXECUTIVE STYLE: Advise the Dhaka elite on high-end fashion, textures (Jamdani, Silk, Premium Wool), and global trends.
2. SITE STRATEGIST: Provide advice on how to optimize the website, improve sales, and manage inventory effectively.

If the user asks about site optimization or changes, provide expert tips on presentation, product photography, or marketing. 
If the user asks in Bengali, respond in "Elegant Banglish"—a mix of high-class Bengali and English common in Banani/Gulshan circles.

User Query: {{{userQuery}}}
Context: {{{context}}}

Provide high-impact, professional advice that emphasizes status, exclusivity, and efficiency.`,
});

const styleAssistantFlow = ai.defineFlow(
  {
    name: 'styleAssistantFlow',
    inputSchema: StyleAssistantInputSchema,
    outputSchema: StyleAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
