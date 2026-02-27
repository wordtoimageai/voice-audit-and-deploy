// STARTBD Commander V1 - LLM Router (Orchestrator Brain)
// Routes intent to correct AI: Gemini / Claude / GPT-4o / Perplexity

import { AgentIntent, AgentRequest, AgentResponse } from '@/types/agent'
import { transcribeAudio, translateAndClassify } from '@/lib/gemini'
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

    console.log('[Router] Processing input:', inputText.substring(0, 100))

    // Step 2: If translate_only mode - just translate
    if (request.mode === 'translate_only') {
      const result = await translateAndClassify(inputText)
      return {
        translation: result.translation,
        intent: 'translate_only' as AgentIntent,
        confidence: result.confidence,
        culturalNote: result.culturalNote,
        response: result.translation,
        llmUsed: 'gemini',
        processingTimeMs: Date.now() - startTime,
      } as AgentResponse
    }

    // Step 3: Agent mode - classify intent first with Gemini
    const classified = await translateAndClassify(inputText)
    console.log('[Router] Classified:', { intent: classified.intent, confidence: classified.confidence })
    const intent: AgentIntent = (classified.intent as AgentIntent) || 'general'

    // Step 4: Route to correct LLM based on intent
    let finalResponse = classified.translation || inputText
    let llmUsed: string = 'gemini'
    let promptForBuilder: string | undefined
    let targetPlatform: string | undefined

    switch (intent) {
      case 'coding_task': {
        if (process.env.ANTHROPIC_API_KEY) {
          finalResponse = await callClaude(
            `Build this: ${classified.translation}\n\nOriginal request: ${inputText}`,
            'You are an expert software engineer. Provide complete, working code.'
          )
          llmUsed = 'claude'
        } else {
          console.warn('[Router] Claude not configured, using Gemini fallback')
        }
        break
      }
      case 'deep_research': {
        if (process.env.PERPLEXITY_API_KEY) {
          finalResponse = await callPerplexity(classified.translation || inputText)
          llmUsed = 'perplexity'
        } else {
          console.warn('[Router] Perplexity not configured, using Gemini fallback')
        }
        break
      }
      case 'creative_content':
      case 'image_generate':
      case 'email_generate': {
        if (process.env.OPENAI_API_KEY) {
          finalResponse = await callGPT4o(classified.translation || inputText)
          llmUsed = 'gpt4o'
        } else {
          console.warn('[Router] OpenAI not configured, using Gemini fallback')
        }
        break
      }
      case 'web_building': {
        if (process.env.OPENAI_API_KEY) {
          const webPrompt = await callGPT4o(
            `Create a detailed website specification for: ${classified.translation}`,
            'You are a senior web architect. Create comprehensive website specs.'
          )
          finalResponse = webPrompt
          promptForBuilder = webPrompt
          targetPlatform = 'lovable'
          llmUsed = 'gpt4o'
        } else {
          promptForBuilder = classified.translation || inputText
          targetPlatform = 'lovable'
          console.warn('[Router] OpenAI not configured, using direct prompt for builder')
        }
        break
      }
      case 'domain_update':
      case 'domain_check': {
        finalResponse = `Domain action: ${classified.translation}. Use Sedo/Afternic dashboard to execute.`
        llmUsed = 'gemini'
        break
      }
      case 'social_post':
      case 'social_analytics': {
        finalResponse = `Social media action: ${classified.translation}. Instagram @interiorofai integration active.`
        llmUsed = 'gemini'
        break
      }
      default: {
        // general, translate_only, call_contact, open_camera, open_youtube handled by client
        finalResponse = classified.translation || inputText
        llmUsed = 'gemini'
      }
    }

    const lovableUrl = promptForBuilder ? buildLovableURL(promptForBuilder) : undefined
    const boltUrl = promptForBuilder ? buildBoltURL(promptForBuilder) : undefined

    return {
      translation: classified.translation,
      intent,
      confidence: classified.confidence,
      culturalNote: classified.culturalNote,
      response: finalResponse,
      llmUsed,
      promptForBuilder,
      targetPlatform,
      lovableUrl,
      boltUrl,
      processingTimeMs: Date.now() - startTime,
    } as AgentResponse

  } catch (error) {
    console.error('[Router] routeCommand error:', error instanceof Error ? error.message : error)
    return {
      translation: '',
      intent: 'general' as AgentIntent,
      confidence: 0,
      response: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      llmUsed: 'none',
      processingTimeMs: Date.now() - startTime,
    } as AgentResponse
  }
}
