// STARTBD Commander V1 - Claude 3.5 Sonnet Client
// Used for: Coding tasks, technical implementation

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function callClaude(prompt: string, systemPrompt?: string): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: systemPrompt || `You are an expert software engineer and technical advisor for StartBD, a Bangladeshi tech company owned by Tawhid. You specialize in Next.js, React, TypeScript, Node.js, and AI integrations. Provide clear, production-ready code with explanations.`,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  })

  const content = message.content[0]
  if (content.type === 'text') {
    return content.text
  }
  throw new Error('Unexpected Claude response type')
}

export async function callClaudeWithHistory(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt?: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: systemPrompt || 'You are a helpful AI assistant for StartBD.',
    messages,
  })

  const content = message.content[0]
  if (content.type === 'text') {
    return content.text
  }
  throw new Error('Unexpected Claude response type')
}
