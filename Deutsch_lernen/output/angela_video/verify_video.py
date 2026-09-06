"""Check complete decoding, caption coverage, sound levels, and exported frames."""
import json
import subprocess
import sys
import wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / 'tmp' / 'video_deps'))
import imageio_ffmpeg
ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
video = HERE / 'angela_presentacion.mp4'
check = subprocess.run([ffmpeg, '-hide_banner', '-v', 'error', '-i', str(video), '-f', 'null', '-'], capture_output=True, text=True)
assert check.returncode == 0 and not check.stderr.strip(), check.stderr
captions = json.loads((HERE/'captions.json').read_text(encoding='utf-8'))
original = (HERE/'texto_de.txt').read_text(encoding='utf-8').split()
assert ' '.join(' '.join(c['text'] for c in captions).split()) == ' '.join(original)
with wave.open(str(HERE/'angela_narracion.wav'), 'rb') as f:
    pcm = np.frombuffer(f.readframes(f.getnframes()), dtype=np.int16).astype(np.float64) / 32768
peak = float(np.max(np.abs(pcm)))
rms = float(np.sqrt(np.mean(pcm**2)))
assert 0.05 < peak < 1.0, peak
sheet = Image.new('RGB', (1280, 760), '#f8f8fa')
draw = ImageDraw.Draw(sheet)
for i, moment in enumerate((6, 45, 63, 69)):
    path = HERE / f'qa_{moment}.png'
    subprocess.run([ffmpeg, '-hide_banner', '-v', 'error', '-y', '-ss', str(moment), '-i', str(video), '-frames:v', '1', str(path)], check=True)
    with Image.open(path) as im:
        sheet.paste(im.resize((640, 360)), ((i%2)*640, (i//2)*380))
    draw.text(((i%2)*640+12, (i//2)*380+362), f'{moment} s', fill='#33414c')
sheet.save(HERE/'verificacion_visual.jpg', quality=92)
report = {'decode':'passed', 'original_text':'complete and unchanged', 'caption_count':len(captions), 'audio_peak_dbfs':round(20*np.log10(peak),2), 'audio_rms_dbfs':round(20*np.log10(rms),2), 'size_mb':round(video.stat().st_size/1000000,2)}
(HERE/'verificacion.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report), flush=True)
