package com.startbd.voiceai.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.startbd.voiceai.model.VoiceResponse
import com.startbd.voiceai.network.ApiClient
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class UiState(
    val isListening: Boolean = false,
    val isLoading: Boolean = false,
    val partialText: String = "",
    val inputText: String = "",
    val response: VoiceResponse? = null,
    val error: String? = null,
    val rmsLevel: Float = 0f
)

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val _uiState = MutableStateFlow(UiState())
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    private val apiClient = ApiClient()

    fun setListening(listening: Boolean) {
        _uiState.value = _uiState.value.copy(
            isListening = listening,
            error = if (listening) null else _uiState.value.error
        )
    }

    fun updateRms(rms: Float) {
        _uiState.value = _uiState.value.copy(rmsLevel = rms)
    }

    fun setPartialText(text: String) {
        _uiState.value = _uiState.value.copy(partialText = text)
    }

    fun setError(error: String) {
        _uiState.value = _uiState.value.copy(
            error = error,
            isLoading = false,
            isListening = false
        )
    }

    fun processVoiceInput(text: String) {
        _uiState.value = _uiState.value.copy(
            inputText = text,
            partialText = "",
            isListening = false,
            isLoading = true,
            error = null,
            response = null
        )

        viewModelScope.launch {
            try {
                val result = apiClient.processCommand(
                    textInput = text,
                    mode = "agent",
                    language = "bn"
                )
                _uiState.value = _uiState.value.copy(
                    response = result,
                    isLoading = false,
                    error = null
                )
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    error = "API Error: ${e.message}",
                    isLoading = false
                )
            }
        }
    }

    fun processTextInput(text: String) {
        processVoiceInput(text)
    }

    fun clearResponse() {
        _uiState.value = _uiState.value.copy(
            response = null,
            inputText = "",
            error = null
        )
    }
}
