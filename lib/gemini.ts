// STARTBD Commander V1 - Gemini 2.0 Flash Client (Lazy Init)
// Primary LLM: Speed, Bangla STT, Intent Classification

import { GoogleGenerativeAI } from '@google/generative-ai'

// Lazy initialization - only create client when actually needed
function getGeminiFlash() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY not set')
  const genAI = new GoogleGenerativeAI(apiKey)
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
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

Always respond in JSON format:
{
  "translation": "English translation of input",
  "intent": "intent_category",
  "confidence": 0.95,
  "culturalNote": "optional cultural context",
  "actionData": {}
}`

export async function translateAndClassify(banglaInput: string): Promise<{
  translation: string
  intent: string
  confidence: number
  culturalNote?: string
  actionData?: Record<string, unknown>
}> {
  const model = getGeminiFlash()
  const result = await model.generateContent([
    { text: BANGLA_SYSTEM_PROMPT },
    { text: `User input: "${banglaInput}"` },
  ])
  
  const responseText = result.response.text()
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
  } catch {
    // fallback
  }
  
  return {
    translation: banglaInput,
    intent: 'translate_only',
    confidence: 0.5,
  }
}

export async function callGemini(prompt: string): Promise<string> {
  const model = getGeminiFlash()
  const result = await model.generateContent(prompt)
  return result.response.text()
}
