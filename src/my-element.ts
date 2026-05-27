import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { invoke } from "@tauri-apps/api/core";

@customElement('my-element')
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
      text-align: center;
      padding: 20px;
    }
    h1 {
      color: #333;
    }
    .container {
      border: 1px solid #ccc;
      padding: 1rem;
      border-radius: 8px;
      max-width: 400px;
      margin: 0 auto;
    }
    input {
      padding: 8px;
      margin-bottom: 10px;
      width: 80%;
    }
    button {
      padding: 8px 16px;
      cursor: pointer;
    }
    .msg {
      margin-top: 15px;
      font-weight: bold;
      color: #666;
    }
  `;

  @property({ type: String }) 
  name = 'Tauri Lit User';

  @state()
  private _greetMsg = '';

  @state()
  private _inputName = '';

  render() {
    return html`
      <div class="container">
        <h1>Hello, ${this.name}!</h1>
        <p>This is a Lit component integrated into a Tauri app.</p>
        
        <div style="margin-top: 20px;">
          <input 
            type="text" 
            placeholder="Enter a name..." 
            @input="${this._onInput}" 
            .value="${this._inputName}"
          />
          <br />
          <button @click="${this._greet}">Greet from Rust</button>
        </div>

        <p class="msg">${this._greetMsg}</p>
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
