# Contributing to DB Builder

Thank you for your interest in contributing to DB Builder! This document provides guidelines and instructions for setting up your development environment.

## Development Setup

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Wolfram-St/db-builder-production-level.git
cd db-builder-production-level

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your Supabase credentials (optional for local dev)

# Start development server
npm run dev
```

## Development Workflow

### Running the Application

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Project Structure

```
src/
├── components/          # React components
│   ├── assistant/      # AI chat assistant
│   ├── canvas/         # Drawing canvas
│   ├── nodes/          # Table nodes
│   └── ui/             # Reusable components
├── store/              # Zustand stores
├── lib/                # Utilities
├── hooks/              # Custom hooks
└── App.tsx             # Main app
```

### Code Style

- Use TypeScript for all new code
- Follow existing code style
- Run `npm run lint` before committing
- Use meaningful component and variable names
- Add comments for complex logic

### State Management

This project uses Zustand for state management:
- `dbStore.ts` - Main database schema state
- `assistantStore.ts` - AI assistant state

### Adding New Features

1. Create feature branch from main
2. Implement feature with tests (if applicable)
3. Run linter: `npm run lint`
4. Test manually in browser
5. Commit with descriptive message
6. Create pull request

### Component Guidelines

- Use functional components with hooks
- Extract reusable logic into custom hooks
- Keep components focused and single-purpose
- Use TypeScript interfaces for props
- Follow existing naming conventions

### Styling

- Use Tailwind CSS utility classes
- Follow existing design system:
  - Colors: `violet-600/500`, `zinc-900/800/700`
  - Effects: `backdrop-blur-xl`, `shadow-2xl`
  - Borders: `border-white/10`
- Maintain glassmorphic design aesthetic

### Testing

Currently, this project doesn't have automated tests. Manual testing in the browser is required:

1. Test all interactive features
2. Verify keyboard shortcuts work
3. Check responsive design
4. Test error handling

## Dependencies

### Key Technologies

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Supabase** - Backend (optional)

### Adding Dependencies

Only add dependencies when necessary:
```bash
# Production dependency
npm install package-name

# Development dependency
npm install -D package-name
```

## Environment Variables

Required environment variables (in `.env`):
```
VITE_PROJECT_URL=your_supabase_url
VITE_ANON_KEY=your_supabase_key
```

## Common Tasks

### Adding a New Component

```typescript
// src/components/MyComponent.tsx
import { useState } from 'react';

interface MyComponentProps {
  title: string;
}

export default function MyComponent({ title }: MyComponentProps) {
  return (
    <div className="bg-zinc-900 rounded-xl p-4">
      <h2>{title}</h2>
    </div>
  );
}
```

### Creating a New Store

```typescript
// src/store/myStore.ts
import { create } from 'zustand';

interface MyState {
  count: number;
  increment: () => void;
}

export const useMyStore = create<MyState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));
```

## Troubleshooting

### Build Issues

- Clear `node_modules`: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist`
- Update dependencies: `npm update`

### TypeScript Errors

- Check `tsconfig.json` settings
- Ensure all types are properly imported
- Use `// @ts-ignore` sparingly and only when necessary

## Questions?

Open an issue on GitHub if you have questions or need help!
