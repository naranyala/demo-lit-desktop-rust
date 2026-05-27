import { css } from 'lit';

export const markdownBodyStyles = css`
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
`;
