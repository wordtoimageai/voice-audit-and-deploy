// STARTBD Commander V1 - OpenAI GPT-4o Client (Lazy Init)
// Used for: Creative content, image prompts, web building prompts

import OpenAI from 'openai'

// Lazy initialization - only create client when actually needed
function getOpenAI(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not set')
  return new OpenAI({ apiKey })
}

export async function callGPT4o(prompt: string, systemPrompt?: string): Promise<string> {
  const openai = getOpenAI()
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: systemPrompt || `You are STARTBD Commander, an AI assistant for Tawhid, a Bangladeshi digital entrepreneur. You specialize in creative content, image prompts, web building, social media, and business growth for Bangladesh context.`,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    max_tokens: 2048,
    temperature: 0.8,
  })

  return completion.choices[0]?.message?.content || ''
}

export async function generateImagePrompt(userRequest: string): Promise<string> {
  const prompt = `Create a detailed, optimized image generation prompt for this request: "${userRequest}"

Return ONLY the image prompt, nothing else. Make it vivid, specific, and suitable for DALL-E 3 or Midjourney.`
  return callGPT4o(prompt)
}

export async function buildWebsitePrompt(requirements: string): Promise<string> {
  const systemPrompt = `You are an expert web developer and prompt engineer. Create comprehensive prompts for AI website builders like Lovable, v0, or Bolt.`
  const prompt = `Create a detailed website building prompt for: "${requirements}"

Include: layout, color scheme, features, components, tech stack suggestions.`
  return callGPT4o(prompt, systemPrompt)
}
