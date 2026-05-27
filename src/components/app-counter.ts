import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('app-counter')
export class AppCounter extends LitElement {
  @state() private _count = 0;
  private _inc() { this._count++; }
  private _dec() { this._count--; }

  override render() {
    return html`
      <div class="flex items-center gap-4 font-sans">
        <button 
          @click="${this._dec}" 
          class="w-9 h-9 flex items-center justify-center cursor-pointer rounded-md border border-gray-300 bg-gray-100 text-lg font-semibold transition-colors hover:bg-gray-200"
        >−</button>
        <span class="min-w-[2rem] text-center text-xl font-semibold text-blue-600">${this._count}</span>
        <button 
          @click="${this._inc}" 
          class="w-9 h-9 flex items-center justify-center cursor-pointer rounded-md border border-gray-300 bg-gray-100 text-lg font-semibold transition-colors hover:bg-gray-200"
        >+</button>
      </div>
    `;
  }
}
