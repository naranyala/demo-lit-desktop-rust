import { describe, it, expect } from 'vitest';
import '../../components/app-accordion';

function createElement(tag: string, attrs?: Record<string, string>): HTMLElement {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, v);
    }
  }
  document.body.appendChild(el);
  return el;
}

describe('app-accordion', () => {
  it('renders with default title', async () => {
    const el = createElement('app-accordion');
    await (el as any).updateComplete;

    expect(el.shadowRoot?.querySelector('strong')?.textContent).toBe('Toggle');
    el.remove();
  });

  it('renders with custom title attribute', async () => {
    const el = createElement('app-accordion', { title: 'Settings' });
    await (el as any).updateComplete;

    expect(el.shadowRoot?.querySelector('strong')?.textContent).toBe('Settings');
    el.remove();
  });

  it('starts closed (no content visible)', async () => {
    const el = createElement('app-accordion');
    await (el as any).updateComplete;

    expect(el.shadowRoot?.querySelector('.content')).toBeNull();
    expect(el.shadowRoot?.querySelector('span')?.textContent).toBe('▼');
    el.remove();
  });

  it('toggles open on header click', async () => {
    const el = createElement('app-accordion');
    await (el as any).updateComplete;

    const header = el.shadowRoot?.querySelector('.header') as HTMLElement;
    header?.click();
    await (el as any).updateComplete;

    expect(el.shadowRoot?.querySelector('.content')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('span')?.textContent).toBe('▲');
    el.remove();
  });

  it('toggles closed on second click', async () => {
    const el = createElement('app-accordion');
    await (el as any).updateComplete;

    const header = el.shadowRoot?.querySelector('.header') as HTMLElement;
    header?.click();
    await (el as any).updateComplete;
    header?.click();
    await (el as any).updateComplete;

    expect(el.shadowRoot?.querySelector('.content')).toBeNull();
    expect(el.shadowRoot?.querySelector('span')?.textContent).toBe('▼');
    el.remove();
  });

  it('renders slot content when open', async () => {
    const el = createElement('app-accordion');
    el.innerHTML = '<p>Hello slot</p>';
    await (el as any).updateComplete;

    const header = el.shadowRoot?.querySelector('.header') as HTMLElement;
    header?.click();
    await (el as any).updateComplete;

    const content = el.shadowRoot?.querySelector('.content') as HTMLElement;
    expect(content.querySelector('slot')).not.toBeNull();
    el.remove();
  });
});
