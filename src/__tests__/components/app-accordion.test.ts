import { describe, it, expect } from 'vitest';
import { createLitElement, cleanup } from '../helpers';
import '../../components/app-accordion';

describe('app-accordion', () => {
  afterEach(() => cleanup());

  it('renders with default title', async () => {
    const el = await createLitElement('app-accordion');
    expect(el.shadowRoot?.querySelector('strong')?.textContent).toBe('Toggle');
  });

  it('renders with custom title attribute', async () => {
    const el = await createLitElement('app-accordion', { title: 'Settings' });
    expect(el.shadowRoot?.querySelector('strong')?.textContent).toBe('Settings');
  });

  it('starts closed (no content visible)', async () => {
    const el = await createLitElement('app-accordion');
    expect(el.shadowRoot?.querySelector('.content')).toBeNull();
    expect(el.shadowRoot?.querySelector('span')?.textContent).toBe('▼');
  });

  it('toggles open on header click', async () => {
    const el = await createLitElement('app-accordion');
    const header = el.shadowRoot?.querySelector('.header') as HTMLElement;
    header?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.content')).not.toBeNull();
    expect(el.shadowRoot?.querySelector('span')?.textContent).toBe('▲');
  });

  it('toggles closed on second click', async () => {
    const el = await createLitElement('app-accordion');
    const header = el.shadowRoot?.querySelector('.header') as HTMLElement;
    header?.click();
    await el.updateComplete;
    header?.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.content')).toBeNull();
    expect(el.shadowRoot?.querySelector('span')?.textContent).toBe('▼');
  });

  it('renders slot content when open', async () => {
    const el = await createLitElement('app-accordion');
    el.innerHTML = '<p>Hello slot</p>';
    await el.updateComplete;
    const header = el.shadowRoot?.querySelector('.header') as HTMLElement;
    header?.click();
    await el.updateComplete;
    const content = el.shadowRoot?.querySelector('.content') as HTMLElement;
    expect(content.querySelector('slot')).not.toBeNull();
  });
});
