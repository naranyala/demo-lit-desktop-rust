import { describe, it, expect, vi } from 'vitest';
import { invoke } from '@tauri-apps/api/core';
import { UserApi, ApiError } from '../../api';

vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

const mockInvoke = vi.mocked(invoke);

describe('UserApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns greeting on successful invoke', async () => {
    mockInvoke.mockResolvedValue("Hello, Test! You've been greeted from Rust!");

    const result = await UserApi.greet({ name: 'Test' });
    expect(result).toBe("Hello, Test! You've been greeted from Rust!");
    expect(mockInvoke).toHaveBeenCalledWith('greet', { name: 'Test' });
  });

  it('throws ApiError when invoke rejects with error object', async () => {
    const apiError: ApiError = {
      type: 'InvalidInput',
      message: 'Name cannot be empty',
    };
    mockInvoke.mockRejectedValue(apiError);

    await expect(UserApi.greet({ name: '' })).rejects.toEqual(apiError);
  });

  it('wraps string rejection as Internal error', async () => {
    mockInvoke.mockRejectedValue('something went wrong');

    await expect(UserApi.greet({ name: 'x' })).rejects.toEqual({
      type: 'Internal',
      message: 'something went wrong',
    });
  });

  it('passes arguments to the backend command', async () => {
    mockInvoke.mockResolvedValue('Hello, World!');

    await UserApi.greet({ name: 'World' });
    expect(mockInvoke).toHaveBeenCalledWith('greet', { name: 'World' });
  });

  it('handles concurrent calls independently', async () => {
    mockInvoke
      .mockResolvedValueOnce('Hello, Alice!')
      .mockResolvedValueOnce('Hello, Bob!');

    const [a, b] = await Promise.all([
      UserApi.greet({ name: 'Alice' }),
      UserApi.greet({ name: 'Bob' }),
    ]);

    expect(a).toBe('Hello, Alice!');
    expect(b).toBe('Hello, Bob!');
    expect(mockInvoke).toHaveBeenCalledTimes(2);
  });

  it('logs error to console on failure', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockInvoke.mockRejectedValue({ type: 'Internal', message: 'fail' });

    await expect(UserApi.greet({ name: 'x' })).rejects.toEqual({
      type: 'Internal',
      message: 'fail',
    });
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
