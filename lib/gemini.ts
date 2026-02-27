// STARTBD Commander V1 - Gemini 2.0 Flash Client
// Primary LLM: Speed, Bangla STT, Intent Classification

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const geminiFlash = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
})

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

4. Always respond in this exact JSON format:
{
  "transcriptBn": "original bangla text",
  "englishText": "clean natural english translation",
  "intent": "intent_category",
  "response": "your helpful response in English",
  "targetPlatform": "platform if applicable",
  "promptForBuilder": "optimized prompt if web_building",
  "promptForImage": "optimized image prompt if image_generate",
  "contactName": "name if call_contact",
  "youtubeQuery": "search query if open_youtube",
  "domainAction": null,
  "socialAction": null
}

Be culturally aware. Mymensingh Bangla dialect has unique expressions. Always be helpful and concise.`

export async function transcribeAndClassify(banglishText: string): Promise<string> {
  const model = geminiFlash
  const result = await model.generateContent([
    { text: BANGLA_SYSTEM_PROMPT },
    { text: `User said (Bangla/Banglish): ${banglishText}` },
  ])
  return result.response.text()
}

export async function geminiChat(prompt: string, systemContext?: string): Promise<string> {
  const model = geminiFlash
  const result = await model.generateContent([
    { text: systemContext || BANGLA_SYSTEM_PROMPT },
    { text: prompt },
  ])
  return result.response.text()
}

export async function transcribeAudio(audioBase64: string, mimeType: string = 'audio/webm'): Promise<string> {
  const model = geminiFlash
  const result = await model.generateContent([
    {
      inlineData: {
        mimeType,
        data: audioBase64,
      },
    },
    {
      text: 'Transcribe this audio. The speaker is likely speaking Bangla, Banglish, or English. Return ONLY the transcribed text, nothing else.',
    },
  ])
  return result.response.text()
}
