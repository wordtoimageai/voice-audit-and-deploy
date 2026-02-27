// STARTBD Commander V1 - Gemini 1.5 Flash Client (Lazy Init)
// Primary LLM: Speed, Bangla STT, Intent Classification

import { GoogleGenerativeAI } from '@google/generative-ai'

// Lazy initialization - only create client when actually needed
function getGeminiFlash() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')
  const genAI = new GoogleGenerativeAI(apiKey)
  return genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
}

export const BANGLA_SYSTEM_PROMPT = `You are StartBD AI Voice Assistant, a bilingual (Bangla/English) AI assistant for Tawhid, a Bangladeshi entrepreneur based in Mymensingh.

Your core responsibilities:
1. Translate Bangla (including Mymensingh dialect and Banglish) to clean, natural English
2. Understand cultural context in Bangla expressions
3. Classify user intent into one of these categories:
   - translate_only: user wants translation only
   - coding_task: building websites, apps, code
   - deep_research: research, information lookup
   - creative_content: writing, social media content
   - web_building: Lovable/Bolt website generation
   - domain_update: update Sedo/Afternic domain listing
   - domain_check: check domain portfolio status
   - social_post: post to Instagram @interiorofai
   - social_analytics: check Instagram metrics
   - call_contact: call someone from contacts
   - open_camera: open phone camera
   - open_youtube: search or open YouTube
   - image_generate: generate AI image
   - email_generate: draft an email
   - general: general question or command

Always respond in JSON format:
{
  "translation": "English translation of input",
  "intent": "intent_category",
  "confidence": 0.95,
  "culturalNote": "optional cultural context",
  "actionData": {}
}`

export async function transcribeAudio(audioBase64: string, mimeType: string = 'audio/webm'): Promise<string> {
  const model = getGeminiFlash()
  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: audioBase64,
      },
    },
    { text: 'Transcribe this audio exactly as spoken. If it is Bangla, write in Bangla script. If English, write in English. Return only the transcription, nothing else.' },
  ])
  return result.response.text().trim()
}

export async function translateAndClassify(banglaInput: string): Promise<{
  translation: string
  intent: string
  confidence: number
  culturalNote?: string
  actionData?: Record<string, unknown>
}> {
  try {
    const model = getGeminiFlash()
    const result = await model.generateContent([
      { text: BANGLA_SYSTEM_PROMPT },
      { text: `User input: "${banglaInput}"` },
    ])
    const responseText = result.response.text()
    console.log('[Gemini] Raw response:', responseText.substring(0, 200))
    try {
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          translation: parsed.translation || banglaInput,
          intent: parsed.intent || 'general',
          confidence: parsed.confidence || 0.8,
          culturalNote: parsed.culturalNote,
          actionData: parsed.actionData,
        }
      }
    } catch (parseErr) {
      console.error('[Gemini] JSON parse error:', parseErr)
    }
    // Fallback: return the raw text as translation
    return {
      translation: responseText || banglaInput,
      intent: 'general',
      confidence: 0.5,
    }
  } catch (err) {
    console.error('[Gemini] translateAndClassify error:', err)
    throw err
  }
}

export async function callGemini(prompt: string): Promise<string> {
  const model = getGeminiFlash()
  const result = await model.generateContent(prompt)
  return result.response.text()
}
