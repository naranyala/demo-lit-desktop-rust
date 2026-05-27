import './pages/markdown-pages';
import './pages/accordion';
import './pages/counter';
import './pages/composition';
import './pages/datatable';

export interface DocExample {
  id: string;
  title: string;
  component: string;
}

export interface DocGroup {
  name: string;
  examples: DocExample[];
}

export interface GroupState {
  expanded: boolean;
}

export const GROUP_DEFAULTS: Record<string, GroupState> = {
  'Fundamentals': { expanded: true },
  'Code Blocks': { expanded: false },
  'Components': { expanded: true },
};

export const GROUPS: DocGroup[] = [
  {
    name: 'Fundamentals',
    examples: [
      { id: 'basic', title: 'Basic Component', component: 'doc-page-basic' },
      { id: 'properties', title: 'Reactive Properties', component: 'doc-page-properties' },
      { id: 'styling', title: 'Advanced Styling', component: 'doc-page-styling' },
      { id: 'events', title: 'Event Handling', component: 'doc-page-events' },
    ]
  },
  {
    name: 'Code Blocks',
    examples: [
      { id: 'code-basic', title: 'Basic Code Block', component: 'doc-page-code-basic' },
      { id: 'code-json', title: 'JSON Example', component: 'doc-page-code-json' },
      { id: 'code-css', title: 'CSS Styling', component: 'doc-page-code-css' },
    ]
  },
  {
    name: 'Components',
    examples: [
      { id: 'accordion', title: 'Accordion', component: 'doc-page-accordion' },
      { id: 'counter', title: 'Counter Demo', component: 'doc-page-counter' },
      { id: 'composition', title: 'Component Composition', component: 'doc-page-composition' },
      { id: 'datatable', title: 'SQLite Data Table', component: 'doc-page-datatable' },
    ]
  }

];
