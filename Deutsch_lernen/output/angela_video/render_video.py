"""Render a minimal pastel video, with sentence captions and reusable SRT."""
import json
import math
import subprocess
import sys
import wave
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
import numpy as np

HERE = Path(__file__).resolve().parent
W, H = 1920, 1080
FONT = Path('C:/Windows/Fonts/segoeui.ttf')
INK = (51, 62, 77)
LEAD = 0.65


def gradient():
    yy, xx = np.mgrid[0:H, 0:W]
    x, y = xx / (W - 1), yy / (H - 1)
    tl, tr = np.array([240, 237, 248]), np.array([248, 243, 241])
    bl, br = np.array([230, 241, 244]), np.array([246, 237, 233])
    top = tl[None, None, :] * (1-x[..., None]) + tr[None, None, :] * x[..., None]
    bottom = bl[None, None, :] * (1-x[..., None]) + br[None, None, :] * x[..., None]
    arr = top * (1-y[..., None]) + bottom * y[..., None]
    # Stable subpixel dithering avoids visible color bands in pale gradients.
    arr += np.random.default_rng(24).uniform(-0.8, 0.8, (H, W, 1))
    return Image.fromarray(np.clip(arr, 0, 255).astype('uint8'))


def wrap(text, font, draw, max_width):
    # Choose balanced lines to make long German sentences easy to read.
    words = text.split()
    if draw.textlength(text, font=font) <= max_width:
        return [text]
    candidates = []
    for pos in range(1, len(words)):
        lines = [' '.join(words[:pos]), ' '.join(words[pos:])]
        lengths = [draw.textlength(line, font=font) for line in lines]
        if max(lengths) <= max_width:
            score = abs(lengths[0] - lengths[1])
            if lines[0].endswith(','):
                score -= 120
            candidates.append((score, lines))
    if candidates:
        return min(candidates, key=lambda item: item[0])[1]
    lines, current = [], ''
    for word in words:
        test = f'{current} {word}'.strip()
        if current and draw.textlength(test, font=font) > max_width:
            lines.append(current)
            current = word
        else:
            current = test
    if current:
        lines.append(current)
    return lines


def frame(text='', number=None, total=16):
    im = gradient()
    d = ImageDraw.Draw(im)
    small = ImageFont.truetype(str(FONT), 28)
    d.text((W/2, 155), 'Angela  ·  Meine Vorstellung', font=small, fill=(111, 118, 132), anchor='mm')
    d.line((W/2-38, 209, W/2+38, 209), fill=(167, 171, 189), width=2)
    if text:
        font = ImageFont.truetype(str(FONT), 65)
        lines = wrap(text, font, d, 1650)
        assert len(lines) <= 3, (text, lines)
        spacing = 92
        baseline = 737 - (len(lines) - 1) * spacing / 2
        for index, line in enumerate(lines):
            d.text((W/2, baseline + index*spacing), line, font=font, fill=INK, anchor='mm')
    return im


def srt_time(seconds):
    ms = round(seconds * 1000)
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f'{h:02d}:{m:02d}:{s:02d},{ms:03d}'


def ffmpeg_run(args):
    result = subprocess.run([FFMPEG, '-hide_banner', '-loglevel', 'error', '-y'] + args,
                            capture_output=True, text=True, encoding='utf-8', errors='replace')
    if result.returncode:
        raise RuntimeError(result.stderr)


def main():
    global FFMPEG
    frames = HERE / 'frames'
    frames.mkdir(exist_ok=True)
    frame('Ich heiße Angela und bin 38 Jahre alt.').save(HERE / 'vista_previa.png')
    if '--preview' in sys.argv:
        print('Preview ready.', flush=True)
        return
    sys.path.insert(0, str(HERE.parents[1] / 'tmp' / 'video_deps'))
    import imageio_ffmpeg
    FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
    audio = HERE / 'angela_narracion.mp3'
    raw = HERE / 'narracion_decoded.wav'
    ffmpeg_run(['-i', str(audio), '-ac', '1', '-ar', '24000', str(raw)])
    with wave.open(str(raw), 'rb') as f:
        duration = f.getnframes() / f.getframerate()
    sentences = (HERE / 'texto_de.txt').read_text(encoding='utf-8').strip().split('. ')
    sentences = [text if text.endswith('.') else text+'.' for text in sentences]
    timings = [json.loads(line) for line in (HERE / 'timing.jsonl').read_text(encoding='utf-8').splitlines() if line.strip()]
    timings = [item for item in timings if item['type'] == 'SentenceBoundary']
    assert len(timings) == len(sentences), (len(timings), len(sentences), timings)
    total = math.ceil((LEAD + duration + 1.3) * 24) / 24
    captions = []
    for index, (text, timing) in enumerate(zip(sentences, timings)):
        start = LEAD + timing['offset'] / 10000000
        end = LEAD + (timing['offset'] + timing['duration']) / 10000000
        captions.append({'text': text, 'start': start, 'speech_end': end})
    assert all(captions[i]['start'] < captions[i+1]['start'] for i in range(len(captions)-1))
    for i, c in enumerate(captions):
        c['end'] = captions[i+1]['start'] if i+1 < len(captions) else total
    srt = []
    for i, c in enumerate(captions):
        lines = wrap(c['text'], ImageFont.truetype(str(FONT), 65), ImageDraw.Draw(Image.new('RGB', (W,H))), 1650)
        srt.append(f"{i+1}\n{srt_time(c['start'])} --> {srt_time(c['end'])}\n" + '\n'.join(lines) + '\n')
    (HERE / 'angela_subtitulos.srt').write_text('\n'.join(srt), encoding='utf-8')
    (HERE / 'captions.json').write_text(json.dumps(captions, ensure_ascii=False, indent=2), encoding='utf-8')
    frame().save(frames / '000.png')
    concat = ["file 'frames/000.png'", f"duration {captions[0]['start']:.6f}"]
    for i, c in enumerate(captions):
        name = f'{i+1:03d}.png'
        frame(c['text'], i+1, len(captions)).save(frames / name)
        concat.extend([f"file 'frames/{name}'", f"duration {c['end']-c['start']:.6f}"])
    concat.append(f"file 'frames/{len(captions):03d}.png'")
    (HERE / 'frames.txt').write_text('\n'.join(concat)+'\n', encoding='utf-8')
    print(f'Rendering {len(captions)} captions; {total:.2f} seconds.', flush=True)
    ffmpeg_run(['-f', 'concat', '-safe', '0', '-i', str(HERE/'frames.txt'), '-i', str(audio),
                '-vf', 'fps=24,format=yuv420p', '-af', f'adelay={round(LEAD*1000)}:all=1,apad',
                '-t', f'{total:.6f}', '-c:v', 'libx264', '-preset', 'fast', '-tune', 'stillimage', '-crf', '16',
                '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart',
                '-metadata', 'title=Angela - Meine Vorstellung',
                '-metadata', 'comment=German presentation with synthesized narration and burned-in subtitles.',
                str(HERE/'angela_presentacion.mp4')])
    voice = json.loads((HERE / 'voice_used.json').read_text(encoding='utf-8-sig')) if (HERE/'voice_used.json').exists() else {'name':'de-DE-KatjaNeural','engine':'Microsoft Edge','rate':'-12%','neural':True}
    (HERE / 'video_info.json').write_text(json.dumps({'width':W,'height':H,'fps':24,'duration_seconds':total,'captions':len(captions),'voice':voice}, indent=2), encoding='utf-8')
    print(f"Created {HERE/'angela_presentacion.mp4'}", flush=True)


if __name__ == '__main__':
    main()
