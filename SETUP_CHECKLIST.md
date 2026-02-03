# Setup Checklist ✅

Follow this checklist to ensure you have everything set up correctly.

## Prerequisites
- [ ] Node.js v18 or higher installed
  - Run: `node --version`
  - Should show: v18.x.x or higher
- [ ] npm installed (comes with Node.js)
  - Run: `npm --version`
  - Should show: 8.x.x or higher

## Installation Steps
- [ ] Repository cloned
  ```bash
  git clone https://github.com/Wolfram-St/db-builder-production-level.git
  cd db-builder-production-level
  ```
- [ ] Dependencies installed
  ```bash
  npm install
  ```
  - Should complete without errors
  - Creates `node_modules/` folder

## Environment Setup
- [ ] `.env.example` file exists (check: `ls .env.example`)
- [ ] `.env` file created (run: `cp .env.example .env`)
- [ ] Environment variables configured in `.env`

### Required Variables
- [ ] `PORT` set (e.g., 3000)
- [ ] `SHADOW_DB_URL` set (PostgreSQL connection string)
  - Get free database at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com)
- [ ] `HF_ACCESS_TOKEN` set (Hugging Face token)
  - Get token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

### Optional: Cloud Features
- [ ] Supabase project created (if using cloud save/auth)
- [ ] `VITE_PROJECT_URL` set
- [ ] `VITE_ANON_KEY` set

**Note:** The app requires the database and HF token for core functionality. Supabase is optional for cloud features.

## Running the Application
- [ ] Development server starts
  ```bash
  npm run dev
  ```
  - Should show: "Local: http://localhost:5173/"
- [ ] Browser opens to http://localhost:5173
- [ ] Application loads without errors
- [ ] You can see the DB Builder interface

## Verify Features
- [ ] Can add a table (click "Add Table" button)
- [ ] Can add columns to a table
- [ ] Can create relationships between tables
- [ ] AI Assistant opens (press Ctrl+K or Cmd+K)
- [ ] Can generate SQL (click "Build SQL" button)
- [ ] Can export schema (download button works)

## Common Issues

### ❌ "Port 5173 already in use"
**Solution:** Another app is using the port. Either:
- Stop the other app
- Or change the port in `vite.config.ts`

### ❌ "npm: command not found"
**Solution:** Node.js/npm not installed
- Download from https://nodejs.org/
- Restart terminal after installation

### ❌ "Module not found" errors
**Solution:** Dependencies not installed
```bash
rm -rf node_modules package-lock.json
npm install
```

### ❌ Missing environment variables
**Solution:** Database or API token not configured
- Check that `.env` file exists
- Verify `SHADOW_DB_URL` is set (PostgreSQL connection)
- Verify `HF_ACCESS_TOKEN` is set (Hugging Face token)
- Get free database at [neon.tech](https://neon.tech)
- Get HF token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

### ❌ Supabase errors on startup
**Solution:** Optional cloud features not configured
- Supabase is optional for cloud save/authentication
- Check that `.env` file has `VITE_PROJECT_URL` and `VITE_ANON_KEY`
- Or continue without cloud features (local mode works)

## Success! 🎉

If you can see the DB Builder interface and add tables, you're all set!

### What's Next?
1. Read [README.md](./README.md) for full feature documentation
2. Check [CONTRIBUTING.md](./CONTRIBUTING.md) if you want to contribute
3. Press `Ctrl+K` to chat with the AI assistant
4. Start building your database schema!

## Need Help?

- 📖 Read the [README.md](./README.md)
- ⚡ See [QUICKSTART.md](./QUICKSTART.md)
- 🐛 Check [Troubleshooting](./README.md#troubleshooting) section
- 💬 Open an issue on GitHub

---

Happy building! 🚀
