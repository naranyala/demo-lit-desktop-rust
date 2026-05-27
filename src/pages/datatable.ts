import { html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { BaseDocPage } from './base-page';
import { markdownBodyStyles } from '../styles/markdown';
import { DataApi, type Item } from '../api';
import { Notifications } from '../utils/notifications';

@customElement('doc-page-datatable')
export class DocPageDataTable extends BaseDocPage {
  static override styles = [markdownBodyStyles, css`
    :host { display: block; }
  `];

  @state() private _items: Item[] = [];
  @state() private _editingId: number | null = null;
  @state() private _formName = '';
  @state() private _formDesc = '';
  @state() private _isAdding = false;

  constructor() {
    super(`# SQLite CRUD Demo
        
This page demonstrates full CRUD (Create, Read, Update, Delete) operations using a SQLite database in the Tauri backend.
        
\`\`\`typescript
// Rust command example
#[tauri::command]
async fn create_item(state: State<'_, SqlitePool>, name: String, description: String) -> AppResult<i64> {
    db::create_item(&state, &name, &description).await
}
\`\`\``);
    this._loadItems();
  }

  private async _loadItems() {
    try {
      this._items = await DataApi.getItems();
    } catch (e) {
      Notifications.error('Failed to load items');
    }
  }

  private async _handleCreate() {
    if (!this._formName.trim()) return;
    try {
      await DataApi.createItem({ name: this._formName, description: this._formDesc });
      this._formName = '';
      this._formDesc = '';
      this._isAdding = false;
      await this._loadItems();
      Notifications.success('Item created!');
    } catch (e) {
      Notifications.error('Failed to create item');
    }
  }

  private async _handleUpdate(id: number) {
    try {
      await DataApi.updateItem({ id, name: this._formName, description: this._formDesc });
      this._editingId = null;
      this._formName = '';
      this._formDesc = '';
      await this._loadItems();
      Notifications.success('Item updated!');
    } catch (e) {
      Notifications.error('Failed to update item');
    }
  }

  private async _handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await DataApi.deleteItem(id);
      await this._loadItems();
      Notifications.success('Item deleted!');
    } catch (e) {
      Notifications.error('Failed to delete item');
    }
  }

  private _startEdit(item: Item) {
    this._editingId = item.id;
    this._formName = item.name;
    this._formDesc = item.description;
    this._isAdding = false;
  }

  override render() {
    return html`
      <div class="markdown-body">${unsafeHTML(this._md.html)}</div>
      
      <div class="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-800">Manage Items</h3>
          <button 
            @click="${() => { this._isAdding = !this._isAdding; if(this._isAdding) { this._formName = ''; this._formDesc = ''; } }}" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            ${this._isAdding ? 'Cancel' : '+ Add Item'}
          </button>
        </div>

        ${this._isAdding || this._editingId ? html`
          <div class="mb-8 p-4 bg-white border border-gray-300 rounded-lg shadow-inner grid grid-cols-1 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold text-gray-500 uppercase">Name</label>
              <input 
                type="text" 
                .value="${this._formName}" 
                @input="${(e: any) => this._formName = e.target.value}" 
                class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold text-gray-500 uppercase">Description</label>
              <input 
                type="text" 
                .value="${this._formDesc}" 
                @input="${(e: any) => this._formDesc = e.target.value}" 
                class="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div class="flex justify-end gap-2 mt-2">
              <button 
                @click="${() => { this._isAdding = false; this._editingId = null; }}" 
                class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button 
                @click="${this._editingId ? () => this._handleUpdate(this._editingId!) : this._handleCreate}" 
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
              >
                ${this._editingId ? 'Update Item' : 'Create Item'}
              </button>
            </div>
          </div>
        ` : ''}

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-300 text-xs uppercase text-gray-500 font-semibold">
                <th class="py-3 px-2">ID</th>
                <th class="py-3 px-2">Name</th>
                <th class="py-3 px-2">Description</th>
                <th class="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${this._items.map(item => html`
                <tr class="border-b border-gray-200 hover:bg-gray-100 transition-colors">
                  <td class="py-3 px-2 text-sm text-gray-500">${item.id}</td>
                  <td class="py-3 px-2 text-sm font-medium text-gray-800">${item.name}</td>
                  <td class="py-3 px-2 text-sm text-gray-600">${item.description}</td>
                  <td class="py-3 px-2 text-right space-x-2">
                    <button 
                      @click="${() => this._startEdit(item)}" 
                      class="text-blue-600 hover:text-blue-800 text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button 
                      @click="${() => this._handleDelete(item.id)}" 
                      class="text-red-600 hover:text-red-800 text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              `)}
              ${this._items.length === 0 ? html`
                <tr>
                  <td colspan="4" class="py-8 text-center text-gray-400 italic text-sm">
                    No items found. Try adding one!
                  </td>
                </tr>
              ` : ''}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
}
