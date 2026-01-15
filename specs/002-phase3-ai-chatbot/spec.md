# Phase III: Todo AI Chatbot - Specification

## Overview

**Phase**: III - AI Chatbot  
**Status**: In Development  
**Version**: 1.1.0  
**Created**: 2026-01-14  
**Updated**: 2026-01-14 - Changed from OpenAI to Google Gemini

## Objective

Create an AI-powered chatbot interface for managing todos through natural language using MCP (Model Context Protocol) server architecture and Google Gemini AI.

## Development Approach

Follow the Agentic Dev Stack workflow:
1. Write spec → Generate plan → Break into tasks → Implement via Claude Code
2. No manual coding allowed
3. All implementations must trace back to documented specs, plans, and tasks

---

## Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | Custom React Chat UI (Next.js) |
| Backend | Python FastAPI |
| AI Framework | Google Gemini API + LangChain |
| MCP Server | Official MCP SDK |
| ORM | SQLModel |
| Database | Neon Serverless PostgreSQL |
| Authentication | Better Auth (JWT) |

---

## Architecture

```
┌─────────────────┐     ┌──────────────────────────────────────────────┐     ┌─────────────────┐
│                 │     │              FastAPI Server                   │     │                 │
│                 │     │  ┌────────────────────────────────────────┐  │     │                 │
│  React Chat UI  │────▶│  │         Chat Endpoint                  │  │     │    Neon DB      │
│  (Next.js)      │     │  │  POST /api/chat                        │  │     │  (PostgreSQL)   │
│                 │     │  └───────────────┬────────────────────────┘  │     │                 │
│                 │     │                  │                           │     │  - tasks        │
│                 │     │                  ▼                           │     │  - conversations│
│                 │     │  ┌────────────────────────────────────────┐  │     │  - messages     │
│                 │◀────│  │      Google Gemini + LangChain         │  │     │                 │
│                 │     │  │      (Agent + Tool Calling)            │  │     │                 │
│                 │     │  └───────────────┬────────────────────────┘  │     │                 │
│                 │     │                  │                           │     │                 │
│                 │     │                  ▼                           │     │                 │
│                 │     │  ┌────────────────────────────────────────┐  │────▶│                 │
│                 │     │  │         MCP Tools                      │  │     │                 │
│                 │     │  │  (Task Operations via Database)        │  │◀────│                 │
│                 │     │  └────────────────────────────────────────┘  │     │                 │
└─────────────────┘     └──────────────────────────────────────────────┘     └─────────────────┘
```

---

## Environment Variables Required

### Backend (`backend/.env`)

```env
# Existing Phase II variables
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:3000

# NEW: Phase III - Google Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-flash
```

### How to Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key and add to your backend/.env file

---

## Database Models

### Existing Models (From Phase II)
- **User**: id, email, password_hash, name, created_at
- **Todo**: id, user_id, title, description, completed, created_at, updated_at

### New Models (Phase III)

#### Conversation
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| user_id | string | Foreign key to User |
| title | string | Optional conversation title |
| created_at | datetime | Creation timestamp |
| updated_at | datetime | Last update timestamp |

#### Message
| Field | Type | Description |
|-------|------|-------------|
| id | integer | Primary key |
| user_id | string | Foreign key to User |
| conversation_id | integer | Foreign key to Conversation |
| role | string | 'user' or 'assistant' |
| content | string | Message content |
| tool_calls | JSON | Optional - list of tools invoked |
| created_at | datetime | Creation timestamp |

---

## API Endpoints

### Chat Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/chat | Send message & get AI response |

#### Request Schema
```json
{
  "conversation_id": 123,        // Optional - creates new if not provided
  "message": "Add a task to buy groceries"  // Required
}
```

#### Response Schema
```json
{
  "conversation_id": 123,
  "response": "I've added 'Buy groceries' to your task list. Is there anything else you'd like me to help with?",
  "tool_calls": [
    {
      "tool": "add_task",
      "arguments": {"title": "Buy groceries"},
      "result": {"task_id": 5, "status": "created", "title": "Buy groceries"}
    }
  ]
}
```

### Conversation Management Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/conversations | List user's conversations |
| GET | /api/conversations/{id} | Get conversation with messages |
| DELETE | /api/conversations/{id} | Delete a conversation |

---

## MCP Tools Specification

### Tool: add_task
| Attribute | Value |
|-----------|-------|
| Purpose | Create a new task |
| Parameters | user_id (string, required), title (string, required), description (string, optional) |
| Returns | task_id, status, title |

**Example:**
```json
// Input
{"user_id": "user123", "title": "Buy groceries", "description": "Milk, eggs, bread"}
// Output
{"task_id": 5, "status": "created", "title": "Buy groceries"}
```

### Tool: list_tasks
| Attribute | Value |
|-----------|-------|
| Purpose | Retrieve tasks from the list |
| Parameters | user_id (string, required), status (string, optional: "all", "pending", "completed") |
| Returns | Array of task objects |

**Example:**
```json
// Input
{"user_id": "user123", "status": "pending"}
// Output
[{"id": 1, "title": "Buy groceries", "completed": false}, ...]
```

### Tool: complete_task
| Attribute | Value |
|-----------|-------|
| Purpose | Mark a task as complete |
| Parameters | user_id (string, required), task_id (integer, required) |
| Returns | task_id, status, title |

### Tool: delete_task
| Attribute | Value |
|-----------|-------|
| Purpose | Remove a task from the list |
| Parameters | user_id (string, required), task_id (integer, required) |
| Returns | task_id, status, title |

### Tool: update_task
| Attribute | Value |
|-----------|-------|
| Purpose | Modify task title or description |
| Parameters | user_id (string, required), task_id (integer, required), title (string, optional), description (string, optional) |
| Returns | task_id, status, title |

---

## Agent Behavior Specification

| Behavior | Description |
|----------|-------------|
| Task Creation | When user mentions adding/creating/remembering something, use add_task |
| Task Listing | When user asks to see/show/list tasks, use list_tasks with appropriate filter |
| Task Completion | When user says done/complete/finished, use complete_task |
| Task Deletion | When user says delete/remove/cancel, use delete_task |
| Task Update | When user says change/update/rename, use update_task |
| Confirmation | Always confirm actions with friendly response |
| Error Handling | Gracefully handle task not found and other errors |

---

## Natural Language Commands

| User Says | Agent Should |
|-----------|--------------|
| "Add a task to buy groceries" | Call add_task with title "Buy groceries" |
| "Show me all my tasks" | Call list_tasks with status "all" |
| "What's pending?" | Call list_tasks with status "pending" |
| "Mark task 3 as complete" | Call complete_task with task_id 3 |
| "Delete the meeting task" | Call list_tasks first, then delete_task |
| "Change task 1 to 'Call mom tonight'" | Call update_task with new title |
| "I need to remember to pay bills" | Call add_task with title "Pay bills" |
| "What have I completed?" | Call list_tasks with status "completed" |

---

## Conversation Flow (Stateless Request Cycle)

1. Receive user message via POST /api/chat
2. Authenticate user via JWT token
3. Fetch conversation history from database (if conversation_id provided)
4. Build message array for agent (history + new message)
5. Store user message in database
6. Run Gemini agent with MCP tools
7. Agent invokes appropriate tool(s)
8. Store assistant response in database
9. Return response to client
10. Server holds NO state (ready for next request)

---

## Frontend Requirements

### Custom Chat UI
- Build with React (Next.js)
- Chat message list (user and assistant messages)
- Message input with send button
- New conversation button
- Conversation history sidebar
- Task action confirmations
- Show tool invocations (optional)

### Design Requirements
- Match existing Todo Dashboard aesthetic
- Glassmorphism effects consistent with Phase II
- Responsive design (desktop + mobile)
- Dark mode support
- Smooth animations for messages
- Loading states during AI processing

---

## Security Requirements

1. **Authentication**: All chat endpoints require valid JWT token
2. **User Isolation**: Conversations and messages scoped to authenticated user
3. **Input Validation**: Sanitize all user inputs before processing
4. **Rate Limiting**: Implement rate limiting for chat endpoint
5. **API Key Security**: Gemini API key stored in environment variables

---

## Acceptance Criteria

### Functional
- [ ] User can send natural language messages to manage todos
- [ ] AI correctly interprets user intent and invokes appropriate tools
- [ ] Conversations persist across page refreshes
- [ ] Chat history is maintained per conversation
- [ ] All 5 todo operations work via chat (add, list, complete, delete, update)
- [ ] Error messages are user-friendly

### Non-Functional
- [ ] Chat response time < 5 seconds (average)
- [ ] Stateless backend (no in-memory session state)
- [ ] Horizontal scaling ready
- [ ] 80%+ test coverage for chat endpoints
- [ ] OpenAPI documentation for all endpoints

---

## Deliverables

1. **Backend**
   - `/backend/mcp/` - MCP tools implementation
   - `/backend/agents/` - Gemini agent integration
   - `/backend/routes/chat.py` - Chat API endpoints
   - `/backend/models.py` - Updated with Conversation, Message models
   - Database migration scripts

2. **Frontend**
   - `/frontend/src/app/chat/` - Chat page
   - `/frontend/src/components/chat/` - Chat components
   - Integration with existing auth context

3. **Documentation**
   - README with setup instructions
   - API documentation
   - Agent behavior documentation

---

## Dependencies

- Phase II completion (web app with authentication)
- Google Gemini API access (free tier available)
- MCP SDK installation
- LangChain installation
