// STARTBD Commander V1 - Voice Recorder Hook
// Captures audio from browser mic, converts to base64 for API

import { useState, useRef, useCallback } from 'react'

export type RecordingState = 'idle' | 'recording' | 'processing' | 'done' | 'error'

export interface UseVoiceRecorderReturn {
  recordingState: RecordingState
  audioBlob: Blob | null
  audioBase64: string | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  resetRecording: () => void
  error: string | null
  durationMs: number
}

export function useVoiceRecorder(): UseVoiceRecorderReturn {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioBase64, setAudioBase64] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [durationMs, setDurationMs] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)

  const startRecording = useCallback(async () => {
    try {
      setError(null)
      setAudioBlob(null)
      setAudioBase64(null)
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        }
      })

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm'

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: mimeType })
        setAudioBlob(blob)
        setDurationMs(Date.now() - startTimeRef.current)

        // Convert to base64
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(',')[1]
          setAudioBase64(base64)
          setRecordingState('done')
        }
        reader.readAsDataURL(blob)

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start(250) // collect data every 250ms
      startTimeRef.current = Date.now()
      setRecordingState('recording')

    } catch (err: any) {
      console.error('[useVoiceRecorder] Error:', err)
      setError(err.message || 'Failed to access microphone')
      setRecordingState('error')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop()
      setRecordingState('processing')
    }
  }, [recordingState])

  const resetRecording = useCallback(() => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop()
    }
    setRecordingState('idle')
    setAudioBlob(null)
    setAudioBase64(null)
    setError(null)
    setDurationMs(0)
    chunksRef.current = []
  }, [recordingState])

  return {
    recordingState,
    audioBlob,
    audioBase64,
    startRecording,
    stopRecording,
    resetRecording,
    error,
    durationMs,
  }
}
