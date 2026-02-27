'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'

export default function Dashboard() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textInput: input, mode: 'agent', language: 'bn' }),
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ error: String(err) })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-400">STARTBD AI</h1>
          <p className="mt-2 text-gray-400">ভয়েস কমান্ডার V1 - Web Edition</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="বাংলায় বা English এ লিখুন..."
            disabled={loading}
            className="flex-1 bg-gray-900 text-white border-gray-800"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing</> : 'Send'}
          </Button>
        </form>

        {/* Result */}
        {result && (
          <div className="space-y-4">
            {result.error && (
              <div className="rounded-lg bg-red-900/20 p-4 text-red-400">
                <strong>Error:</strong> {result.error}
              </div>
            )}

            {result.translation && (
              <div className="rounded-lg bg-gray-900 p-4">
                <div className="text-sm text-gray-500 mb-1">Translation:</div>
                <div className="text-blue-400">{result.translation}</div>
              </div>
            )}

            {result.culturalNote && (
              <div className="rounded-lg bg-gray-900 p-4">
                <div className="text-sm text-gray-500 mb-1">Cultural Note:</div>
                <div className="text-orange-400">{result.culturalNote}</div>
              </div>
            )}

            {result.response && result.response !== result.translation && (
              <div className="rounded-lg bg-gray-900 p-4">
                <div className="text-sm text-gray-500 mb-1">AI Response ({result.llmUsed}):</div>
                <div className="text-white whitespace-pre-wrap">{result.response}</div>
              </div>
            )}

            {result.intent && (
              <div className="rounded-lg bg-gray-900 p-4">
                <div className="text-sm text-gray-500 mb-1">Intent:</div>
                <div className="inline-block rounded-full bg-purple-900/30 px-3 py-1 text-sm text-purple-400">
                  {result.intent}
                </div>
                {result.confidence && (
                  <span className="ml-3 text-gray-500 text-sm">Confidence: {(result.confidence * 100).toFixed(0)}%</span>
                )}
              </div>
            )}

            {(result.lovableUrl || result.boltUrl) && (
              <div className="rounded-lg bg-gray-900 p-4 space-y-2">
                <div className="text-sm text-gray-500 mb-2">Builder Links:</div>
                {result.lovableUrl && (
                  <a
                    href={result.lovableUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded bg-purple-600 px-4 py-2 text-center text-white hover:bg-purple-700"
                  >
                    Open in Lovable.dev
                  </a>
                )}
                {result.boltUrl && (
                  <a
                    href={result.boltUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
                  >
                    Open in Bolt.new
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
