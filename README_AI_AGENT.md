# AI Coding Assistant - Full Agent Mode

This document provides a complete overview of the AI coding assistant feature that now works as a **full agent** capable of directly manipulating the database canvas.

## 🎯 What's New

The AI assistant is no longer just a chatbot - it's now a **true agent** that:

- ✅ **Creates tables** directly on the infinity canvas
- ✅ **Adds columns** with proper types and constraints
- ✅ **Organizes layouts** automatically
- ✅ **Imports complete schemas** with multiple tables
- ✅ **Creates relationships** between tables
- ✅ **Works with shadow workspace** for safe previews

## 📚 Documentation

- **[AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md)** - Complete guide to all AI agent capabilities and actions
- **[AI_AGENT_TESTING.md](./AI_AGENT_TESTING.md)** - Step-by-step testing guide with examples
- **[mock-ai-server.js](./mock-ai-server.js)** - Simple mock backend for testing

## 🚀 Quick Start

### 1. Set Up the Mock Backend (for testing)

```bash
# Install dependencies for mock server
npm install express cors multer

# Start the mock backend
node mock-ai-server.js
```

The mock server runs on `http://localhost:8000` and provides basic AI responses.

### 2. Configure the Frontend

Create a `.env` file:

```env
VITE_AI_API_URL=http://localhost:8000
```

### 3. Run the Application

```bash
npm install
npm run dev
```

### 4. Test the AI Agent

1. Navigate to a project workspace
2. Click "**AI Assistant**" button (top-right corner)
3. Try these commands:
   - `Create a users table`
   - `Add a products table with id, name, and price columns`
   - `Organize my tables`
   - `Create a blog schema`

**Result:** Tables should appear immediately on the canvas! 🎉

## 🎬 Example Interactions

### Simple Table Creation

**You:** `Create a users table`

**AI:** Creates a table named "users" on the canvas

**What happens:**
- AI backend returns action: `{ type: "create_table", data: { name: "users" } }`
- Frontend executes: `dbStore.addTable()` + `dbStore.renameTable()`
- Table appears on canvas instantly

### Table with Columns

**You:** `Create a products table with id, name, price, and stock columns`

**AI:** Creates a table with 4 columns

**What happens:**
- AI backend returns action with columns array
- Frontend creates table and adds each column
- Table with all columns appears on canvas

### Complete Schema Import

**You:** `Create a blog platform`

**AI:** Creates users, posts, and comments tables

**What happens:**
- AI backend returns `import_schema` action
- Frontend imports all tables via ProjectCompiler
- Multiple tables appear on canvas with relationships

### Auto-Layout

**You:** `Organize my tables`

**AI:** Rearranges all tables neatly

**What happens:**
- AI backend returns `layout` action
- Frontend calls `getLayoutedElements()`
- All tables reposition into clean layout

## 🔧 How It Works

```
┌─────────────────────────────────────────────────────────┐
│                    User Types Message                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              AIChatSidebar.tsx                          │
│  - Collects user message                                │
│  - Sends to AI backend via AIService                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 AI Backend Server                        │
│  - Processes message                                     │
│  - Returns { message, actions[] }                        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│            executeAIActions()                            │
│  - Loops through each action                             │
│  - Calls appropriate dbStore method                      │
│  - Shows toast notification                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  dbStore (Zustand)                       │
│  - Updates state (tables, relations, viewport)           │
│  - Triggers React re-render                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 Canvas Component                         │
│  - Renders tables from dbStore.tables                    │
│  - Shows new/updated elements                            │
└─────────────────────────────────────────────────────────┘
                     │
                     ▼
              ✓ Changes visible on infinity canvas!
```

## 🛠️ Supported AI Actions

| Action | What It Does | Example Command |
|--------|-------------|-----------------|
| `create_table` | Creates a new table on canvas | "Create a users table" |
| `update_table` | Renames or repositions table | "Rename users to customers" |
| `delete_table` | Removes table from canvas | "Delete the temp table" |
| `create_relation` | Links two tables | "Connect users to posts" |
| `update_relation` | Changes relationship type | "Make it a many-to-many relation" |
| `delete_relation` | Removes relationship | "Remove the connection" |
| `layout` | Auto-organizes tables | "Organize my tables" |
| `import_schema` | Imports complete schema | "Create a blog platform" |

See [AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md) for detailed documentation of each action.

## 🧪 Testing

Follow the [AI_AGENT_TESTING.md](./AI_AGENT_TESTING.md) guide for comprehensive testing:

1. ✓ Basic table creation
2. ✓ Table with columns
3. ✓ Auto-layout
4. ✓ Complete schema import
5. ✓ Shadow workspace integration

## 🔌 Backend Integration

### Option 1: Mock Server (for testing)

Use the included `mock-ai-server.js`:

```bash
node mock-ai-server.js
```

This provides basic pattern matching and returns appropriate actions.

### Option 2: Full Backend

Use the complete backend from: https://github.com/Khengar/db-builder-backend

Features:
- Real AI integration (OpenAI/Claude)
- Advanced schema generation
- Image analysis for ER diagrams
- Context-aware responses

### Option 3: Custom Backend

Implement your own backend with these endpoints:

**POST /ai/chat**
```json
Request:
{
  "messages": [...],
  "context": { "tables": [...], "relations": [...] }
}

Response:
{
  "message": "I've created a users table",
  "actions": [{
    "type": "create_table",
    "data": { "name": "users" }
  }]
}
```

## 📝 Key Files

| File | Purpose |
|------|---------|
| `src/components/AIChatSidebar.tsx` | Main chat UI and action execution |
| `src/lib/aiService.ts` | AI backend communication |
| `src/store/aiChatStore.ts` | Chat and workspace state management |
| `src/components/ShadowWorkspace.tsx` | Preview workspace for AI changes |
| `mock-ai-server.js` | Simple mock backend for testing |

## 🎨 UI Components

### AI Chat Sidebar
- Opens from top-right "AI Assistant" button
- Collapsible panel (right side)
- Message history
- File/image attachment support
- Split view toggle

### Shadow Workspace
- Side-by-side view (main + shadow)
- Preview AI changes before applying
- Apply or discard controls
- Safe experimentation

## 🐛 Troubleshooting

### Tables Not Appearing

**Problem:** AI says it created a table but nothing appears

**Check:**
1. Browser console for errors
2. Backend response includes `actions` array
3. Action type is exactly "create_table" (lowercase, underscore)
4. Data includes `name` field

**Solution:** Verify backend response format matches expected structure.

### Backend Connection Failed

**Problem:** "Failed to communicate with AI" error

**Check:**
1. Backend server is running
2. `.env` has correct `VITE_AI_API_URL`
3. CORS enabled on backend
4. No firewall blocking port 8000

**Solution:** Start mock server and verify health endpoint:
```bash
curl http://localhost:8000/health
```

### Layout Not Working

**Problem:** Layout action completes but tables don't move

**Check:**
1. `elkjs` dependency installed
2. At least 2 tables on canvas
3. No console errors

**Solution:** Run `npm install` to ensure all dependencies present.

## 🚦 Success Criteria

The AI agent is working correctly when:

1. ✅ **Tables Appear:** AI-created tables show up on canvas
2. ✅ **Instant Updates:** Changes happen immediately
3. ✅ **Interactive:** Tables can be dragged, edited, deleted
4. ✅ **Toast Notifications:** Actions show feedback
5. ✅ **Error Handling:** Failures show user-friendly messages

## 📸 Visual Confirmation

Expected behavior:

1. **Before:** Empty or existing canvas
2. **User types:** "Create a users table"
3. **AI responds:** "I've created a users table on the canvas"
4. **After:** New table appears, draggable and editable
5. **Confirmation:** Toast notification shows success

## 🔮 Future Enhancements

Potential improvements:

- [ ] Column editing via AI (add/remove columns)
- [ ] Relationship recommendations
- [ ] Schema optimization suggestions
- [ ] SQL generation from natural language
- [ ] Multi-database support (PostgreSQL, MySQL, etc.)
- [ ] Voice commands
- [ ] Collaborative AI (multi-user)
- [ ] AI-powered schema validation

## 📄 License

This feature is part of the DB Builder project. See main project LICENSE.

## 🤝 Contributing

To contribute:

1. Test the AI agent thoroughly
2. Report issues with screenshots
3. Suggest new AI actions
4. Improve backend pattern matching
5. Add more schema templates

## 📞 Support

For issues:

1. Check [AI_AGENT_TESTING.md](./AI_AGENT_TESTING.md)
2. Review browser console errors
3. Verify backend response format
4. Check [AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md)

## ✨ Summary

The AI assistant is now a **fully functional agent** that:

- **Creates** tables directly on canvas ✓
- **Modifies** existing elements ✓
- **Organizes** layouts automatically ✓
- **Imports** complete schemas ✓
- **Works** with shadow workspace ✓

**All changes appear instantly on the infinity canvas, making the AI a true co-designer!** 🎨🤖
