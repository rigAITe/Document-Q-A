# Document Q&A Frontend

A modern document Q&A experience built with React + TypeScript. Upload documents, extract text, and chat with AI over their contents.

## Features (Concise)
- Document upload with validation + progress (PDF, DOCX, RTF, ODT, TXT, MD, CSV)
- Automatic text extraction (browser-side) for all supported formats
- AI chat interface (OpenAI) with markdown answers
- Q&A history + export to JSON
- Debounced search, toasts, keyboard shortcuts, and dark mode
- Fully responsive layout with mobile-safe-area support

## Quick Start

```bash
npm install
npm run dev
# or: npm run start
```

Open `http://localhost:5173`. The app runs with `npm run dev` or `npm run start` (Vite).

## API Setup (OpenAI)

1. Open the app → **API Settings**
2. Paste your OpenAI key and save
3. Chat is enabled immediately

Notes:
- Key is stored locally in your browser
- Without a key, chat is disabled

## Scripts

```bash
npm run dev      # dev server (same as start)
npm run start    # dev server
npm run build    # production build
npm run preview  # preview build
npm test         # unit tests
```

## Tech Stack

- React 18 + TypeScript 5
- Vite 5
- Tailwind CSS
- React Router 6
- react-markdown
- Jest + React Testing Library

## Project Structure (trimmed)

```
src/
  components/    # UI + screens
  context/       # AppContext
  hooks/         # custom hooks
  utils/         # api + extraction helpers
```

## Spec Compliance (Advanced Test 2)

| Requirement | Status |
|-------------|--------|
| **Core:** Document upload (drag-and-drop), library with metadata, question input + character count, Q&A history per document, search across history | ✅ |
| **Technical:** React + TypeScript (Vite), custom hooks, composition, TypeScript interfaces, error boundaries, loading states, Context API, mock/simulated API | ✅ |
| **UI/UX:** Upload progress, toasts, responsive sidebar, keyboard shortcuts, dark/light toggle | ✅ |
| **Implementation:** Simulated upload + progress, debounced search, form validation, localStorage persistence | ✅ |
| **Bonus:** OpenAI integration, deployment (Netlify), Jest + RTL tests, CSS animations, Markdown responses, export Q&A as JSON | ✅ |
| **Deliverables:** Runnable via `npm install && npm run dev` / `npm run start`, README, package.json | ✅ |
