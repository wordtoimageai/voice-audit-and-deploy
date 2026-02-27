package com.startbd.voiceai.ui

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.startbd.voiceai.viewmodel.MainViewModel

// Color palette - dark AI theme
val DarkBg = Color(0xFF0A0A0F)
val CardBg = Color(0xFF12121A)
val AccentBlue = Color(0xFF4F8EF7)
val AccentPurple = Color(0xFF8B5CF6)
val AccentGreen = Color(0xFF10B981)
val AccentOrange = Color(0xFFF59E0B)
val TextPrimary = Color(0xFFE8E8F0)
val TextSecondary = Color(0xFF9090A0)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    viewModel: MainViewModel,
    onMicClick: () -> Unit,
    onActionClick: (action: String, data: String) -> Unit
) {
    val state by viewModel.uiState.collectAsState()
    var textInput by remember { mutableStateOf(TextFieldValue("")) }

    // Pulsing animation when listening
    val pulseAnim = rememberInfiniteTransition(label = "pulse")
    val pulseScale by pulseAnim.animateFloat(
        initialValue = 1f,
        targetValue = if (state.isListening) 1.2f else 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(600, easing = EaseInOut),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse_scale"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(DarkBg)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(24.dp))

            // Header
            Text(
                text = "STARTBD AI",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = AccentBlue
            )
            Text(
                text = "ভয়েস কমান্ডার V1",
                fontSize = 14.sp,
                color = TextSecondary
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Mic Button (main UI element)
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .size(120.dp)
                    .scale(pulseScale)
                    .clip(CircleShape)
                    .background(
                        Brush.radialGradient(
                            colors = if (state.isListening)
                                listOf(AccentPurple.copy(alpha = 0.8f), AccentBlue.copy(alpha = 0.6f))
                            else
                                listOf(AccentBlue.copy(alpha = 0.3f), CardBg)
                        )
                    )
                    .border(2.dp, if (state.isListening) AccentPurple else AccentBlue, CircleShape)
                    .clickable { onMicClick() }
            ) {
                Icon(
                    imageVector = if (state.isListening) Icons.Default.Mic else Icons.Default.MicNone,
                    contentDescription = "Voice Input",
                    tint = if (state.isListening) Color.White else AccentBlue,
                    modifier = Modifier.size(48.dp)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Listening status
            Text(
                text = when {
                    state.isListening -> "শুনছি... বলুন"
                    state.isLoading -> "বিশ্লেষণ করছি..."
                    else -> "ট্যাপ করে বলুন"
                },
                color = if (state.isListening) AccentPurple else TextSecondary,
                fontSize = 14.sp
            )

            // Partial speech text
            if (state.partialText.isNotBlank()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = state.partialText,
                    color = TextPrimary.copy(alpha = 0.7f),
                    fontSize = 14.sp,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 32.dp)
                )
            }

            Spacer(modifier = Modifier.height(20.dp))

            // Text Input (alternative to voice)
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = textInput,
                    onValueChange = { textInput = it },
                    placeholder = { Text("টাইপ করুন...", color = TextSecondary) },
                    modifier = Modifier.weight(1f),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = TextPrimary,
                        unfocusedTextColor = TextPrimary,
                        focusedBorderColor = AccentBlue,
                        unfocusedBorderColor = TextSecondary.copy(alpha = 0.3f),
                        cursorColor = AccentBlue
                    ),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true
                )
                Spacer(modifier = Modifier.width(8.dp))
                IconButton(
                    onClick = {
                        if (textInput.text.isNotBlank()) {
                            viewModel.processTextInput(textInput.text)
                            textInput = TextFieldValue("")
                        }
                    },
                    modifier = Modifier
                        .clip(CircleShape)
                        .background(AccentBlue)
                        .size(48.dp)
                ) {
                    Icon(Icons.Default.Send, contentDescription = "Send", tint = Color.White)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Loading
            if (state.isLoading) {
                CircularProgressIndicator(
                    color = AccentBlue,
                    modifier = Modifier.size(32.dp)
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            // Error
            state.error?.let { error ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFF2D1515)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        text = error,
                        color = Color(0xFFEF4444),
                        modifier = Modifier.padding(16.dp),
                        fontSize = 13.sp
                    )
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            // Response Card
            state.response?.let { response ->
                // Input echo
                if (state.inputText.isNotBlank()) {
                    ResponseSection("আপনি বললেন:", state.inputText, TextSecondary)
                }

                // Translation
                if (response.translation.isNotBlank()) {
                    ResponseSection("অনুবাদ (Translation):", response.translation, AccentBlue)
                }

                // Cultural note
                response.culturalNote?.let { note ->
                    ResponseSection("সাংস্কৃতিক বিশ্লেষণ:", note, AccentOrange)
                }

                // Main AI response
                if (response.response.isNotBlank() && response.response != response.translation) {
                    ResponseSection("AI Response:", response.response, TextPrimary)
                }

                // Intent badge
                IntentBadge(intent = response.intent, llmUsed = response.llmUsed)

                // Action buttons
                Spacer(modifier = Modifier.height(16.dp))
                when (response.intent) {
                    "open_youtube" -> {
                        ActionButton("YouTube খুলুন", AccentOrange) {
                            onActionClick("open_youtube", response.translation)
                        }
                    }
                    "open_camera" -> {
                        ActionButton("Camera খুলুন", AccentGreen) {
                            onActionClick("open_camera", "")
                        }
                    }
                    "call_contact" -> {
                        ActionButton("Call করুন", AccentGreen) {
                            onActionClick("call_contact", response.translation)
                        }
                    }
                    "web_building" -> {
                        response.lovableUrl?.let { url ->
                            ActionButton("Lovable-এ বানান", AccentPurple) {
                                onActionClick("open_lovable", url)
                            }
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        response.boltUrl?.let { url ->
                            ActionButton("Bolt.new-এ বানান", AccentBlue) {
                                onActionClick("open_bolt", url)
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(8.dp))
                // Clear button
                TextButton(onClick = { viewModel.clearResponse() }) {
                    Text("Clear", color = TextSecondary)
                }
            }

            Spacer(modifier = Modifier.height(80.dp))
        }
    }
}

@Composable
fun ResponseSection(label: String, content: String, textColor: Color) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        colors = CardDefaults.cardColors(containerColor = CardBg),
        shape = RoundedCornerShape(12.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(text = label, color = TextSecondary, fontSize = 11.sp, fontWeight = FontWeight.Medium)
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = content, color = textColor, fontSize = 14.sp, lineHeight = 20.sp)
        }
    }
    Spacer(modifier = Modifier.height(8.dp))
}

@Composable
fun IntentBadge(intent: String, llmUsed: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Chip(text = intent, color = AccentPurple)
        Chip(text = llmUsed, color = AccentBlue)
    }
}

@Composable
fun Chip(text: String, color: Color) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(20.dp))
            .background(color.copy(alpha = 0.15f))
            .border(1.dp, color.copy(alpha = 0.5f), RoundedCornerShape(20.dp))
            .padding(horizontal = 10.dp, vertical = 4.dp)
    ) {
        Text(text = text, color = color, fontSize = 11.sp, fontWeight = FontWeight.Medium)
    }
}

@Composable
fun ActionButton(text: String, color: Color, onClick: () -> Unit) {
    Button(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        colors = ButtonDefaults.buttonColors(containerColor = color),
        shape = RoundedCornerShape(12.dp)
    ) {
        Text(text, color = Color.White, fontWeight = FontWeight.Bold)
    }
}
