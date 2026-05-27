import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('app-counter')
export class AppCounter extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
    }
    .container {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    button {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 6px;
      border: 1px solid #d1d5da;
      background: #f6f8fa;
      font-size: 1.1rem;
      font-weight: 600;
      transition: background 0.15s;
    }
    button:hover {
      background: #eaecef;
    }
    .count {
      min-width: 2rem;
      text-align: center;
      font-size: 1.2rem;
      font-weight: 600;
      color: #0366d6;
    }
  `;

  @state() private _count = 0;

  private _inc() { this._count++; }
  private _dec() { this._count--; }

  render() {
    return html`
      <div class="container">
        <button @click="${this._dec}">−</button>
        <span class="count">${this._count}</span>
        <button @click="${this._inc}">+</button>
      </div>
    `;
  }
}
