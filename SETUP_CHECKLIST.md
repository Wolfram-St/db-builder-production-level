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

## Environment Setup (Optional)
- [ ] `.env.example` file exists (check: `ls .env.example`)
- [ ] `.env` file created (run: `cp .env.example .env`)
- [ ] Supabase project created (if using cloud features)
- [ ] Environment variables configured in `.env`
  - [ ] `VITE_PROJECT_URL` set
  - [ ] `VITE_ANON_KEY` set

**Note:** You can skip this section if you only want to use local mode!

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

### ❌ Supabase errors on startup
**Solution:** Missing or invalid environment variables
- Check that `.env` file exists
- Verify values are correct
- Or run in local mode (app works without Supabase)

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
