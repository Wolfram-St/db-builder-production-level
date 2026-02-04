#!/usr/bin/env node

/**
 * Simple Mock AI Backend Server for DB Builder
 * 
 * This is a minimal implementation for testing the AI agent features.
 * For production, use the full backend from https://github.com/Khengar/db-builder-backend
 * 
 * Installation:
 *   npm install express cors multer
 * 
 * Usage:
 *   node mock-ai-server.js
 *   Server runs on http://localhost:8000
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// File upload configuration
const upload = multer({ dest: 'uploads/' });

// Helper to generate UUIDs
function generateUUID() {
  return crypto.randomUUID();
}

// Mock AI chat endpoint
app.post('/ai/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage.content.toLowerCase();
    
    let response = "I'm here to help with your database schema!";
    let actions = [];
    
    // Pattern matching for different commands
    
    if (content.includes('create') && content.includes('table')) {
      // Extract table name
      const match = content.match(/table (?:for |called |named )?(\w+)/i);
      const tableName = match ? match[1] : 'new_table';
      
      // Check if user wants columns
      const wantsColumns = content.includes('column') || content.includes('field') || content.includes('with');
      
      if (wantsColumns) {
        response = `I've created a table called "${tableName}" with columns on the canvas.`;
        actions = [{
          type: 'create_table',
          data: {
            name: tableName,
            columns: [
              { name: 'id', type: 'integer', isPrimary: true },
              { name: 'name', type: 'varchar' },
              { name: 'created_at', type: 'timestamp' }
            ]
          }
        }];
      } else {
        response = `I've created a table called "${tableName}" on the canvas.`;
        actions = [{
          type: 'create_table',
          data: { name: tableName }
        }];
      }
    } 
    else if (content.includes('layout') || content.includes('organize') || content.includes('tidy')) {
      response = "I've organized your tables in a clean layout on the canvas.";
      actions = [{ type: 'layout', data: {} }];
    } 
    else if (content.includes('blog') || (content.includes('create') && content.includes('schema'))) {
      response = "I've created a complete blog schema with users, posts, and comments on your canvas.";
      actions = [{
        type: 'import_schema',
        data: {
          schema: {
            tables: [
              {
                id: generateUUID(),
                name: 'users',
                x: 100,
                y: 100,
                columns: [
                  { id: generateUUID(), name: 'id', type: 'integer', isPrimary: true },
                  { id: generateUUID(), name: 'username', type: 'varchar', isUnique: true },
                  { id: generateUUID(), name: 'email', type: 'varchar', isUnique: true },
                  { id: generateUUID(), name: 'created_at', type: 'timestamp' }
                ]
              },
              {
                id: generateUUID(),
                name: 'posts',
                x: 400,
                y: 100,
                columns: [
                  { id: generateUUID(), name: 'id', type: 'integer', isPrimary: true },
                  { id: generateUUID(), name: 'user_id', type: 'integer', isForeign: true },
                  { id: generateUUID(), name: 'title', type: 'varchar' },
                  { id: generateUUID(), name: 'content', type: 'text' },
                  { id: generateUUID(), name: 'created_at', type: 'timestamp' }
                ]
              },
              {
                id: generateUUID(),
                name: 'comments',
                x: 700,
                y: 100,
                columns: [
                  { id: generateUUID(), name: 'id', type: 'integer', isPrimary: true },
                  { id: generateUUID(), name: 'post_id', type: 'integer', isForeign: true },
                  { id: generateUUID(), name: 'user_id', type: 'integer', isForeign: true },
                  { id: generateUUID(), name: 'content', type: 'text' },
                  { id: generateUUID(), name: 'created_at', type: 'timestamp' }
                ]
              }
            ],
            relations: []
          }
        }
      }];
    }
    else if (content.includes('e-commerce') || content.includes('ecommerce') || content.includes('shop')) {
      response = "I've created an e-commerce schema with products, customers, and orders on your canvas.";
      actions = [{
        type: 'import_schema',
        data: {
          schema: {
            tables: [
              {
                id: generateUUID(),
                name: 'customers',
                x: 100,
                y: 100,
                columns: [
                  { id: generateUUID(), name: 'id', type: 'integer', isPrimary: true },
                  { id: generateUUID(), name: 'email', type: 'varchar', isUnique: true },
                  { id: generateUUID(), name: 'name', type: 'varchar' },
                  { id: generateUUID(), name: 'created_at', type: 'timestamp' }
                ]
              },
              {
                id: generateUUID(),
                name: 'products',
                x: 400,
                y: 100,
                columns: [
                  { id: generateUUID(), name: 'id', type: 'integer', isPrimary: true },
                  { id: generateUUID(), name: 'name', type: 'varchar' },
                  { id: generateUUID(), name: 'price', type: 'decimal' },
                  { id: generateUUID(), name: 'stock', type: 'integer' }
                ]
              },
              {
                id: generateUUID(),
                name: 'orders',
                x: 700,
                y: 100,
                columns: [
                  { id: generateUUID(), name: 'id', type: 'integer', isPrimary: true },
                  { id: generateUUID(), name: 'customer_id', type: 'integer', isForeign: true },
                  { id: generateUUID(), name: 'total', type: 'decimal' },
                  { id: generateUUID(), name: 'status', type: 'varchar' },
                  { id: generateUUID(), name: 'created_at', type: 'timestamp' }
                ]
              }
            ],
            relations: []
          }
        }
      }];
    }
    else if (content.includes('delete') || content.includes('remove')) {
      response = "I can help you remove tables from the canvas. Please let me know which table you'd like to delete.";
    } 
    else if (content.includes('relationship') || content.includes('relation')) {
      response = "I can help you create relationships between tables on the canvas. Please specify which tables you want to connect.";
    }
    else {
      response = "I can help you design your database schema! Try asking me to:\n• Create a table\n• Organize the layout\n• Generate a complete schema (blog, e-commerce, etc.)";
    }
    
    res.json({
      message: response,
      actions: actions
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Schema generation endpoint
app.post('/ai/generate-schema', async (req, res) => {
  try {
    const { description } = req.body;
    
    // Simple mock schema
    const mockSchema = {
      tables: [
        {
          id: generateUUID(),
          name: 'users',
          x: 100,
          y: 100,
          columns: [
            { id: generateUUID(), name: 'id', type: 'integer', isPrimary: true },
            { id: generateUUID(), name: 'email', type: 'varchar', isUnique: true },
            { id: generateUUID(), name: 'created_at', type: 'timestamp' }
          ]
        }
      ],
      relations: []
    };
    
    res.json(mockSchema);
  } catch (error) {
    console.error('Generate schema error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// File analysis endpoint
app.post('/ai/analyze-file', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ detail: 'No file uploaded' });
    }
    
    let analysis = `I've analyzed your file "${file.originalname}". `;
    
    if (file.mimetype.startsWith('image/')) {
      analysis += "It appears to be a database diagram. I can help you recreate this schema on the canvas.";
    } else if (file.mimetype === 'application/json') {
      analysis += "It's a JSON file with schema definition. I'll process it for you.";
    } else {
      analysis += "I've received your file for analysis.";
    }
    
    res.json({ analysis });
  } catch (error) {
    console.error('Analyze file error:', error);
    res.status(500).json({ detail: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Mock AI Backend is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✓ Mock AI Backend Server running on http://localhost:${PORT}`);
  console.log('\nAvailable endpoints:');
  console.log('  POST /ai/chat              - Main chat endpoint');
  console.log('  POST /ai/generate-schema   - Schema generation');
  console.log('  POST /ai/analyze-file      - File analysis');
  console.log('  GET  /health               - Health check');
  console.log('\nTest with:');
  console.log(`  curl http://localhost:${PORT}/health`);
  console.log('\nReady to serve AI requests! 🤖\n');
});
