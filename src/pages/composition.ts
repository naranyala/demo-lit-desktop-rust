import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { BaseDocPage } from './base-page';
import { markdownBodyStyles } from '../styles/markdown';

@customElement('doc-page-composition')
export class DocPageComposition extends BaseDocPage {
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
    super(`# Composition & Slots
        
Using slots to create flexible wrapper components.
        
\`\`\`typescript
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('app-card')
export class AppCard extends LitElement {
  static styles = css\`
    .card {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .header { background: #f6f8fa; padding: 1rem; font-weight: bold; }
    .body { padding: 1rem; }
  \`;

  render() {
    return html\`
      <div class="card">
        <div class="header"><slot name="header">Default Header</slot></div>
        <div class="body"><slot></slot></div>
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
        <app-card>
          <span slot="header">Composition Demo</span>
          <app-counter></app-counter>
        </app-card>
      </div>
    `;
  }
}
