import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('app-accordion')
export class AppAccordion extends LitElement {
  @property({ type: String }) override title = 'Toggle';
  @state() private _isOpen = false;

  private _toggle() { this._isOpen = !this._isOpen; }

  override render() {
    return html`
      <div class="border border-gray-300 rounded-lg overflow-hidden">
        <div 
          @click="${this._toggle}" 
          class="flex justify-between items-center px-4 py-3 bg-gray-100 cursor-pointer user-select-none transition-colors hover:bg-gray-200"
        >
          <strong>${this.title}</strong>
          <span>${this._isOpen ? '▲' : '▼'}</span>
        </div>
        ${this._isOpen ? html`
          <div class="p-4 border-t border-gray-300 text-gray-700">
            <slot></slot>
          </div>
        ` : ''}
      </div>
    `;
  }
}
