import { LitElement, html } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { MarkdownController } from '../utils/markdown';
import { markdownBodyStyles } from '../styles/markdown';

export class BaseDocPage extends LitElement {
  static override styles = [markdownBodyStyles];
  
  protected _md: MarkdownController;

  constructor(content: string) {
    super();
    this._md = new MarkdownController(this as any, content);
  }

  override render() {
    return html`<div class="markdown-body">${unsafeHTML(this._md.html)}</div>`;
  }
}
