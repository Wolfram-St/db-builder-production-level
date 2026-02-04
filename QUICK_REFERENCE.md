# AI Agent Quick Reference

## 🚀 Quick Start (1 Minute)

```bash
# Terminal 1: Start mock backend
node mock-ai-server.js

# Terminal 2: Start frontend
npm run dev

# Browser: Click "AI Assistant" → Type "Create a users table" → See it appear on canvas!
```

## 💬 Example Commands

| Command | What Happens |
|---------|-------------|
| `Create a users table` | Single empty table |
| `Create a products table with id, name, and price` | Table with 3 columns |
| `Organize my tables` | Auto-layout all tables |
| `Create a blog platform` | Users, posts, comments tables |
| `Create an e-commerce schema` | Products, customers, orders |

## 🎯 Action Types Reference

```typescript
// 1. CREATE TABLE
{
  type: "create_table",
  data: {
    name: "users",
    columns: [
      { name: "id", type: "integer", isPrimary: true },
      { name: "email", type: "varchar" }
    ],
    x: 100,  // optional
    y: 100   // optional
  }
}

// 2. UPDATE TABLE
{
  type: "update_table",
  data: {
    tableId: "uuid",
    name: "customers",  // optional
    x: 200,             // optional
    y: 150              // optional
  }
}

// 3. DELETE TABLE
{
  type: "delete_table",
  data: {
    tableId: "uuid"     // or tableName: "users"
  }
}

// 4. CREATE RELATIONSHIP
{
  type: "create_relation",
  data: {
    fromTableId: "uuid1",
    fromColumnId: "col1",
    toTableId: "uuid2",
    toColumnId: "col2"
  }
}

// 5. AUTO-LAYOUT
{
  type: "layout",
  data: {}
}

// 6. IMPORT SCHEMA
{
  type: "import_schema",
  data: {
    schema: {
      tables: [...],
      relations: [...]
    }
  }
}
```

## 📝 Backend Response Format

```json
{
  "message": "Human-readable response",
  "actions": [
    { "type": "action_type", "data": {...} }
  ]
}
```

## 🔧 Mock Backend Pattern Matching

```javascript
const content = userMessage.toLowerCase();

if (content.includes('create') && content.includes('table')) {
  // Extract table name
  const tableName = extractName(content);
  
  // Check for columns
  const hasColumns = content.includes('with') || content.includes('column');
  
  return {
    message: `Created ${tableName} table`,
    actions: [{
      type: 'create_table',
      data: { name: tableName, columns: hasColumns ? [...] : [] }
    }]
  };
}
```

## ✅ Success Checklist

- [ ] Mock backend running on port 8000
- [ ] Frontend connected to backend
- [ ] AI Assistant button visible
- [ ] Chat opens when clicked
- [ ] Create table command works
- [ ] Table appears on canvas
- [ ] Layout command works
- [ ] Toast notifications appear

## 🐛 Common Issues

**Tables Not Appearing:**
- Check: Action type is "create_table" (lowercase, underscore)
- Check: Data includes "name" field
- Check: No console errors

**Backend Not Responding:**
- Check: Server running on correct port
- Check: `.env` has `VITE_AI_API_URL=http://localhost:8000`
- Check: CORS enabled

**Layout Not Working:**
- Check: At least 2 tables exist
- Check: `elkjs` installed
- Check: Action type is "layout" not "organize"

## 📁 Key Files

| File | Purpose |
|------|---------|
| `src/components/AIChatSidebar.tsx` | Action executor |
| `src/lib/aiService.ts` | Backend API |
| `mock-ai-server.js` | Test backend |
| `README_AI_AGENT.md` | Full documentation |
| `AI_AGENT_TESTING.md` | Test guide |

## 🎨 UI Elements

```
Top Right Corner
├── "AI Assistant" button
│   └── Opens chat sidebar
│
Chat Sidebar (Right side)
├── Message history
├── Input box
├── File attachment button
└── Split view toggle
    └── Opens shadow workspace
```

## 🔄 Execution Flow

```
User Message
    ↓
AIService.chat()
    ↓
Backend returns { message, actions }
    ↓
executeAIActions(actions)
    ↓
For each action:
  ├── Call dbStore method
  ├── Show toast
  └── Handle errors
    ↓
Canvas re-renders
    ↓
✓ Changes visible!
```

## 📊 Action → dbStore Mapping

| Action | dbStore Method |
|--------|---------------|
| `create_table` | `addTable()` + `renameTable()` + `addColumn()` |
| `update_table` | `renameTable()` + `updateTablePosition()` |
| `delete_table` | `removeTable()` |
| `create_relation` | `startRelation()` + `commitRelation()` |
| `layout` | `updateTablePosition()` (for each table) |
| `import_schema` | `importProject()` via ProjectCompiler |

## 🧪 Quick Test Commands

```javascript
// In browser console:

// 1. Check dbStore
window.dbStore = useDBStore.getState();
console.log(window.dbStore.tables);

// 2. Manually trigger action
const action = {
  type: 'create_table',
  data: { name: 'test' }
};
// Execute via AI chat

// 3. Check canvas
document.querySelectorAll('.table-node').length
```

## 💡 Tips

1. **Always test with mock backend first** - Faster iteration
2. **Check browser console** - Errors show here
3. **Use toast notifications** - Confirm actions executed
4. **Start simple** - Test create_table before import_schema
5. **Verify response format** - Must match exactly
6. **Test incrementally** - One action type at a time

## 📚 Documentation Links

- [README_AI_AGENT.md](./README_AI_AGENT.md) - Overview
- [AI_AGENT_GUIDE.md](./AI_AGENT_GUIDE.md) - Complete guide
- [AI_AGENT_TESTING.md](./AI_AGENT_TESTING.md) - Test procedures
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Technical details

## 🎯 One-Liner Tests

```bash
# Test 1: Table creation
curl -X POST http://localhost:8000/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Create a users table"}]}'

# Test 2: Health check
curl http://localhost:8000/health

# Test 3: Schema generation
curl -X POST http://localhost:8000/ai/generate-schema \
  -H "Content-Type: application/json" \
  -d '{"description":"blog platform"}'
```

## ⚡ Performance Notes

- Actions execute sequentially (one at a time)
- Layout operation takes ~100-500ms
- Import schema depends on number of tables
- No artificial delays - instant feedback

## 🔐 Security Notes

- Mock backend has no authentication (testing only!)
- Don't expose mock backend to internet
- Use full backend for production
- Validate all user inputs on real backend

## 📝 Sample Backend Response

```json
{
  "message": "I've created a users table with columns on the canvas",
  "actions": [
    {
      "type": "create_table",
      "data": {
        "name": "users",
        "columns": [
          {
            "name": "id",
            "type": "integer",
            "isPrimary": true
          },
          {
            "name": "email",
            "type": "varchar",
            "isUnique": true
          },
          {
            "name": "created_at",
            "type": "timestamp"
          }
        ]
      }
    }
  ]
}
```

---

**Need Help?** See full documentation in `README_AI_AGENT.md`
