package com.startbd.voiceai.network

import com.startbd.voiceai.model.VoiceRequest
import com.startbd.voiceai.model.VoiceResponse
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL

class ApiClient {

    // CHANGE THIS TO YOUR RENDER URL
    companion object {
        const val BASE_URL = "https://voice-ai-f3pw.onrender.com"
        const val VOICE_ENDPOINT = "/api/voice"
    }

    suspend fun processCommand(
        textInput: String? = null,
        audioBase64: String? = null,
        mode: String = "agent",
        language: String = "bn"
    ): VoiceResponse = withContext(Dispatchers.IO) {

        val url = URL(BASE_URL + VOICE_ENDPOINT)
        val connection = url.openConnection() as HttpURLConnection

        try {
            connection.requestMethod = "POST"
            connection.setRequestProperty("Content-Type", "application/json")
            connection.setRequestProperty("Accept", "application/json")
            connection.connectTimeout = 60_000  // 60 second timeout (Render cold start)
            connection.readTimeout = 60_000
            connection.doOutput = true

            // Build JSON body
            val jsonBody = JSONObject().apply {
                textInput?.let { put("textInput", it) }
                audioBase64?.let { put("audioBase64", it) }
                put("mode", mode)
                put("language", language)
            }

            // Write request
            OutputStreamWriter(connection.outputStream).use { writer ->
                writer.write(jsonBody.toString())
                writer.flush()
            }

            // Read response
            val responseCode = connection.responseCode
            val reader = if (responseCode in 200..299) {
                BufferedReader(InputStreamReader(connection.inputStream))
            } else {
                BufferedReader(InputStreamReader(connection.errorStream ?: connection.inputStream))
            }

            val responseText = reader.use { it.readText() }
            parseResponse(responseText)

        } finally {
            connection.disconnect()
        }
    }

    private fun parseResponse(json: String): VoiceResponse {
        return try {
            val obj = JSONObject(json)
            VoiceResponse(
                translation = obj.optString("translation"),
                intent = obj.optString("intent", "general"),
                confidence = obj.optDouble("confidence", 0.0).toFloat(),
                culturalNote = obj.optString("culturalNote").takeIf { it.isNotBlank() },
                response = obj.optString("response"),
                llmUsed = obj.optString("llmUsed", "gemini"),
                promptForBuilder = obj.optString("promptForBuilder").takeIf { it.isNotBlank() },
                targetPlatform = obj.optString("targetPlatform").takeIf { it.isNotBlank() },
                lovableUrl = obj.optString("lovableUrl").takeIf { it.isNotBlank() },
                boltUrl = obj.optString("boltUrl").takeIf { it.isNotBlank() },
                processingTimeMs = obj.optLong("processingTimeMs", 0),
                error = obj.optString("error").takeIf { it.isNotBlank() }
            )
        } catch (e: Exception) {
            VoiceResponse(
                translation = "",
                intent = "general",
                confidence = 0f,
                response = "Parse error: ${e.message}",
                llmUsed = "none",
                error = e.message
            )
        }
    }
}
