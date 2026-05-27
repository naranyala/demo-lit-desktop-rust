import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { invoke } from "@tauri-apps/api/core";

@customElement('my-element')
export class MyElement extends LitElement {
  @property({ type: String }) 
  name = 'Tauri Lit User';
  
  @state()
  private _greetMsg = '';
  @state()
  private _inputName = '';

  override render() {
    return html`
      <div class="border border-gray-300 p-4 rounded-lg max-w-md mx-auto text-center font-sans">
        <h1 class="text-3xl font-bold text-gray-800 mb-4">Hello, ${this.name}!</h1>
        <p class="text-gray-600 mb-6">This is a Lit component integrated into a Tauri app.</p>
        <div class="mt-5">
          <input 
            type="text" 
            placeholder="Enter a name..." 
            @input="${this._onInput}" 
            .value="${this._inputName}" 
            class="p-2 mb-3 w-4/5 border border-gray-300 rounded-md"
          />
          <br />
          <button 
            @click="${this._greet}" 
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Greet from Rust
          </button>
        </div>
        <p class="mt-4 font-bold text-gray-500">${this._greetMsg}</p>
      </div>
    `;
  }

  private _onInput(e: InputEvent) {
    this._inputName = (e.target as HTMLInputElement).value;
  }

  private async _greet() {
    this._greetMsg = await invoke("greet", {
      name: this._inputName || 'Stranger',
    });
  }
}
