# Quick Start Guide

Get DB Builder running in 5 minutes! 🚀

## Prerequisites
- Node.js v18+ installed ([Download here](https://nodejs.org/))

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/Wolfram-St/db-builder-production-level.git
cd db-builder-production-level

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

That's it! Open http://localhost:5173 in your browser.

## Optional: Supabase Setup (for cloud features)

If you want authentication and cloud save:

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Get free Supabase account at https://supabase.com
# 3. Create a new project
# 4. Copy Project URL and anon key from Settings → API
# 5. Paste them into your .env file
```

## What You Can Do

✅ **Design Schemas** - Drag and drop tables
✅ **Add Columns** - Click "Add Column" in any table  
✅ **Create Relations** - Connect columns to create foreign keys
✅ **AI Assistant** - Press `Ctrl+K` for help
✅ **Generate SQL** - Click "Build SQL" button
✅ **Export** - Save as JSON or screenshot

## Need Help?

See the full [README.md](./README.md) for detailed documentation.

## Quick Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Check code quality
```

Happy building! 🎉
