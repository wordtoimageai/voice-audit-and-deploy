// STARTBD Commander V1 - Perplexity AI Client
// Used for: Deep research, real-time web search

export async function callPerplexity(prompt: string, systemPrompt?: string): Promise<string> {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: systemPrompt || `You are a research assistant for StartBD, a Bangladeshi digital company. Provide accurate, up-to-date information with sources. Focus on practical insights relevant to Bangladeshi entrepreneurs and digital businesses.`,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2048,
      temperature: 0.2,
      return_citations: true,
      return_related_questions: false,
      search_recency_filter: 'week',
    }),
  })

  if (!response.ok) {
    throw new Error(`Perplexity API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || ''
}

export async function researchDomainMarket(domain: string): Promise<string> {
  return callPerplexity(
    `Research the current market value and demand for the domain name "${domain}". Include: comparable sales, keyword search volume, industry trends, and recommended listing price on Sedo or Afternic.`
  )
}

export async function researchCompetitor(niche: string): Promise<string> {
  return callPerplexity(
    `Research the competitive landscape for "${niche}" in Bangladesh and Southeast Asia. Include: top competitors, market opportunities, and content strategy recommendations.`
  )
}
