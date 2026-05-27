import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { BaseDocPage } from './base-page';
import { markdownBodyStyles } from '../styles/markdown';

@customElement('doc-page-accordion')
export class DocPageAccordion extends BaseDocPage {
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
    super(`# Accordion Component
        
A collapsible content section using internal state.

\`\`\`typescript
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('app-accordion')
export class AppAccordion extends LitElement {
  @state() private _isOpen = false;

  static styles = css\`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f6f8fa;
      cursor: pointer;
      border-radius: 8px;
      border: 1px solid #d1d5da;
    }
    .content {
      padding: 1rem;
      border: 1px solid #d1d5da;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
  \`;

  private _toggle() {
    this._isOpen = !this._isOpen;
  }

  render() {
    return html\`
      <div class="accordion">
        <div class="header" @click="\${this._toggle}">
          <strong>Click to toggle</strong>
          <span>\${this._isOpen ? '▲' : '▼'}</span>
        </div>
        \${this._isOpen ? html\`<div class="content">Collapsible content here!</div>\` : ''}
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
        <app-accordion></app-accordion>
      </div>
    `;
  }
}
