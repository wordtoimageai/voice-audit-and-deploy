// STARTBD Commander V1 - OpenAI GPT-4o Client
// Used for: Creative content, image prompts, web building prompts

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function callGPT4o(prompt: string, systemPrompt?: string): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: systemPrompt || `You are a creative AI assistant for StartBD, a Bangladeshi digital company owned by Tawhid. You specialize in creating compelling content, optimized prompts for AI tools, and creative copy. You understand Bangladeshi culture and market.`,
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

Format the prompt for DALL-E 3 or Midjourney. Include: subject, style, lighting, composition, quality modifiers.
Return ONLY the prompt text, nothing else.`

  return callGPT4o(prompt)
}

export async function generateEmailDraft(
  subject: string,
  context: string,
  tone: 'professional' | 'casual' | 'formal' = 'professional'
): Promise<{ subject: string; body: string }> {
  const prompt = `Write an email with the following details:
Subject context: ${subject}
Content context: ${context}
Tone: ${tone}

Return as JSON: { "subject": "...", "body": "..." }`

  const result = await callGPT4o(prompt)
  try {
    return JSON.parse(result)
  } catch {
    return { subject, body: result }
  }
}

export async function generateSocialPost(
  topic: string,
  platform: string,
  account: string = '@interiorofai'
): Promise<string> {
  const prompt = `Create an engaging ${platform} post for ${account} about: ${topic}

Include: compelling caption, relevant hashtags, emoji usage appropriate for Bangladeshi AI/tech audience.
Return ONLY the post text.`

  return callGPT4o(prompt)
}
