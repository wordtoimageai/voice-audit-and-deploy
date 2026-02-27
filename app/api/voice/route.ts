// STARTBD Commander V1 - Main Voice Command API Route
// POST /api/voice - Core entry point for all voice commands
// Handles: Bangla STT, intent classification, LLM routing

import { NextRequest, NextResponse } from 'next/server'
import { routeCommand } from '@/lib/router'
import { AgentRequest } from '@/types/agent'

export const runtime = 'nodejs'
export const maxDuration = 60 // 60 second timeout for LLM calls

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const request: AgentRequest = {
      audioBase64: body.audioBase64,
      textInput: body.textInput,
      mode: body.mode || 'agent',
      language: body.language || 'bn',
      context: body.context,
    }

    // Validate: must have either audio or text
    if (!request.audioBase64 && !request.textInput) {
      return NextResponse.json(
        { error: 'Either audioBase64 or textInput is required' },
        { status: 400 }
      )
    }

    console.log('[STARTBD Commander] Processing command:', {
      mode: request.mode,
      language: request.language,
      hasAudio: !!request.audioBase64,
      hasText: !!request.textInput,
      timestamp: new Date().toISOString(),
    })

    const result = await routeCommand(request)

    console.log('[STARTBD Commander] Result:', {
      intent: result.intent,
      llmUsed: result.llmUsed,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('[STARTBD Commander] API Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
        transcriptBn: '',
        englishText: '',
        intent: 'general',
        llmUsed: 'gemini',
        response: 'Sorry, something went wrong. Please try again.',
      },
      { status: 500 }
    )
  }
}

// GET: Test endpoint - check if voice API is working
export async function GET() {
  const hasGemini = !!process.env.GEMINI_API_KEY
  const hasOpenAI = !!process.env.OPENAI_API_KEY
  const hasClaude = !!process.env.ANTHROPIC_API_KEY
  const hasPerplexity = !!process.env.PERPLEXITY_API_KEY

  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/voice',
    project: 'STARTBD_COMMANDER_V1',
    owner: 'Tawhid',
    configured: {
      gemini: hasGemini,
      openai: hasOpenAI,
      claude: hasClaude,
      perplexity: hasPerplexity,
    },
    ready: hasGemini, // minimum: needs Gemini for core functionality
    timestamp: new Date().toISOString(),
  })
}
