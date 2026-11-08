import { createSSRApp, h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';
import HomeControls from './HomeControls.vue';

function render(gridVisible: boolean): Promise<string> {
  return renderToString(createSSRApp({ render: () => h(HomeControls, { gridVisible }) }));
}

describe('HomeControls', () => {
  it('renders each control as a labelled native button so keyboards can reach it', async () => {
    const html = await render(false);

    for (const [id, label] of [
      ['fullscreenIcon', 'Toggle fullscreen'],
      ['gridOnIcon', 'Show projects'],
      ['refreshIcon', 'Restart animation'],
    ]) {
      const tag = html.match(new RegExp(`<button[^>]*id="${id}"[^>]*>`))?.[0] ?? '';
      expect(tag).toContain('type="button"');
      expect(tag).toContain(`aria-label="${label}"`);
    }
  });

  it('hides the icon glyph text from screen readers', async () => {
    const html = await render(false);

    expect(html.match(/aria-hidden="true"/g)).toHaveLength(3);
  });

  it('hides the controls while the project grid is visible', async () => {
    const html = await render(true);

    expect(html.match(/display:none/g)).toHaveLength(3);
  });
});
