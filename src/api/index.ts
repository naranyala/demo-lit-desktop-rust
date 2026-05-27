import { invoke } from "@tauri-apps/api/core";

/**
 * Mirror of Rust's AppError
 */
export type ApiErrorType = 'Internal' | 'InvalidInput' | 'NotFound' | 'Forbidden' | 'External' | 'Database';

export interface ApiError {
  type: ApiErrorType;
  message: string;
}

export interface GreetRequest {
  name: string;
}

/**
 * Base API Client to handle common invoke logic, 
 * error handling, and logging.
 */
class ApiClient {
  async call<TArgs extends Record<string, any>, TResp>(command: string, args: TArgs): Promise<TResp> {
    try {
      return await invoke<TResp>(command, args);
    } catch (error: any) {
      // Tauri returns the serialized AppError as the error object
      const apiError: ApiError = typeof error === 'string' 
        ? { type: 'Internal', message: error }
        : (error as ApiError);
        
      console.error(`[API ERROR] ${command}:`, apiError);
      throw apiError;
    }
  }
}

const client = new ApiClient();

export const UserApi = {
  async greet(args: GreetRequest): Promise<string> {
    return client.call<GreetRequest, string>("greet", args);
  },
};

export default {
  UserApi,
};
