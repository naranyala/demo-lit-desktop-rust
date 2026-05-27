# Lit Desktop Rust (Demo)

A high-performance desktop application built with **Tauri**, **Rust**, and **Lit**. This project demonstrates a modern architecture for desktop apps, combining the speed of Rust with the flexibility of Lit's web components.

## 🚀 Tech Stack

- **Frontend**: [Lit](https://lit.dev/) (Web Components)
- **Backend**: [Rust](https://www.rust-lang.org/) via [Tauri](https://tauri.app/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Build Tool**: [Bun](https://bun.sh/) & [Vite](https://vite.dev/)
- **Syntax Highlighting**: [Shiki](https://shikijs.dev/)

## ✨ Key Features

- **Ergonomic API Bridge**: Type-safe communication between TypeScript and Rust using a centralized `ApiClient`.
- **Professional Docs Layout**: A custom-built documentation interface with an interactive sidebar and high-fidelity code blocks.
- **Robust Error Handling**: End-to-end error propagation from Rust enums to frontend toast notifications.
- **Performance**: Zero-dependency styling via Tailwind and minimal runtime overhead from Lit.

## 🛠️ Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed.
- [Rust](https://www.rust-lang.org/tools/install) installed.
- Tauri dependencies (see [Tauri setup guide](https://tauri.app/v2/guide/getting-started/setup)).

### Installation
```bash
bun install
```

### Development
```bash
bun run tauri dev
```

### Build
```bash
bun run build
bun run tauri build
```

## 📁 Project Structure

- `src/` - Frontend source code.
  - `api/` - Type-safe API definitions and client.
  - `utils/` - Reusable frontend utilities (Storage, Notifications, Highlighter).
  - `docs-layout.ts` - Main UI implementation using Lit.
- `src-tauri/` - Rust backend.
  - `src/stdlib/` - Backend reusable library (e.g., Error handling).
  - `src/main.rs` - Application entry point.
