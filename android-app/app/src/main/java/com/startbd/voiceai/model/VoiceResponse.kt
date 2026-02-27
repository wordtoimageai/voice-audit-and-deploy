package com.startbd.voiceai.model

data class VoiceResponse(
    val translation: String,
    val intent: String,
    val confidence: Float,
    val culturalNote: String? = null,
    val response: String,
    val llmUsed: String,
    val promptForBuilder: String? = null,
    val targetPlatform: String? = null,
    val lovableUrl: String? = null,
    val boltUrl: String? = null,
    val processingTimeMs: Long = 0,
    val error: String? = null
)

data class VoiceRequest(
    val textInput: String? = null,
    val audioBase64: String? = null,
    val mode: String = "agent",
    val language: String = "bn"
)
