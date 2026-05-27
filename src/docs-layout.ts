import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import { UserApi, ApiError } from './api';
import { highlighter } from './utils/highlighter';
import { Notifications } from './utils/notifications';
import { dedent } from './utils';
import tailwindStyles from './styles.css?inline';


interface DocExample {
  id: string;
  title: string;
  content: string;
}

const EXAMPLES: DocExample[] = [
  {
    id: 'basic',
    title: 'Basic Component',
    content: `# Basic Component
    
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
\`\`\``
  },
  {
    id: 'properties',
    title: 'Reactive Properties',
    content: `# Reactive Properties
    
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
\`\`\``
  },
  {
    id: 'styling',
    title: 'Advanced Styling',
    content: `# Advanced Styling
    
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
\`\`\``
  },
  {
    id: 'events',
    title: 'Event Handling',
    content: `# Event Handling
    
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
\`\`\``
  },
  {
    id: 'composition',
    title: 'Component Composition',
    content: `# Composition & Slots
    
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
\`\`\``
  }
];

@customElement('docs-layout')
export class DocsLayout extends LitElement {
  static styles = css`
    ${tailwindStyles as any}

    :host {
      display: block;
      height: 100vh;
      color: #24292e;
    }
    .markdown-body {
      max-width: 850px;
      margin: 0 auto;
      line-height: 1.6;
      font-size: 16px;
    }
    .markdown-body h1 {
      font-size: 2rem;
      font-weight: 600;
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
      margin-top: 0;
      margin-bottom: 1rem;
    }
    .markdown-body h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-top: 2rem;
      margin-bottom: 1rem;
      border-bottom: 1px solid #eaecef;
      padding-bottom: 0.3em;
    }
    .markdown-body h3 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1.5rem;
      margin-bottom: 1rem;
    }
    .markdown-body p {
      margin-bottom: 1rem;
    }
    .markdown-body ul {
      padding-left: 2rem;
      margin-bottom: 1rem;
    }
    .markdown-body li {
      margin-bottom: 0.25rem;
    }
    .markdown-body code {
      background-color: rgba(27,31,35,0.05);
      padding: 0.2em 0.4em;
      border-radius: 4px;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
      font-size: 85%;
      color: #e83e8c;
    }
    .shiki-container {
      margin: 1.5rem 0;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #d1d5da;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      background-color: #0d1117;
    }
    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background-color: #161b22;
      border-bottom: 1px solid #30363d;
      color: #8b949e;
      font-family: sans-serif;
      font-size: 0.8rem;
    }
    .code-title {
      font-weight: 500;
      text-transform: lowercase;
    }
    .copy-btn {
      background: transparent;
      border: 1px solid #30363d;
      color: #8b949e;
      padding: 2px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.75rem;
      transition: all 0.2s;
    }
    .copy-btn:hover {
      background-color: #30363d;
      color: #c9d1d9;
    }
    .shiki-container pre {
      margin: 0 !important;
      padding: 1.25rem !important;
      background-color: transparent !important;
    }
  `;


  @state()
  private _activeId = 'intro';

  @state()
  private _renderedContent = '';

  @state()
  private _apiResult = '';

  @state()
  private _apiInput = '';

  async firstUpdated() {
    this.addEventListener('click', this._handleGlobalClick);
    await this._updateContent();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleGlobalClick);
  }

  _handleGlobalClick(e: Event) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('copy-btn')) {
      const code = target.getAttribute('data-code');
      if (code) {
        navigator.clipboard.writeText(decodeURIComponent(code));
        const originalText = target.textContent;
        target.textContent = 'Copied!';
        setTimeout(() => {
          target.textContent = originalText;
        }, 2000);
        Notifications.success('Code copied to clipboard!');
      }
    }
  }

  async _onNavClick(id: string) {
    this._activeId = id;
    await this._updateContent();
  }

  private async _updateContent() {
    const activeExample = this._getActiveExample();
    
    const codeBlocks: { id: string, code: string, lang: string }[] = [];
    
    const renderer = new marked.Renderer();
    renderer.code = ({ text, lang }) => {
      const id = `shiki-code-${codeBlocks.length}`;
      codeBlocks.push({ id, code: text, lang: lang || 'typescript' });
      return `<div id="${id}" class="shiki-placeholder">Loading code...</div>`;
    };

    let html = marked.parse(activeExample.content, { renderer }) as string;

    for (const block of codeBlocks) {
      const trimmedCode = dedent(block.code);
      const highlighted = await highlighter.highlight(trimmedCode, block.lang);
      
      const header = `
        <div class="code-header">
          <span class="code-title">${block.lang}</span>
          <button class="copy-btn" data-code="${encodeURIComponent(trimmedCode)}">Copy</button>
        </div>`;
      
      const wrapped = `<div class="shiki-container">${header}${highlighted}</div>`;
      html = html.replace(`<div id="${block.id}" class="shiki-placeholder">Loading code...</div>`, wrapped);
    }

    this._renderedContent = html;
  }

  private _getActiveExample() {
    return EXAMPLES.find(ex => ex.id === this._activeId) || EXAMPLES[0];
  }

  private async _handleGreet() {
    try {
      const result = await UserApi.greet({
        name: this._apiInput || 'Stranger',
      });
      this._apiResult = result;
      Notifications.success(`Greeted successfully!`);
    } catch (e) {
      const error = e as ApiError;
      this._apiResult = `Error: ${error.message}`;
      Notifications.error(`[${error.type}] ${error.message}`);
    }
  }

  render() {
    return html`
      <div class="grid grid-cols-[280px_1fr] h-screen">
        <aside class="bg-gray-50 border-r border-gray-200 p-8 overflow-y-auto">
          <h2 class="text-lg font-semibold mb-6 pl-2 text-blue-600 uppercase tracking-wider">Lit Docs</h2>
          <ul class="list-none p-0 m-0">
            ${EXAMPLES.map(ex => html`
              <li 
                class="p-2 mb-1 cursor-pointer rounded-md transition-colors text-sm text-gray-600 block ${ex.id === this._activeId ? 'bg-gray-200 text-blue-600 font-semibold shadow-inner border-l-4 border-blue-600' : 'hover:bg-gray-100 hover:text-gray-900'}" 
                @click="${() => this._onNavClick(ex.id)}"
              >
                ${ex.title}
              </li>
            `)}
          </ul>
        </aside>
        <main class="p-12 overflow-y-auto bg-white">
          <div class="markdown-body">
            ${unsafeHTML(this._renderedContent)}
          </div>
        </main>
      </div>
    `;
  }
}
