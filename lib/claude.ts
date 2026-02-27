// STARTBD Commander V1 - Claude 3.5 Sonnet Client (Lazy Init)
// Used for: Coding tasks, technical implementation

import Anthropic from '@anthropic-ai/sdk'

function getAnthropic(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set')
  return new Anthropic({ apiKey })
}

export async function callClaude(prompt: string, systemPrompt?: string): Promise<string> {
  const anthropic = getAnthropic()
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: systemPrompt || `You are STARTBD Commander, an expert software engineer and technical advisor for Tawhid, a Bangladeshi tech entrepreneur. You specialize in Next.js, React, TypeScript, Node.js, and full-stack development.`,
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
  const anthropic = getAnthropic()
  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: systemPrompt || `You are STARTBD Commander, an expert software engineer for Tawhid.`,
    messages,
  })

  const content = message.content[0]
  if (content.type === 'text') {
    return content.text
  }
  throw new Error('Unexpected Claude response type')
}
