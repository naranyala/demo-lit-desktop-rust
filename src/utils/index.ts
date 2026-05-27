export * from './storage';
export * from './lit';

/**
 * Removes leading indentation from a multi-line string.
 */
export function dedent(str: string): string {
  const lines = str.split('\n');
  if (lines.length === 0) return str;

  // Ignore empty lines when calculating min indent
  const indents = lines
    .filter(line => line.trim().length > 0)
    .map(line => line.match(/^\s*/)?.[0].length || 0);

  const minIndent = indents.length > 0 ? Math.min(...indents) : 0;

  return lines
    .map(line => line.slice(minIndent))
    .join('\n')
    .replace(/^\n+/, '');
}
