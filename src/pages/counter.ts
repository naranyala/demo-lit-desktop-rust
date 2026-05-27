import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { BaseDocPage } from './base-page';
import { markdownBodyStyles } from '../styles/markdown';

@customElement('doc-page-counter')
export class DocPageCounter extends BaseDocPage {
  static override styles = [markdownBodyStyles, css`
    .live-demo {
      margin: 1.5rem 0;
      padding: 1.5rem;
      border: 2px solid #e1e4e8;
      border-radius: 8px;
      background: #fafbfc;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `];

  constructor() {
    super(`# Counter Component
        
A simple stateful counter with increment and decrement.

\`\`\`typescript
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('app-counter')
export class AppCounter extends LitElement {
  @state() private _count = 0;

  static styles = css\`
    .container {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: sans-serif;
    }
    button {
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  \`;

  private _inc() { this._count++; }
  private _dec() { this._count--; }

  render() {
    return html\`
      <div class="container">
        <button @click="\${this._dec}">-</button>
        <span>Count: \${this._count}</span>
        <button @click="\${this._inc}">+</button>
      </div>
    \`;
  }
}
\`\`\``);
  }

  override render() {
    return html`
      <div class="markdown-body">${unsafeHTML(this._md.html)}</div>
      <div class="live-demo">
        <app-counter></app-counter>
      </div>
    `;
  }
}
