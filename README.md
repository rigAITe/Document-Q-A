# Document Q&A Frontend

An AI-powered document Q&A frontend application built with React, TypeScript, and Vite. Upload documents, ask questions, and get intelligent answers with a modern, responsive UI.

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)

## ✨ Features

### Core Functionality
- 📤 **Drag & Drop Upload** - Intuitive document upload with visual feedback and progress tracking
- 📚 **Document Library** - Browse and manage uploaded documents with metadata
- 💬 **Q&A System** - Ask questions about documents and get AI-powered answers
- 📋 **Q&A History** - Track all questions and answers with full search capability
- 🔍 **Debounced Search** - Fast, efficient search across Q&A history (300ms debounce)
- 💾 **Persistent Storage** - All data persists in localStorage across sessions

### User Experience
- 🌓 **Theme Toggle** - Switch between light and dark modes (persisted)
- ⌨️ **Keyboard Shortcuts** - Quick access to common actions
  - `Cmd/Ctrl + U` → Navigate to Upload
  - `Cmd/Ctrl + F` → Focus Search / Navigate to History
  - `Esc` → Clear all inputs
- 🎨 **Smooth Animations** - Framer Motion powered transitions
- 📱 **Responsive Design** - Works seamlessly on all screen sizes
- 🎯 **Character Counter** - Real-time character count with validation (500 char limit)
- 🔔 **Toast Notifications** - Non-intrusive success/error feedback

### Technical Features
- ✅ **Strong Type Safety** - 100% TypeScript with no `any` types
- 🎭 **Error Boundary** - Graceful error handling at app level
- 🧪 **Unit Tests** - Jest + React Testing Library
- 🎨 **Markdown Support** - Rich text rendering for Q&A answers
- 📥 **Export Functionality** - Download Q&A history as JSON
- ⚡ **Mock API** - Realistic delays and simulated responses
- 🔄 **Context API** - Global state management
- 🪝 **Custom Hooks** - Reusable logic for common patterns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Typescript-Developer-Test

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test            # Run tests
npm test -- --coverage  # Run tests with coverage
```

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ErrorBoundary.tsx
│   ├── Sidebar.tsx
│   ├── Toast.tsx
│   ├── Upload.tsx
│   ├── DocumentLibrary.tsx
│   ├── QAInterface.tsx
│   └── History.tsx
├── context/            # React Context
│   └── AppContext.tsx
├── hooks/              # Custom hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   ├── useKeyboardShortcuts.ts
│   └── __tests__/      # Hook tests
├── types/              # TypeScript interfaces
│   └── index.ts
├── utils/              # Utilities
│   └── mockApi.ts
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🎯 Usage Guide

### Uploading Documents
1. Navigate to the **Upload** page
2. Drag and drop files or click to browse
3. Supported formats: `.txt`, `.pdf`
4. Watch real-time upload progress

### Asking Questions
1. Go to the **Q&A** page
2. Select a document from the dropdown
3. Type your question (max 500 characters)
4. Press `Cmd/Ctrl + Enter` or click "Ask Question"
5. View AI-generated answer with markdown formatting

### Searching History
1. Navigate to the **History** page
2. Use the search bar to filter questions and answers
3. Search is debounced for optimal performance
4. Export history as JSON using the export button

### Managing Documents
1. Visit the **Documents** page
2. View all uploaded documents with metadata
3. Click a document to start asking questions
4. Delete documents with confirmation

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.2
- **Language**: TypeScript 5.3
- **Build Tool**: Vite 5.0
- **Routing**: React Router 6
- **Animation**: Framer Motion 10
- **Markdown**: react-markdown 9
- **Testing**: Jest + React Testing Library
- **State Management**: React Context API
- **Styling**: Inline styles (CSS-in-JS)

## 🎨 Design Decisions

### State Management
- **Context API** for global state (documents, Q&A history, theme)
- **localStorage** for persistence across sessions
- Custom hooks abstract complex logic

### Type Safety
- Strict TypeScript configuration
- No `any` types allowed
- Comprehensive interfaces for all data structures

### Performance
- Debounced search (300ms)
- Memoized computations
- Optimized re-renders with React best practices

### User Experience
- Instant feedback with toast notifications
- Loading states for async operations
- Error boundaries for graceful failures
- Keyboard shortcuts for power users

## 🧪 Testing

The project includes unit tests for critical functionality:

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

Test coverage includes:
- Custom hooks (useDebounce, useLocalStorage)
- Mock API functions
- Component rendering

## 📦 Deployment

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Environment Variables
No environment variables required - the app uses mock data and localStorage.

## 🔮 Future Enhancements

- [ ] Real backend API integration
- [ ] Multiple file format support (DOCX, XLSX, etc.)
- [ ] PDF preview and text extraction
- [ ] Advanced search with filters
- [ ] User authentication
- [ ] Document sharing and collaboration
- [ ] Cloud storage integration
- [ ] Advanced markdown editor
- [ ] Voice input for questions

## 🐛 Known Issues

- PDF files are accepted but not parsed (mock implementation)
- No file size limit enforcement (to be added with real backend)
- Search doesn't highlight matched terms (planned feature)

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and Vite
