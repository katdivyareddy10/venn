# 📝 Form project

This is a Vite-based form project that demonstrates robust input handling, live validation, and clean, extensible React code.

---

## 🚀 Getting Started

1. **Install dependencies:**

   ```sh
   yarn install
   ```

2. **Node version:**
   Ensure you’re running **Node.js v20 or newer**.

3. **Run the app:**

   ```sh
   yarn dev
   ```

---

## 🛠️ Testing

All core logic and components have automated tests (React Testing Library).
To run them:

```sh
yarn test
```

---

## 💡 Project Overview

- **Framework:** Vite + React + TypeScript
- **Form:** Accepts user input, validates fields (incl. async checks with backend), shows clear validation messages.
- **Extensible:** Built so new fields and input types can be added easily, and future steps (multi-step onboarding, etc.) can reuse all the logic.
- **Network:** Uses robust utility functions for GET/POST requests and error handling.
- **Validation:** Handles both sync (local) and async (API) validation, giving instant, user-friendly feedback.
- **Tested:** Includes integration/component tests to ensure reliable UI/UX.

---

## 🤖 How I Approached It

- **Form logic** is decoupled from presentation and easily extensible for multi-step flows.
- **Network and validation** are abstracted for reusability.
- **No component library used**—all styling is hand-crafted for a modern, clean look.
- **Tests cover** all the essentials: input handling, validation errors, and form submission.

---

## 🏗️ Extending the Component

- If further steps are adding along the way, it would be fully re-usable.
- Future features like file upload, select/dropdown, or date picker are all possible with little tweaks to FieldConfig
