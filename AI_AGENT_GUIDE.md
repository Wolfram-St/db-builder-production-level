# AI Agent - Canvas Integration Guide

## Overview

The AI Assistant now works as a **full agent** that can directly create, modify, and delete elements on the infinity canvas, not just provide conversational responses.

## What Changed

### Before (Conversational Only)
- AI could only chat and provide suggestions
- Users had to manually implement AI's suggestions
- No direct canvas manipulation

### After (Agent Mode)
- AI **directly creates** tables on the canvas
- AI **modifies** existing elements
- AI **organizes** layouts automatically
- AI **imports** complete schemas
- All changes appear instantly on the canvas

## Supported Actions

The AI agent can now execute these actions directly on the canvas:

### 1. Create Table (`create_table`)
Creates a new table on the canvas with optional columns.

**Example User Messages:**
- "Create a users table"
- "Add a products table with id, name, price, and description columns"
- "Create a table called orders"

**What Happens:**
- Table appears immediately on the canvas
- Can include columns with types, primary keys, and constraints
- Positioned automatically or at specified coordinates

**Backend Response Format:**
```json
{
  "message": "I've created a users table on the canvas",
  "actions": [{
    "type": "create_table",
    "data": {
      "name": "users",
      "columns": [
        { "name": "id", "type": "integer", "isPrimary": true },
        { "name": "email", "type": "varchar", "isUnique": true },
        { "name": "created_at", "type": "timestamp" }
      ],
      "x": 100,
      "y": 100
    }
  }]
}
```

### 2. Update Table (`update_table`)
Modifies an existing table on the canvas.

**Example User Messages:**
- "Rename the users table to customers"
- "Move the products table to the right"

**Backend Response Format:**
```json
{
  "message": "I've updated the table",
  "actions": [{
    "type": "update_table",
    "data": {
      "tableId": "uuid-here",
      "name": "customers",
      "x": 400,
      "y": 200
    }
  }]
}
```

### 3. Delete Table (`delete_table`)
Removes a table from the canvas.

**Example User Messages:**
- "Delete the temp table"
- "Remove the users table"

**Backend Response Format:**
```json
{
  "message": "I've removed the table from the canvas",
  "actions": [{
    "type": "delete_table",
    "data": {
      "tableId": "uuid-here"
    }
  }]
}
```

### 4. Create Relationship (`create_relation`)
Creates a relationship between two tables on the canvas.

**Example User Messages:**
- "Connect users to posts"
- "Add a foreign key from orders to customers"

**Backend Response Format:**
```json
{
  "message": "I've created a relationship between the tables",
  "actions": [{
    "type": "create_relation",
    "data": {
      "fromTableId": "users-uuid",
      "fromColumnId": "id-column-uuid",
      "toTableId": "posts-uuid",
      "toColumnId": "user_id-column-uuid"
    }
  }]
}
```

### 5. Layout Tables (`layout`)
Automatically organizes all tables on the canvas using an auto-layout algorithm.

**Example User Messages:**
- "Organize my tables"
- "Tidy up the layout"
- "Arrange the tables nicely"

**Backend Response Format:**
```json
{
  "message": "I've organized your tables on the canvas",
  "actions": [{
    "type": "layout",
    "data": {}
  }]
}
```

### 6. Import Schema (`import_schema`)
Imports a complete database schema with multiple tables and relationships.

**Example User Messages:**
- "Create a blog platform schema"
- "Generate an e-commerce database"
- "Import a social media schema"

**Backend Response Format:**
```json
{
  "message": "I've imported the schema to your canvas",
  "actions": [{
    "type": "import_schema",
    "data": {
      "schema": {
        "tables": [
          {
            "id": "uuid1",
            "name": "users",
            "x": 100,
            "y": 100,
            "columns": [...]
          },
          {
            "id": "uuid2",
            "name": "posts",
            "x": 400,
            "y": 100,
            "columns": [...]
          }
        ],
        "relations": [
          {
            "id": "rel-uuid",
            "from": { "tableId": "uuid1", "columnId": "col-uuid1" },
            "to": { "tableId": "uuid2", "columnId": "col-uuid2" }
          }
        ]
      }
    }
  }]
}
```

## How It Works

### Flow Diagram

```
User Types Message
      ↓
AI Chat Sidebar (AIChatSidebar.tsx)
      ↓
AI Service (aiService.ts) → Backend API
      ↓
Backend Returns { message, actions[] }
      ↓
executeAIActions() processes each action
      ↓
dbStore methods called (addTable, updateTablePosition, etc.)
      ↓
Canvas Component (Canvas.tsx) re-renders
      ↓
✓ Changes appear on infinity canvas!
```

### Key Components

1. **AIChatSidebar.tsx**
   - Handles user messages
   - Calls AI backend
   - Executes returned actions via `executeAIActions()`

2. **executeAIActions() function**
   - Processes each action type
   - Calls appropriate dbStore methods
   - Shows toast notifications
   - Handles errors gracefully

3. **dbStore (dbStore.ts)**
   - Manages application state
   - Contains tables, relations, viewport
   - Provides methods: addTable(), updateTablePosition(), etc.

4. **Canvas.tsx**
   - Renders tables from dbStore.tables
   - Automatically updates when store changes
   - Displays tables at their (x, y) coordinates

## Testing the Agent

### Test 1: Simple Table Creation
1. Open AI Assistant (click "AI Assistant" button)
2. Type: "Create a users table"
3. ✓ Table should appear on canvas immediately

### Test 2: Table with Columns
1. Type: "Create a products table with id, name, and price columns"
2. ✓ Table should appear with 3 columns

### Test 3: Layout Organization
1. Create several tables manually or via AI
2. Type: "Organize my tables"
3. ✓ Tables should rearrange in a clean layout

### Test 4: Import Complete Schema
1. Type: "Create a blog platform with users, posts, and comments"
2. ✓ Multiple tables should appear
3. ✓ Relationships should be visible (if backend provides them)

### Test 5: Shadow Workspace
1. Click split view icon in AI chat header
2. Ask AI to create tables
3. ✓ Tables appear in shadow workspace (right panel)
4. Click "Apply Changes"
5. ✓ Tables merge into main workspace

## Backend Implementation Tips

### Pattern Matching Examples

```javascript
const content = lastMessage.content.toLowerCase();

// Detect table creation
if (content.includes('create') && content.includes('table')) {
  const tableName = extractTableName(content);
  return {
    type: 'create_table',
    data: { name: tableName }
  };
}

// Detect layout request
if (content.includes('organize') || content.includes('tidy')) {
  return {
    type: 'layout',
    data: {}
  };
}

// Detect schema generation
if (content.includes('blog') || content.includes('e-commerce')) {
  return {
    type: 'import_schema',
    data: { schema: generateSchema(content) }
  };
}
```

### With OpenAI/Claude

```javascript
const systemPrompt = `You are a database design assistant. When users ask you to create tables or modify schemas, respond with specific actions.

Available actions:
- create_table: Create a new table on the canvas
- update_table: Modify existing table
- delete_table: Remove a table
- create_relation: Link tables
- layout: Auto-organize tables
- import_schema: Import complete schema

Always respond with JSON:
{
  "message": "explanation for user",
  "actions": [{ "type": "...", "data": {...} }]
}`;

const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ],
  response_format: { type: "json_object" }
});
```

## Troubleshooting

### Tables Not Appearing on Canvas

**Symptom:** AI says it created a table, but nothing appears on canvas

**Possible Causes:**
1. Action type mismatch - check backend returns exact type: "create_table"
2. Data format wrong - ensure `data.name` is a string
3. dbStore not updating - check browser console for errors

**Solution:**
- Check browser console (F12) for errors
- Verify AI response structure matches expected format
- Check that Canvas.tsx is rendering from dbStore.tables

### Import Schema Not Working

**Symptom:** import_schema action runs but tables don't appear

**Possible Causes:**
1. Schema format doesn't match expected structure
2. Compiler validation failing
3. Duplicate table IDs

**Solution:**
- Ensure tables have unique `id` fields (use UUID)
- Include required fields: id, name, x, y, columns[]
- Check console for ProjectCompiler errors

### Layout Not Organizing

**Symptom:** Layout action completes but tables stay in same position

**Possible Causes:**
1. getLayoutedElements() dependency missing
2. Tables don't have proper relations

**Solution:**
- Check that `elkjs` package is installed
- Verify layout utility is imported correctly
- Layout works best with at least 2-3 tables

## Best Practices

### 1. Always Provide Feedback
Show toast notifications for every action so users know what happened.

### 2. Handle Errors Gracefully
Wrap each action in try-catch and show user-friendly error messages.

### 3. Validate Input
Check that required fields exist before executing actions.

### 4. Use Meaningful Names
When extracting table names, use sensible defaults like "new_table" if name can't be determined.

### 5. Position Intelligently
When creating multiple tables, spread them out (different x, y coordinates).

### 6. Auto-Layout After Import
Call layout action after importing multiple tables for better UX.

## Future Enhancements

- Column editing (add/remove columns to existing tables)
- Bulk operations (create multiple tables in one action)
- Relationship cardinality specification
- Undo/redo for AI actions
- AI suggestions without auto-execution (preview mode)
- Schema validation and improvement suggestions
- Export AI conversation for documentation

## Summary

The AI assistant is now a **full agent** that:
- ✓ Creates tables directly on canvas
- ✓ Modifies existing elements
- ✓ Organizes layouts automatically
- ✓ Imports complete schemas
- ✓ Works with shadow workspace for safe previews

All actions execute immediately and appear on the infinity canvas, making the AI a true co-designer rather than just a chatbot.
