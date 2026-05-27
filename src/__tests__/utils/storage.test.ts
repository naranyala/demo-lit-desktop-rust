import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StorageService, Utils } from '../../utils';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('stores and retrieves a string value', () => {
    StorageService.set('key1', 'hello');
    expect(StorageService.get<string>('key1')).toBe('hello');
  });

  it('stores and retrieves a number', () => {
    StorageService.set('count', 42);
    expect(StorageService.get<number>('count')).toBe(42);
  });

  it('stores and retrieves an object', () => {
    const obj = { a: 1, b: [2, 3] };
    StorageService.set('obj', obj);
    expect(StorageService.get<typeof obj>('obj')).toEqual(obj);
  });

  it('returns null for missing key', () => {
    expect(StorageService.get('nonexistent')).toBeNull();
  });

  it('removes a key', () => {
    StorageService.set('temp', 'value');
    StorageService.remove('temp');
    expect(StorageService.get('temp')).toBeNull();
  });

  it('clears all keys', () => {
    StorageService.set('a', 1);
    StorageService.set('b', 2);
    StorageService.clear();
    expect(StorageService.get('a')).toBeNull();
    expect(StorageService.get('b')).toBeNull();
  });

  it('returns null for corrupted JSON', () => {
    localStorage.setItem('corrupt', '{bad json');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = StorageService.get('corrupt');
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalledOnce();
    consoleSpy.mockRestore();
  });

  it('overwrites existing values', () => {
    StorageService.set('key', 'first');
    StorageService.set('key', 'second');
    expect(StorageService.get('key')).toBe('second');
  });
});

describe('Utils.slugify', () => {
  it('converts to lowercase', () => {
    expect(Utils.slugify('Hello World')).toBe('hello-world');
  });

  it('replaces spaces with hyphens', () => {
    expect(Utils.slugify('hello world')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(Utils.slugify('hello! world?')).toBe('hello-world');
  });

  it('collapses multiple hyphens', () => {
    expect(Utils.slugify('hello   world')).toBe('hello-world');
  });

  it('trims whitespace', () => {
    expect(Utils.slugify('  hello  ')).toBe('hello');
  });
});

describe('Utils.debounce', () => {
  it('calls function after delay', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = Utils.debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledOnce();

    vi.useRealTimers();
  });

  it('cancels previous pending call', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = Utils.debounce(fn, 100);

    debounced();
    debounced();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('preserves the last arguments', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = Utils.debounce(fn, 100);

    debounced(1);
    debounced(2);
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith(2);

    vi.useRealTimers();
  });
});
