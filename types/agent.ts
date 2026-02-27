// STARTBD Commander V1 - Agent Types
// Owner: Tawhid | Project: STARTBD_COMMANDER_V1

export type AgentIntent =
  | 'translate_only'
  | 'coding_task'
  | 'deep_research'
  | 'creative_content'
  | 'web_building'
  | 'domain_update'
  | 'domain_check'
  | 'social_post'
  | 'social_analytics'
  | 'call_contact'
  | 'open_camera'
  | 'open_youtube'
  | 'open_app'
  | 'image_generate'
  | 'email_generate'
  | 'general'

export type LLMProvider =
  | 'gemini'
  | 'claude'
  | 'gpt4o'
  | 'perplexity'
  | 'lovable'
  | 'bolt'

export interface AgentRequest {
  audioBase64?: string
  textInput?: string
  mode: 'translate_only' | 'agent'
  language: 'bn' | 'en' | 'banglish'
  context?: string
}

export interface AgentResponse {
  transcriptBn: string
  englishText: string
  intent: AgentIntent
  llmUsed: LLMProvider
  response: string
  targetPlatform?: string
  promptForBuilder?: string
  promptForImage?: string
  emailSubject?: string
  emailBody?: string
  contactName?: string
  phoneNumber?: string
  youtubeQuery?: string
  appToOpen?: string
  domainAction?: DomainAction
  socialAction?: SocialAction
  error?: string
}

export interface DomainAction {
  type: 'check_listing' | 'update_price' | 'list_portfolio'
  domain?: string
  newPrice?: number
  marketplace?: 'sedo' | 'afternic' | 'atom'
}

export interface SocialAction {
  type: 'post' | 'analytics' | 'schedule'
  platform: 'instagram'
  account?: string
  caption?: string
  hashtags?: string[]
  imagePrompt?: string
}

export interface CommandHistory {
  id: string
  timestamp: string
  transcriptBn: string
  englishText: string
  intent: AgentIntent
  llmUsed: LLMProvider
  response: string
  duration: number
}
