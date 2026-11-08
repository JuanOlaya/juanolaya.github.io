/** Draws a deliberately overloaded "German verb manager" UI so the audit can be tried without a screenshot. */

function drawTabs(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#1e293b';
  for (let i = 0; i < 9; i++) {
    const x = 12 + (i % 3) * 125;
    const y = 65 + Math.floor(i / 3) * 25;
    ctx.fillRect(x, y, 115, 18);
    ctx.fillStyle = '#475569';
    ctx.strokeRect(x, y, 115, 18);
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Pestaña auxiliar ${i + 1}`, x + 5, y + 12);
  }
}

function drawConjugationTable(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(12, 150, 376, 120);
  ctx.fillStyle = '#334155';
  ctx.font = '7px Inter';
  ctx.fillText('ich spreche - wir sprechen - du sprichst - ihr sprecht - er spricht - sie sprechen', 20, 170);
  ctx.fillText(
    'Pasado: ich sprach - wir sprachen - du sprachst - ihr spracht - er sprach - sie sprachen',
    20,
    195,
  );
  ctx.fillText('Perfecto: ich habe gesprochen - wir haben gesprochen - du hast gesprochen', 20, 220);
  ctx.fillText('Pluscuamperfecto: ich hatte gesprochen - wir hatten gesprochen', 20, 245);
}

/** Returns the mock as a PNG data URL. */
export function drawChaoticSampleUi(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D no disponible.');

  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(0, 0, 400, 300);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 11px Inter';
  ctx.fillText('GERMAN VERB COMPLEX MANAGER v1.99', 12, 22);

  ctx.fillStyle = '#b91c1c';
  ctx.fillRect(12, 40, 90, 16);
  ctx.fillStyle = '#ffffff';
  ctx.font = '8px Inter';
  ctx.fillText('BORRAR TODO', 20, 51);

  drawTabs(ctx);
  drawConjugationTable(ctx);
  return canvas.toDataURL('image/png');
}

export interface InlineImage {
  mimeType: string;
  data: string;
}

/** Splits `data:image/png;base64,AAAA` into the parts the Gemini `inlineData` field expects. */
export function inlineImageFromDataUrl(dataUrl: string): InlineImage {
  const match = /^data:([^;,]+);base64,(.*)$/.exec(dataUrl);
  if (!match) throw new Error('Imagen no válida.');
  return { mimeType: match[1], data: match[2] };
}
