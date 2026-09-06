"""Combine locally synthesized sentences with short practice pauses."""
import json
import subprocess
import sys
import wave
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / 'tmp' / 'video_deps'))
import imageio_ffmpeg

sentences = (HERE / 'texto_de.txt').read_text(encoding='utf-8').strip().split('. ')
sentences = [s if s.endswith('.') else s+'.' for s in sentences]
samples = bytearray()
timings = []
audio_format = None
paragraph_ends = {4, 6, 9, 11, 13, 14}
for i, text in enumerate(sentences):
    with wave.open(str(HERE / 'clips' / f'{i+1:03d}.wav'), 'rb') as f:
        fmt = (f.getnchannels(), f.getsampwidth(), f.getframerate())
        if audio_format is None:
            audio_format = fmt
        assert fmt == audio_format
        data = f.readframes(f.getnframes())
    channels, sample_width, sample_rate = audio_format
    bytes_second = channels * sample_width * sample_rate
    start = len(samples) / bytes_second
    duration = len(data) / bytes_second
    timings.append({'type':'SentenceBoundary', 'offset':round(start*10000000), 'duration':round(duration*10000000), 'text':text})
    samples.extend(data)
    if i < len(sentences) - 1:
        pause = .55 if i in paragraph_ends else .28
        samples.extend(b'\x00' * (round(pause * sample_rate) * channels * sample_width))

wav = HERE / 'angela_narracion.wav'
with wave.open(str(wav), 'wb') as f:
    f.setnchannels(audio_format[0])
    f.setsampwidth(audio_format[1])
    f.setframerate(audio_format[2])
    f.writeframes(samples)
(HERE / 'timing.jsonl').write_text('\n'.join(json.dumps(t, ensure_ascii=False) for t in timings)+'\n', encoding='utf-8')
subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-hide_banner', '-loglevel', 'error', '-y', '-i', str(wav), '-c:a', 'libmp3lame', '-b:a', '192k', str(HERE/'angela_narracion.mp3')], check=True)
print(f'Combined {len(sentences)} sentences into {len(samples)/bytes_second:.2f} seconds.', flush=True)
