import { customElement } from 'lit/decorators.js';
import { BaseDocPage } from './base-page';

@customElement('doc-page-basic')
export class DocPageBasic extends BaseDocPage {
  constructor() {
    super(`# Basic Component
        
A minimal Lit component implementation.
        
\`\`\`typescript
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('basic-component')
export class BasicComponent extends LitElement {
  static styles = css\`
    p { color: #666; font-style: italic; }
  \`;

  render() {
    return html\`<p>Hello from a basic Lit component!</p>\`;
  }
}
\`\`\``);
  }
}

@customElement('doc-page-properties')
export class DocPageProperties extends BaseDocPage {
  constructor() {
    super(`# Reactive Properties
        
Demonstrating how properties trigger re-renders.
        
\`\`\`typescript
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('property-demo')
export class PropertyDemo extends LitElement {
  @property({ type: String }) name = 'Stranger';
  @state() private _count = 0;

  static styles = css\`
    .card { border: 1px solid #ccc; padding: 1rem; border-radius: 8px; }
  \`;

  private _increment() {
    this._count++;
  }

  render() {
    return html\`
      <div class="card">
        <h2>Hello, \${this.name}!</h2>
        <p>Count: \${this._count}</p>
        <button @click="\${this._increment}">Increment</button>
      </div>
    \`;
  }
}
\`\`\``);
  }
}

@customElement('doc-page-styling')
export class DocPageStyling extends BaseDocPage {
  constructor() {
    super(`# Advanced Styling
        
Using CSS variables and complex styles.
        
\`\`\`typescript
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('styled-component')
export class StyledComponent extends LitElement {
  static styles = css\`
    :host {
      --primary-color: #0366d6;
      display: block;
    }
    .box {
      background: var(--primary-color);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    .box:hover {
      transform: scale(1.05);
    }
  \`;

  render() {
    return html\`<div class="box">Hover me! I use CSS variables.</div>\`;
  }
}
\`\`\``);
  }
}

@customElement('doc-page-events')
export class DocPageEvents extends BaseDocPage {
  constructor() {
    super(`# Event Handling
        
Dispatching custom events to communicate with parents.
        
\`\`\`typescript
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('event-component')
export class EventComponent extends LitElement {
  static styles = css\`
    button { padding: 10px 20px; cursor: pointer; }
  \`;

  private _onButtonClick() {
    this.dispatchEvent(new CustomEvent('app-action', {
      detail: { message: 'Button clicked inside Lit!' },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html\`<button @click="\${this._onButtonClick}">Dispatch Event</button>\`;
  }
}
\`\`\``);
  }
}

@customElement('doc-page-code-basic')
export class DocPageCodeBasic extends BaseDocPage {
  constructor() {
    super(`# Basic Code Block
        
A simple code block with syntax highlighting.
        
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\``);
  }
}

@customElement('doc-page-code-json')
export class DocPageCodeJson extends BaseDocPage {
  constructor() {
    super(`# JSON Example
        
\`\`\`json
{
  "name": "Lit Docs",
  "version": "1.0.0",
  "dependencies": {
    "lit": "^3.0.0",
    "marked": "^12.0.0"
  }
}
\`\`\``);
  }
}

@customElement('doc-page-code-css')
export class DocPageCodeCss extends BaseDocPage {
  constructor() {
    super(`# CSS Styling
        
\`\`\`css
.container {
  display: grid;
  grid-template-columns: 280px 1fr;
  height: 100vh;
}

.sidebar {
  background: #f6f8fa;
  border-right: 1px solid #d1d5da;
  padding: 2rem;
  overflow-y: auto;
}
\`\`\``);
  }
}
