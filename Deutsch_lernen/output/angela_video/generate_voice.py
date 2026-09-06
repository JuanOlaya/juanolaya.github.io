"""Generate German narration and exact sentence timing from Microsoft Edge TTS."""
import asyncio
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parents[1] / 'tmp' / 'video_deps'))
import edge_tts


async def main():
    voices = await edge_tts.list_voices()
    german = [v for v in voices if v['Locale'].startswith('de-')]
    (HERE / 'voces_alemanas.json').write_text(json.dumps(german, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps([{'name': v['ShortName'], 'gender': v['Gender']} for v in german], ensure_ascii=False), flush=True)
    text = (HERE / 'texto_de.txt').read_text(encoding='utf-8').strip()
    communicate = edge_tts.Communicate(text, 'de-DE-KatjaNeural', rate='-12%', boundary='SentenceBoundary')
    await communicate.save(str(HERE / 'angela_narracion.mp3'), str(HERE / 'timing.jsonl'))
    print('Narration and timing created.', flush=True)


if __name__ == '__main__':
    asyncio.run(main())
