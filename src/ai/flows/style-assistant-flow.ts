
'use server';
/**
 * @fileOverview An AI style assistant for SS SMART HAAT.
 * Specialized for the Dhaka high-society fashion scene.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StyleAssistantInputSchema = z.object({
  userQuery: z.string().describe('The user question about fashion or a specific product.'),
  context: z.string().optional().describe('Additional context like current season or user preference.'),
});

const StyleAssistantOutputSchema = z.object({
  advice: z.string().describe('Styling advice or product recommendation.'),
  suggestedColors: z.array(z.string()).describe('A list of colors that would work well.'),
  vibe: z.string().describe('The overall aesthetic vibe (e.g., "Minimalist Noir", "Royal Heritage").'),
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
  prompt: `You are the Executive Style Consultant for "SS SMART HAAT", the most exclusive luxury boutique in Bangladesh.
Your audience is the Dhaka elite—business moguls, celebrities, and tastemakers.
Your tone is incredibly sophisticated, slightly mysterious, and deeply knowledgeable about global trends and local heritage.

If the user asks in Bengali, respond in "Elegant Banglish"—a mix of high-class Bengali and English that feels natural to the Banani/Gulshan social circles.

User Question: {{{userQuery}}}
Context: {{{context}}}

Provide a recommendation that emphasizes exclusivity, craftsmanship, and status. Reference textures like Jamdani silk or premium wool if appropriate.`,
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
