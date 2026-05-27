import { describe, it, expect } from 'vitest';
import { dedent } from '../../utils';

describe('dedent', () => {
  it('strips common leading whitespace', () => {
    const input = `\
      hello
        indented
      world`;
    expect(dedent(input)).toBe('hello\n  indented\nworld');
  });

  it('returns single line unchanged', () => {
    expect(dedent('hello')).toBe('hello');
  });

  it('returns empty string for empty input', () => {
    expect(dedent('')).toBe('');
  });

  it('handles no leading whitespace', () => {
    const input = `hello
world
foo`;
    expect(dedent(input)).toBe('hello\nworld\nfoo');
  });

  it('handles all-empty lines gracefully', () => {
    expect(dedent('\n\n')).toBe('');
  });

  it('trims leading newline from template literal', () => {
    const input = `\
      line one
      line two`;
    expect(dedent(input)).toBe('line one\nline two');
  });

  it('uses minimum indent across lines', () => {
    const input = '      alpha\n    beta\n        gamma';
    expect(dedent(input)).toBe('  alpha\nbeta\n    gamma');
  });
});
