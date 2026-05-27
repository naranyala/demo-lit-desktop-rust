import { describe, it, expect } from 'vitest';
import '../../components/app-counter';

function createElement(tag: string): HTMLElement {
  const el = document.createElement(tag);
  document.body.appendChild(el);
  return el;
}

describe('app-counter', () => {
  it('renders with initial count 0', async () => {
    const el = createElement('app-counter');
    await (el as any).updateComplete;

    const countSpan = el.shadowRoot?.querySelector('.count');
    expect(countSpan?.textContent).toBe('0');
    el.remove();
  });

  it('increments on plus button click', async () => {
    const el = createElement('app-counter');
    await (el as any).updateComplete;

    const buttons = el.shadowRoot?.querySelectorAll('button')!;
    const plusButton = buttons[buttons.length - 1];
    plusButton.click();
    await (el as any).updateComplete;

    expect(el.shadowRoot?.querySelector('.count')?.textContent).toBe('1');
    el.remove();
  });

  it('decrements on minus button click', async () => {
    const el = createElement('app-counter');
    await (el as any).updateComplete;

    const buttons = el.shadowRoot?.querySelectorAll('button')!;
    const minusButton = buttons[0];
    minusButton.click();
    await (el as any).updateComplete;

    expect(el.shadowRoot?.querySelector('.count')?.textContent).toBe('-1');
    el.remove();
  });

  it('allows multiple increment steps', async () => {
    const el = createElement('app-counter');
    await (el as any).updateComplete;

    const buttons = el.shadowRoot?.querySelectorAll('button')!;
    const plusButton = buttons[buttons.length - 1];

    for (let i = 0; i < 5; i++) {
      plusButton.click();
      await (el as any).updateComplete;
    }

    expect(el.shadowRoot?.querySelector('.count')?.textContent).toBe('5');
    el.remove();
  });

  it('allows negative counts', async () => {
    const el = createElement('app-counter');
    await (el as any).updateComplete;

    const buttons = el.shadowRoot?.querySelectorAll('button')!;
    const minusButton = buttons[0];

    for (let i = 0; i < 3; i++) {
      minusButton.click();
      await (el as any).updateComplete;
    }

    expect(el.shadowRoot?.querySelector('.count')?.textContent).toBe('-3');
    el.remove();
  });
});
