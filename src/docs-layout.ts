import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { marked } from 'marked';
import { highlighter } from './utils/highlighter';
import { Notifications } from './utils/notifications';
import { dedent } from './utils';
import './components/app-accordion';
import './components/app-counter';
import tailwindStyles from './styles.css?inline';


interface DocExample {
  id: string;
  title: string;
  content: string;
  component?: string;
}

interface DocGroup {
  name: string;
  examples: DocExample[];
}

interface GroupState {
  expanded: boolean;
}

const GROUPS: DocGroup[] = [
  {
    name: 'Fundamentals',
    examples: [
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
    ]
  },
  {
    name: 'Code Blocks',
    examples: [
      {
        id: 'code-basic',
        title: 'Basic Code Block',
        content: `# Basic Code Block
        
A simple code block with syntax highlighting.
        
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\``
      },
      {
        id: 'code-json',
        title: 'JSON Example',
        content: `# JSON Example
        
\`\`\`json
{
  "name": "Lit Docs",
  "version": "1.0.0",
  "dependencies": {
    "lit": "^3.0.0",
    "marked": "^12.0.0"
  }
}
\`\`\``
      },
      {
        id: 'code-css',
        title: 'CSS Styling',
        content: `# CSS Styling
        
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
\`\`\``
      }
    ]
  },
  {
    name: 'Components',
    examples: [
      {
        id: 'accordion',
        title: 'Accordion',
        component: 'app-accordion',
        content: `# Accordion Component
        
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
\`\`\``
      },
      {
        id: 'counter',
        title: 'Counter Demo',
        component: 'app-counter',
        content: `# Counter Component
        
A simple stateful counter with increment and decrement.

\`\`\`typescript
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('app-counter')
export class AppCounter extends LitElement {
  @state() private _count = 0;

  static styles = css\`
    .container {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-family: sans-serif;
    }
    button {
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  \`;

  private _inc() { this._count++; }
  private _dec() { this._count--; }

  render() {
    return html\`
      <div class="container">
        <button @click="\${this._dec}">-</button>
        <span>Count: \${this._count}</span>
        <button @click="\${this._inc}">+</button>
      </div>
    \`;
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
    ]
  }
];

@customElement('docs-layout')
export class DocsLayout extends LitElement {
  static styles = css`
    ${unsafeCSS(tailwindStyles)}

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
    .group-header {
      cursor: pointer;
      user-select: none;
    }
  `;

  private _groupStates: Record<string, GroupState> = {
    'Fundamentals': { expanded: true },
    'Code Blocks': { expanded: false },
    'Components': { expanded: true },
  };

  @state()
  private _activeId = 'basic';

  @state()
  private _renderedContent = '';

  private get _allExamples() {
    return GROUPS.flatMap(g => g.examples);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleGlobalClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._handleGlobalClick);
  }

  async firstUpdated() {
    await this._updateContent();
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

  _toggleGroup(name: string) {
    const state = this._groupStates[name];
    if (state) {
      state.expanded = !state.expanded;
      this.requestUpdate();
    }
  }

  async _onNavClick(id: string) {
    this._activeId = id;
    await this._updateContent();
  }

  private async _updateContent() {
    const active = this._getActiveExample();

    const codeBlocks: { id: string; code: string; lang: string }[] = [];

    const renderer = new marked.Renderer();
    renderer.code = ({ text, lang }) => {
      const id = `shiki-code-${codeBlocks.length}`;
      codeBlocks.push({ id, code: text, lang: lang || 'typescript' });
      return `<div id="${id}" class="shiki-placeholder">Loading code...</div>`;
    };

    let html = marked.parse(active.content, { renderer }) as string;

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

    const liveDemo = active.component
      ? `<div class="live-demo"><${active.component}></${active.component}></div>`
      : '';

    this._renderedContent = html + liveDemo;
  }

  private _getActiveExample() {
    const all = this._allExamples;
    return all.find(ex => ex.id === this._activeId) || all[0];
  }

  render() {
    return html`
      <div class="grid grid-cols-[280px_1fr] h-screen">
        <aside class="bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
          <h2 class="text-lg font-semibold mb-6 pl-2 text-blue-600 uppercase tracking-wider">Lit Docs</h2>
          ${GROUPS.map(group => {
            const gs = this._groupStates[group.name];
            const isExpanded = gs?.expanded ?? true;
            return html`
              <div class="mb-4">
                <div
                  class="group-header flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-700"
                  @click="${() => this._toggleGroup(group.name)}"
                >
                  <span>${group.name}</span>
                  <span class="text-base leading-none">${isExpanded ? '−' : '+'}</span>
                </div>
                ${isExpanded ? html`
                  <ul class="list-none p-0 m-0">
                    ${group.examples.map(ex => html`
                      <li
                        class="p-2 mb-0.5 cursor-pointer rounded-md transition-colors text-sm text-gray-600 block ${ex.id === this._activeId ? 'bg-gray-200 text-blue-600 font-semibold shadow-inner border-l-4 border-blue-600' : 'hover:bg-gray-100 hover:text-gray-900'}"
                        @click="${() => this._onNavClick(ex.id)}"
                      >
                        ${ex.title}
                      </li>
                    `)}
                  </ul>
                ` : ''}
              </div>
            `;
          })}
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
