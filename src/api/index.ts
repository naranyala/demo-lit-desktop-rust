import { invoke } from "@tauri-apps/api/core";
import { Notifications } from "../utils/notifications";

export type ApiErrorType = 'Internal' | 'InvalidInput' | 'NotFound' | 'Forbidden' | 'External' | 'Database';

export interface ApiError {
  type: ApiErrorType;
  message: string;
}

export interface GreetRequest {
  name: string;
}

export interface Item {
  id: number;
  name: string;
  description: string;
}

export interface ItemRequest {
  name: string;
  description: string;
}

class ApiClient {
  async call<TArgs extends Record<string, any>, TResp>(command: string, args: TArgs): Promise<TResp> {
    try {
      return await invoke<TResp>(command, args);
    } catch (error: any) {
      const apiError: ApiError = typeof error === 'string'
        ? { type: 'Internal', message: error }
        : (error as ApiError);

      console.error(`[API ERROR] ${command}:`, apiError);
      Notifications.error(apiError.message);
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

export const DataApi = {
  async getItems(): Promise<Item[]> {
    return client.call<{}, Item[]>("get_items", {});
  },
  async createItem(item: ItemRequest): Promise<number> {
    return client.call<ItemRequest, number>("create_item", item);
  },
  async updateItem(item: Item & ItemRequest): Promise<void> {
    return client.call<Item & ItemRequest, void>("update_item", item);
  },
  async deleteItem(id: number): Promise<void> {
    return client.call<{ id: number }, void>("delete_item", { id });
  },
};

export default {
  UserApi,
  DataApi,
};

