import { marked } from 'marked';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { highlighter } from './highlighter';
import { Notifications } from './notifications';
import { dedent } from './index';

export class MarkdownController implements ReactiveController {
  private _host: ReactiveControllerHost & { renderRoot: ShadowRoot | HTMLElement };
  private _content: string;
  private _html = '';

  constructor(host: ReactiveControllerHost & { renderRoot: ShadowRoot | HTMLElement }, content: string) {
    this._host = host;
    this._content = content;
    host.addController(this);
    this._render();
  }

  get html() { return this._html; }

  set content(value: string) {
    if (this._content !== value) {
      this._content = value;
      this._render();
    }
  }

  private async _render() {
    const codeBlocks: { id: string; code: string; lang: string }[] = [];
    const renderer = new marked.Renderer();
    renderer.code = ({ text, lang }) => {
      const id = `shiki-code-${Math.random().toString(36).slice(2)}`;
      codeBlocks.push({ id, code: text, lang: lang || 'typescript' });
      return `<div id="${id}" class="shiki-placeholder">Loading code...</div>`;
    };

    let html = marked.parse(this._content, { renderer }) as string;

    for (const block of codeBlocks) {
      const trimmedCode = dedent(block.code.trim());
      const highlighted = await highlighter.highlight(trimmedCode, block.lang);
      const header = `
        <div class="code-header">
          <span class="code-title">${block.lang}</span>
          <button class="copy-btn" data-code="${encodeURIComponent(trimmedCode)}">Copy</button>
        </div>`;
      const wrapped = `<div class="shiki-container">${header}${highlighted}</div>`;
      html = html.replace(`<div id="${block.id}" class="shiki-placeholder">Loading code...</div>`, wrapped);
    }

    this._html = html;
    this._host.requestUpdate();
  }

  hostConnected() {
    this._host.renderRoot.addEventListener('click', this._handleClick);
  }

  hostDisconnected() {
    this._host.renderRoot.removeEventListener('click', this._handleClick);
  }

  private _handleClick = (e: Event) => {
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
  };
}
