import type { LitElement } from 'lit';

const createdElements: HTMLElement[] = [];

export function createLitElement<T extends LitElement>(
  tag: string,
  attrs?: Record<string, string>
): Promise<T> {
  const el = document.createElement(tag) as T;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      el.setAttribute(k, v);
    }
  }
  document.body.appendChild(el);
  createdElements.push(el);
  return el.updateComplete.then(() => el);
}

export function cleanup(): void {
  for (const el of createdElements) {
    el.remove();
  }
  createdElements.length = 0;
}
