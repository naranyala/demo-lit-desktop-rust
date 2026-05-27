import { describe, it, expect } from 'vitest';
import { createLitElement, cleanup } from '../helpers';
import '../../components/app-counter';

describe('app-counter', () => {
  afterEach(() => cleanup());

  it('renders with initial count 0', async () => {
    const el = await createLitElement('app-counter');
    const countSpan = el.shadowRoot?.querySelector('.count');
    expect(countSpan?.textContent).toBe('0');
  });

  it('increments on plus button click', async () => {
    const el = await createLitElement('app-counter');
    const buttons = el.shadowRoot?.querySelectorAll('button')!;
    const plusButton = buttons[buttons.length - 1];
    plusButton.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.count')?.textContent).toBe('1');
  });

  it('decrements on minus button click', async () => {
    const el = await createLitElement('app-counter');
    const buttons = el.shadowRoot?.querySelectorAll('button')!;
    const minusButton = buttons[0];
    minusButton.click();
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.count')?.textContent).toBe('-1');
  });

  it('allows multiple increment steps', async () => {
    const el = await createLitElement('app-counter');
    const buttons = el.shadowRoot?.querySelectorAll('button')!;
    const plusButton = buttons[buttons.length - 1];
    for (let i = 0; i < 5; i++) {
      plusButton.click();
      await el.updateComplete;
    }
    expect(el.shadowRoot?.querySelector('.count')?.textContent).toBe('5');
  });

  it('allows negative counts', async () => {
    const el = await createLitElement('app-counter');
    const buttons = el.shadowRoot?.querySelectorAll('button')!;
    const minusButton = buttons[0];
    for (let i = 0; i < 3; i++) {
      minusButton.click();
      await el.updateComplete;
    }
    expect(el.shadowRoot?.querySelector('.count')?.textContent).toBe('-3');
  });
});
