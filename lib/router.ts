// STARTBD Commander V1 - LLM Router (Orchestrator Brain)
// Routes intent to correct AI: Gemini / Claude / GPT-4o / Perplexity

import { AgentIntent, AgentRequest, AgentResponse } from '@/types/agent'
import { transcribeAudio, transcribeAndClassify } from '@/lib/gemini'
import { callClaude } from '@/lib/claude'
import { callGPT4o } from '@/lib/openai'
import { callPerplexity } from '@/lib/perplexity'

function buildLovableURL(prompt: string): string {
  const encoded = encodeURIComponent(prompt)
  return `https://lovable.dev/?autosubmit=true#prompt=${encoded}`
}

function buildBoltURL(prompt: string): string {
  const encoded = encodeURIComponent(prompt)
  return `https://bolt.new/?prompt=${encoded}`
}

export async function routeCommand(request: AgentRequest): Promise<AgentResponse> {
  const startTime = Date.now()

  try {
    // Step 1: Get text from audio or use direct text
    let inputText = request.textInput || ''

    if (request.audioBase64 && !inputText) {
      inputText = await transcribeAudio(request.audioBase64, 'audio/webm')
    }

    if (!inputText) {
      throw new Error('No input provided')
    }

    // Step 2: If translate_only mode - just translate
    if (request.mode === 'translate_only') {
      const rawResult = await transcribeAndClassify(inputText)
      const parsed = safeParseJSON(rawResult)
      return {
        ...parsed,
        intent: 'translate_only',
        llmUsed: 'gemini',
      }
    }

    // Step 3: Agent mode - classify intent first with Gemini
    const rawResult = await transcribeAndClassify(inputText)
    const classified = safeParseJSON(rawResult)
    const intent: AgentIntent = classified.intent || 'general'

    // Step 4: Route to correct LLM based on intent
    let finalResponse = classified.response || ''
    let llmUsed: string = 'gemini'
    let promptForBuilder: string | undefined
    let targetPlatform: string | undefined

    switch (intent) {
      case 'coding_task':
        // Claude 3.5 Sonnet for coding
        finalResponse = await callClaude(classified.englishText)
        llmUsed = 'claude'
        break

      case 'deep_research':
        // Perplexity for research
        finalResponse = await callPerplexity(classified.englishText)
        llmUsed = 'perplexity'
        break

      case 'creative_content':
        // GPT-4o for creative tasks
        finalResponse = await callGPT4o(classified.englishText)
        llmUsed = 'gpt4o'
        break

      case 'web_building':
        // Build optimized prompt for Lovable
        const webPrompt = await callGPT4o(
          `Convert this to an optimized Lovable.dev website prompt: ${classified.englishText}`
        )
        promptForBuilder = webPrompt
        targetPlatform = 'lovable'
        finalResponse = buildLovableURL(webPrompt)
        llmUsed = 'lovable'
        break

      case 'image_generate':
        // GPT-4o for image prompt optimization
        const imgPrompt = await callGPT4o(
          `Create an optimized image generation prompt for this request: ${classified.englishText}`
        )
        classified.promptForImage = imgPrompt
        finalResponse = imgPrompt
        llmUsed = 'gpt4o'
        break

      default:
        // Default: Gemini Flash handles it
        llmUsed = 'gemini'
        break
    }

    return {
      transcriptBn: classified.transcriptBn || inputText,
      englishText: classified.englishText || inputText,
      intent,
      llmUsed: llmUsed as any,
      response: finalResponse,
      targetPlatform,
      promptForBuilder,
      promptForImage: classified.promptForImage,
      contactName: classified.contactName,
      phoneNumber: classified.phoneNumber,
      youtubeQuery: classified.youtubeQuery,
      appToOpen: classified.appToOpen,
      domainAction: classified.domainAction,
      socialAction: classified.socialAction,
    }

  } catch (error: any) {
    console.error('[STARTBD Commander] Router error:', error)
    return {
      transcriptBn: request.textInput || '',
      englishText: request.textInput || '',
      intent: 'general',
      llmUsed: 'gemini',
      response: 'Sorry, I encountered an error processing your command.',
      error: error.message,
    }
  }
}

function safeParseJSON(text: string): any {
  try {
    // Extract JSON from markdown code blocks if present
    const jsonMatch = text.match(/```(?:json)?\n?([\s\S]*?)\n?```/)
    const jsonStr = jsonMatch ? jsonMatch[1] : text
    return JSON.parse(jsonStr.trim())
  } catch {
    // Return a fallback object if parsing fails
    return {
      transcriptBn: text,
      englishText: text,
      intent: 'general',
      response: text,
    }
  }
}
