import { ref, type Ref } from 'vue';
import { aiErrorMessage } from './gemini-client';
import { gemini, logAiError, responseParts, type GenerateContentResponse } from './gemini';
import { base64ToBytes, pcmToWav, sampleRateFromMime, speakableText } from './audio';

const ERROR_LABEL_MS = 3000;

// Only one voice plays at a time across the page, as in the original.
let currentAudio: HTMLAudioElement | null = null;

function stopCurrentAudio(): boolean {
  if (!currentAudio) return false;
  currentAudio.pause();
  currentAudio = null;
  return true;
}

async function synthesizeWav(text: string): Promise<Blob> {
  const payload = {
    contents: [{ parts: [{ text: `Say in a warm, formal, professional educational tone: ${text}` }] }],
    generationConfig: {
      responseModalities: ['AUDIO'],
      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
    },
  };
  const response = await gemini.call<GenerateContentResponse>(
    'gemini-2.5-flash-preview-tts:generateContent',
    payload,
  );
  const inline = responseParts(response)[0]?.inlineData;
  if (!inline?.data || !inline.mimeType?.startsWith('audio/')) throw new Error('Formato no válido');
  const bytes = base64ToBytes(inline.data);
  const pcm16 = new Int16Array(bytes.buffer, 0, Math.floor(bytes.byteLength / 2));
  return new Blob([pcmToWav(pcm16, sampleRateFromMime(inline.mimeType))], { type: 'audio/wav' });
}

export interface SpeechButton {
  busy: Ref<boolean>;
  label: Ref<string>;
  /** Plays the text, or stops whatever is playing. */
  toggle: (text: string) => Promise<void>;
  /** Replaces whatever is playing with the text. */
  speak: (text: string) => Promise<void>;
}

export function useSpeechButton(idleLabel: string): SpeechButton {
  const busy = ref(false);
  const label = ref(idleLabel);
  const reset = () => {
    busy.value = false;
    label.value = idleLabel;
  };

  async function play(text: string): Promise<void> {
    const url = URL.createObjectURL(await synthesizeWav(speakableText(text)));
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      if (currentAudio === audio) currentAudio = null;
      reset();
    };
    await audio.play();
  }

  async function speak(text: string): Promise<void> {
    stopCurrentAudio();
    busy.value = true;
    label.value = 'IA Hablando...';
    try {
      await play(text);
    } catch (error) {
      logAiError('Gemini TTS Error:', error);
      busy.value = false;
      label.value = aiErrorMessage(error, 'No disponible temporalmente');
      setTimeout(reset, ERROR_LABEL_MS);
    }
  }

  async function toggle(text: string): Promise<void> {
    if (stopCurrentAudio()) return reset();
    await speak(text);
  }

  return { busy, label, toggle, speak };
}

export function stopSpeech(): void {
  stopCurrentAudio();
}
