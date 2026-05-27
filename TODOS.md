# Project Roadmap & TODOs

## 🎯 Current Status
- [x] Basic Tauri + Lit integration
- [x] Tailwind CSS v4 setup
- [x] Type-safe API Abstraction (ApiClient)
- [x] End-to-end Error Handling System
- [x] Professional Docs Layout with Shiki highlighting
- [x] Global Notification System
- [x] Reusable Frontend/Backend Stdlibs

## 🛠️ Short Term Goals
- [ ] Implement a global Theme Provider (Dark/Light mode)
- [ ] Add more complex Lit component examples to the Docs layout
- [ ] Implement a state management solution (e.g., NanoStores or Lit context)
- [ ] Add unit tests for `src/utils` and `src-tauri/src/stdlib`

## 🚀 Long Term Goals
- [ ] Implement a plugin system for the documentation interface
- [ ] Integrate a full-text search for the docs using a Rust-based engine (like Tantivy)
- [ ] Create a set of shared UI primitives (Buttons, Inputs, Modals) using Lit
- [ ] Optimize bundle size and startup time

## 🐛 Known Issues
- [ ] Shiki language loading may cause a slight flicker on first render
- [ ] `unsafeCSS` warnings in certain TS configurations
