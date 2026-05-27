import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('app-accordion')
export class AppAccordion extends LitElement {
  static styles = css`
    .accordion {
      border: 1px solid #d1d5da;
      border-radius: 8px;
      overflow: hidden;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      background: #f6f8fa;
      cursor: pointer;
      user-select: none;
      transition: background 0.2s;
    }
    .header:hover {
      background: #eaecef;
    }
    .content {
      padding: 1rem;
      border-top: 1px solid #d1d5da;
      color: #444;
    }
  `;

  @property({ type: String }) title = 'Toggle';

  @state() private _isOpen = false;

  private _toggle() {
    this._isOpen = !this._isOpen;
  }

  render() {
    return html`
      <div class="accordion">
        <div class="header" @click="${this._toggle}">
          <strong>${this.title}</strong>
          <span>${this._isOpen ? '▲' : '▼'}</span>
        </div>
        ${this._isOpen ? html`<div class="content"><slot></slot></div>` : ''}
      </div>
    `;
  }
}
