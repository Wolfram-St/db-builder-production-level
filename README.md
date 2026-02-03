# DB Builder - Production Level

A modern, visual database schema designer with AI-powered assistance. Build and visualize your database schemas with an intuitive drag-and-drop interface.

> 🚀 **Quick Start**: See [QUICKSTART.md](./QUICKSTART.md) for a 5-minute setup guide  
> ✅ **Setup Help**: Use [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) to verify your installation

## Features

- 🎨 Visual database schema designer
- 🤖 AI-powered chat assistant (Ctrl/Cmd + K)
- 📊 Table and relationship management
- 🔗 Automatic foreign key generation
- 💾 Cloud save and local export
- 🎯 SQL generation
- 📸 Schema screenshot export
- ⚡ Auto-layout and tidy-up tools
- 🌓 Dark glassmorphic UI

## Prerequisites

Before you begin, ensure you have the following installed on your computer:

- **Node.js** (v18 or higher recommended)
  - Download from [nodejs.org](https://nodejs.org/)
  - Check your version: `node --version`
- **npm** (comes with Node.js)
  - Check your version: `npm --version`

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Wolfram-St/db-builder-production-level.git
cd db-builder-production-level
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required dependencies including React, Vite, Tailwind CSS, and other libraries.

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
# Create .env file
touch .env
```

Add the following environment variables to your `.env` file:

```env
# Backend Configuration
PORT=3000

# PostgreSQL Database URL (Neon DB or any PostgreSQL provider)
SHADOW_DB_URL=postgresql://your-user:your-password@your-host:5432/your-database?sslmode=require

# Hugging Face Access Token for AI features
HF_ACCESS_TOKEN=your_hugging_face_token

# Optional: Supabase Configuration (for cloud save and authentication)
VITE_PROJECT_URL=your_supabase_project_url
VITE_ANON_KEY=your_supabase_anon_key
```

**Required Environment Variables:**
- **PORT**: Port for the backend server (default: 3000)
- **SHADOW_DB_URL**: PostgreSQL database connection string
  - Get a free PostgreSQL database at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
- **HF_ACCESS_TOKEN**: Hugging Face API token for AI features
  - Get your token from [Hugging Face Settings](https://huggingface.co/settings/tokens)

**Optional (for cloud features):**
- **VITE_PROJECT_URL** & **VITE_ANON_KEY**: Supabase credentials for authentication and cloud save
  - Create a free account at [supabase.com](https://supabase.com)
  - Go to Project Settings → API
  - Copy the Project URL and anon/public key

**Local Mode:** The app works without Supabase using local file exports/imports. However, you'll need the PostgreSQL database and Hugging Face token for core functionality.

### 4. Run the Development Server

```bash
npm run dev
```

The application will start and be available at:
```
http://localhost:5173/
```

Open this URL in your web browser to access the DB Builder.

## Available Scripts

### Development
```bash
npm run dev
```
Starts the development server with hot-reload at `http://localhost:5173/`

### Build
```bash
npm run build
```
Creates an optimized production build in the `dist/` folder

### Preview Production Build
```bash
npm run preview
```
Preview the production build locally before deploying

### Lint
```bash
npm run lint
```
Check code quality and style with ESLint

## Usage

### Getting Started with DB Builder

1. **Add Tables**: Click the "Add Table" button or press `T`
2. **Add Columns**: Click "Add Column" within any table
3. **Create Relationships**: Click the connection icon on a column, then click another column to create a foreign key relationship
4. **Use AI Assistant**: Press `Ctrl+K` (or `Cmd+K` on Mac) to open the AI chat assistant
5. **Generate SQL**: Click "Build SQL" to see the generated SQL schema
6. **Export**: Download your schema as JSON or export as an image

### Keyboard Shortcuts

- `Ctrl/Cmd + K` - Toggle AI Assistant
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` - Redo
- `Delete/Backspace` - Delete selected tables
- `Escape` - Close panels/dialogs
- `T` - Add new table (when canvas is focused)

### AI Assistant

The built-in AI assistant can help you:
- Generate database schemas
- Explain table relationships
- Optimize your design
- Answer questions about SQL and database design

## Project Structure

```
db-builder-production-level/
├── src/
│   ├── components/        # React components
│   │   ├── assistant/     # AI chat assistant components
│   │   ├── canvas/        # Canvas and drawing components
│   │   ├── nodes/         # Table node components
│   │   └── ui/            # Reusable UI components
│   ├── store/             # Zustand state management
│   ├── lib/               # Utilities and helpers
│   ├── hooks/             # Custom React hooks
│   └── App.tsx            # Main application component
├── public/                # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
└── tailwind.config.js     # Tailwind CSS configuration
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Supabase** - Authentication and database
- **Prism.js** - Syntax highlighting
- **Lucide React** - Icons
- **React Router** - Navigation

## Troubleshooting

### Port 5173 is already in use
If you get an error about the port being in use, you can:
1. Stop the other process using port 5173
2. Or change the port in `vite.config.ts`

### Environment variable errors
If you see errors about Supabase configuration:
- Make sure your `.env` file exists in the root directory
- Verify the environment variables are correctly set
- Restart the dev server after changing `.env` files

### Installation errors
If `npm install` fails:
- Make sure you have Node.js v18 or higher
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
- Clear npm cache: `npm cache clean --force`

### Build errors
If you encounter TypeScript errors during build:
- Ensure all dependencies are installed
- Check that you're using a compatible Node.js version
- Try running `npm run lint` to see specific errors

## Contributing

This project uses:
- ESLint for code quality
- TypeScript for type safety
- Conventional commits for version control

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue on the GitHub repository.

---

Built with ❤️ using React, TypeScript, and Vite
