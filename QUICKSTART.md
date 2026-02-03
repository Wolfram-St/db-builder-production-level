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

# 3. Set up environment variables
cp .env.example .env

# 4. Configure your .env file with:
# - PORT (default: 3000)
# - SHADOW_DB_URL (PostgreSQL database - get free at neon.tech)
# - HF_ACCESS_TOKEN (Hugging Face token for AI - get at huggingface.co/settings/tokens)
# - Optional: VITE_PROJECT_URL and VITE_ANON_KEY (Supabase for cloud features)

# 5. Start the dev server
npm run dev
```

Open http://localhost:5173 in your browser.

## Environment Setup

### Required Variables

1. **Database**: Get a free PostgreSQL database
   - [Neon.tech](https://neon.tech) (recommended)
   - [Supabase](https://supabase.com)
   - Any PostgreSQL provider

2. **AI Token**: Get Hugging Face access token
   - Go to [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
   - Create a new token
   - Copy to `HF_ACCESS_TOKEN` in `.env`

### Optional: Cloud Save Features

If you want authentication and cloud save:

```bash
# Get free Supabase account at https://supabase.com
# Create a new project
# Copy Project URL and anon key from Settings → API
# Add VITE_PROJECT_URL and VITE_ANON_KEY to your .env file
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
