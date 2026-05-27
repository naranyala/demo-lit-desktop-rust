import { createHighlighter } from 'shiki';

class HighlighterService {
  private highlighter: any = null;

  async init() {
    if (this.highlighter) return;

    this.highlighter = await createHighlighter({
      themes: ['github-dark'],
      langs: ['typescript', 'javascript', 'rust', 'bash', 'css', 'html'],
    });
  }

  async highlight(code: string, lang: string = 'typescript'): Promise<string> {
    if (!this.highlighter) {
      await this.init();
    }
    
    try {
      const html = this.highlighter.codeToHtml(code, {
        lang,
        theme: 'github-dark',
      });
      return `<div class="shiki-container">${html}</div>`;
    } catch (e) {
      console.warn(`Shiki language ${lang} not supported, falling back to plaintext.`);
      const html = this.highlighter.codeToHtml(code, {
        lang: 'plaintext',
        theme: 'github-dark',
      });
      return `<div class="shiki-container">${html}</div>`;
    }
  }
}

export const highlighter = new HighlighterService();
