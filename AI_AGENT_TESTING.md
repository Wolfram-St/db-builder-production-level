# AI Agent - Quick Test Guide

## Testing the AI Agent Canvas Integration

This guide shows how to test that the AI assistant now properly adds elements to the canvas.

## Prerequisites

1. Start the backend server (see MOCK_BACKEND.md for a simple mock server)
2. Set `VITE_AI_API_URL` in `.env` (default: http://localhost:8000)
3. Run the frontend: `npm run dev`
4. Navigate to the WorkStation (create or open a project)

## Quick Tests

### Test 1: Basic Table Creation ✓

**What to test:** AI creates a simple table that appears on canvas

**Steps:**
1. Click "AI Assistant" button (top-right)
2. Type: `Create a users table`
3. Press Enter

**Expected Result:**
- ✓ Toast notification: "Table 'users' created on canvas"
- ✓ New table appears on the infinity canvas
- ✓ Table is labeled "users"
- ✓ Table is draggable and interactive

**Backend Response Example:**
```json
{
  "message": "I've created a users table",
  "actions": [{
    "type": "create_table",
    "data": { "name": "users" }
  }]
}
```

---

### Test 2: Table with Columns ✓

**What to test:** AI creates a table with specific columns

**Steps:**
1. Type: `Create a products table with id, name, price, and stock columns`
2. Press Enter

**Expected Result:**
- ✓ Toast notification: "Table 'products' created on canvas"
- ✓ Table appears with 4 columns
- ✓ Each column has correct name
- ✓ Columns have appropriate types

**Backend Response Example:**
```json
{
  "message": "I've created a products table with columns",
  "actions": [{
    "type": "create_table",
    "data": {
      "name": "products",
      "columns": [
        { "name": "id", "type": "integer", "isPrimary": true },
        { "name": "name", "type": "varchar" },
        { "name": "price", "type": "decimal" },
        { "name": "stock", "type": "integer" }
      ]
    }
  }]
}
```

---

### Test 3: Auto-Layout ✓

**What to test:** AI organizes existing tables

**Steps:**
1. Create 2-3 tables (manually or via AI)
2. Type: `Organize my tables`
3. Press Enter

**Expected Result:**
- ✓ Toast notification: "Tables organized on canvas"
- ✓ Tables rearrange into a clean layout
- ✓ Tables are evenly spaced
- ✓ Layout is easy to read

**Backend Response Example:**
```json
{
  "message": "I've organized your tables",
  "actions": [{
    "type": "layout",
    "data": {}
  }]
}
```

---

### Test 4: Import Complete Schema ✓

**What to test:** AI imports multiple tables at once

**Steps:**
1. Type: `Create a blog schema with users, posts, and comments`
2. Press Enter

**Expected Result:**
- ✓ Toast notification: "3 tables imported to canvas"
- ✓ Three tables appear on canvas
- ✓ Tables are named users, posts, comments
- ✓ Each table has appropriate columns
- ✓ Tables may have relationships (lines between them)

**Backend Response Example:**
```json
{
  "message": "I've created a blog schema",
  "actions": [{
    "type": "import_schema",
    "data": {
      "schema": {
        "tables": [
          {
            "id": "uuid-1",
            "name": "users",
            "x": 100,
            "y": 100,
            "columns": [
              { "id": "c1", "name": "id", "type": "integer", "isPrimary": true },
              { "id": "c2", "name": "username", "type": "varchar" },
              { "id": "c3", "name": "email", "type": "varchar" }
            ]
          },
          {
            "id": "uuid-2",
            "name": "posts",
            "x": 400,
            "y": 100,
            "columns": [
              { "id": "c4", "name": "id", "type": "integer", "isPrimary": true },
              { "id": "c5", "name": "user_id", "type": "integer", "isForeign": true },
              { "id": "c6", "name": "title", "type": "varchar" },
              { "id": "c7", "name": "content", "type": "text" }
            ]
          },
          {
            "id": "uuid-3",
            "name": "comments",
            "x": 700,
            "y": 100,
            "columns": [
              { "id": "c8", "name": "id", "type": "integer", "isPrimary": true },
              { "id": "c9", "name": "post_id", "type": "integer", "isForeign": true },
              { "id": "c10", "name": "user_id", "type": "integer", "isForeign": true },
              { "id": "c11", "name": "content", "type": "text" }
            ]
          }
        ],
        "relations": []
      }
    }
  }]
}
```

---

### Test 5: Shadow Workspace ✓

**What to test:** AI changes appear in shadow workspace first

**Steps:**
1. Click the split view icon (in AI chat header)
2. Type: `Create an orders table`
3. Press Enter
4. Observe the shadow workspace (right panel)
5. Click "Apply Changes"

**Expected Result:**
- ✓ Split view opens (2 panels)
- ✓ Left panel: existing tables
- ✓ Right panel: shadow workspace
- ✓ New table appears in shadow workspace
- ✓ Click "Apply" merges to main workspace
- ✓ Click "Discard" removes shadow changes

---

## Common Issues

### Issue: Tables Not Appearing

**Symptoms:**
- AI responds but no table on canvas
- Console shows no errors

**Check:**
1. Open browser console (F12)
2. Look for error messages
3. Verify backend response format
4. Check that `actions` array exists

**Solution:**
```javascript
// Backend must return:
{
  "message": "...",
  "actions": [{ ... }]  // Not "action" (singular)
}
```

---

### Issue: Backend Not Responding

**Symptoms:**
- AI shows "Failed to communicate with AI"
- Network error in console

**Check:**
1. Backend server is running
2. Correct URL in `.env`
3. CORS is enabled on backend
4. Endpoint is `/ai/chat` not `/chat`

**Solution:**
```bash
# Start mock backend
node mock-ai-server.js

# Or use the full backend
cd db-builder-backend
python -m uvicorn main:app --reload
```

---

### Issue: Wrong Action Type

**Symptoms:**
- Toast says "Action 'xyz' not yet implemented"
- Table created but no columns

**Check:**
1. Backend returns exact action type
2. Case-sensitive: "create_table" not "createTable"
3. Data field has correct structure

**Solution:**
```javascript
// Correct:
{
  type: "create_table",  // lowercase, underscore
  data: { name: "users" }
}

// Wrong:
{
  type: "createTable",   // camelCase
  data: { tableName: "users" }  // wrong field name
}
```

---

## Manual Testing Checklist

Use this checklist to verify the AI agent works:

- [ ] AI Assistant button visible in top-right
- [ ] Chat sidebar opens when clicked
- [ ] Can type messages and press Enter
- [ ] AI responds with messages
- [ ] `create_table` action creates table on canvas
- [ ] Table is visible and draggable
- [ ] Table has correct name
- [ ] `create_table` with columns works
- [ ] Columns appear in table
- [ ] `layout` action rearranges tables
- [ ] `import_schema` creates multiple tables
- [ ] Split view toggle works
- [ ] Shadow workspace shows AI changes
- [ ] "Apply Changes" merges to main
- [ ] "Discard" removes shadow changes
- [ ] Error messages are user-friendly
- [ ] Toast notifications appear for each action

---

## Success Criteria

The AI agent is working correctly if:

1. **Tables Appear:** When AI says it created a table, it appears on canvas
2. **Instant Feedback:** Changes are immediate, no page refresh needed
3. **Full Features:** Tables are interactive (drag, edit, delete)
4. **Error Handling:** Failures show helpful error messages
5. **Visual Confirmation:** Toast notifications for every action

---

## Next Steps

After confirming the AI agent works:

1. Test with real backend (not just mock)
2. Try complex schemas (10+ tables)
3. Test relationship creation
4. Test undo/redo with AI changes
5. Test with images (upload ER diagrams)
6. Test concurrent operations
7. Performance test (many rapid AI commands)

---

## Screenshots Needed

To verify visually:

1. **Before AI command:** Empty or existing canvas
2. **After AI command:** New table(s) on canvas
3. **Split view:** Shadow workspace with AI changes
4. **Layout action:** Before and after organization
5. **Import schema:** Multiple tables added at once

Screenshot locations:
- Save to: `/tmp/ai-agent-tests/`
- Format: PNG
- Names: `test-1-create-table.png`, `test-2-with-columns.png`, etc.
