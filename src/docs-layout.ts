import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import Fuse from 'fuse.js';
import { GROUPS, GROUP_DEFAULTS, type GroupState } from './docs';
import { Theme } from './utils/theme';
import { EventListenerController } from './utils/controllers';
import tailwindStyles from './styles.css?inline';


@customElement('docs-layout')
export class DocsLayout extends LitElement {
  static override styles = css`
    ${unsafeCSS(tailwindStyles)}
  `;

  private _groupStates: Record<string, GroupState> = { ...GROUP_DEFAULTS };

  @state()
  private _activeId = 'basic';

  @state()
  private _searchQuery = '';

  @state()
  private _themeMode = Theme.mode;

  private _fuse = new Fuse(
    GROUPS.flatMap(g => g.examples),
    { keys: ['title'], threshold: 0.4 }
  );

  constructor() {
    super();
    // Listen for theme changes to trigger re-renders
    new EventListenerController(this, window, 'theme-changed', () => {
      this._themeMode = Theme.mode;
    });
  }

  private get _filteredGroups() {
    const q = this._searchQuery.trim();
    if (!q) return GROUPS;

    const results = this._fuse.search(q);
    const matchedIds = new Set(results.map(r => r.item.id));

    return GROUPS
      .map(g => ({
        ...g,
        examples: g.examples.filter(ex => matchedIds.has(ex.id)),
      }))
      .filter(g => g.examples.length > 0);
  }

  private get _allExamples() {
    return GROUPS.flatMap(g => g.examples);
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
  }

  private _getActiveExample() {
    const all = this._allExamples;
    return all.find(ex => ex.id === this._activeId) || all[0];
  }

  override render() {
    const groups = this._searchQuery.trim() ? this._filteredGroups : GROUPS;
    const active = this._getActiveExample();
    return html`
      <div class="grid grid-cols-[280px_1fr] h-screen">
        <aside class="bg-gray-50 dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 p-6 overflow-y-auto transition-colors duration-200">
          <div class="flex items-center justify-between mb-6 pl-2">
            <h2 class="text-lg font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Lit Docs</h2>
            <select 
              .value=${this._themeMode} 
              @change=${(e: any) => { Theme.mode = e.target.value; }}
              class="text-xs bg-transparent border-none outline-none cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
              <option value="system">💻 System</option>
            </select>
          </div>
          <div class="relative mb-4">
            <input
              type="search"
              placeholder="Search docs..."
              .value=${this._searchQuery}
              @input=${(e: InputEvent) => {
                this._searchQuery = (e.target as HTMLInputElement).value;
              }}
              class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
            />
          </div>
          ${groups.map(group => {
            const gs = this._groupStates[group.name];
            const isExpanded = this._searchQuery.trim() ? true : (gs?.expanded ?? true);
            return html`
              <div class="mb-4">
                <div
                  class="group-header flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 cursor-pointer select-none"
                  @click="${() => this._toggleGroup(group.name)}"
                >
                  <span>${group.name}</span>
                  <span class="text-base leading-none">${isExpanded ? '−' : '+'}</span>
                </div>
                ${isExpanded ? html`
                  <ul class="list-none p-0 m-0">
                    ${group.examples.map(ex => html`
                      <li
                        class="p-2 mb-0.5 cursor-pointer rounded-md transition-colors text-sm text-gray-600 dark:text-slate-400 block ${ex.id === this._activeId ? 'bg-gray-200 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold shadow-inner border-l-4 border-blue-600' : 'hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-slate-100'}"
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
        <main class="p-12 overflow-y-auto bg-white dark:bg-slate-950 transition-colors duration-200">
          ${unsafeHTML(`<${active.component}></${active.component}>`)}
        </main>
      </div>
    `;
  }
}
