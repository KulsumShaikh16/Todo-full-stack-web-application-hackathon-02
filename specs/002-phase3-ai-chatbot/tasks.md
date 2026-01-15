# Phase III: Todo AI Chatbot - Tasks

## Overview

**Phase**: III - AI Chatbot  
**Spec Reference**: `/specs/002-phase3-ai-chatbot/spec.md`  
**Plan Reference**: `/specs/002-phase3-ai-chatbot/plan.md`  
**Version**: 1.0.0  
**Created**: 2026-01-14  

---

## Task Categories

- 🗄️ **DB**: Database/Model tasks
- 🔧 **MCP**: MCP Tools tasks
- 🤖 **AI**: AI/Agent tasks
- 🌐 **API**: Backend API tasks
- 🎨 **UI**: Frontend tasks
- 🧪 **TEST**: Testing tasks
- 📚 **DOC**: Documentation tasks

---

## Phase 3.1: Database Models & Migrations

### TASK-3.1.1: Create Conversation Model 🗄️
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: None

**Description**: Add Conversation SQLModel to models.py
- Add `id`, `user_id`, `title`, `created_at`, `updated_at` fields
- Add foreign key to User
- Add relationship to Messages

**Acceptance Criteria**:
- [ ] Conversation model defined in models.py
- [ ] Foreign key to users table works
- [ ] Model can be imported without errors

---

### TASK-3.1.2: Create Message Model 🗄️
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.1.1

**Description**: Add Message SQLModel to models.py
- Add `id`, `user_id`, `conversation_id`, `role`, `content`, `tool_calls`, `created_at` fields
- Add foreign keys to User and Conversation
- Role should be enum: 'user' | 'assistant'

**Acceptance Criteria**:
- [ ] Message model defined in models.py
- [ ] Foreign keys work correctly
- [ ] tool_calls field stores JSON

---

### TASK-3.1.3: Create Pydantic Schema Models 🗄️
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.1.2

**Description**: Create request/response schemas for chat API
- ChatRequest: message, conversation_id (optional)
- ChatResponse: conversation_id, response, tool_calls
- ConversationResponse: id, title, created_at, messages
- MessageResponse: id, role, content, created_at

**Acceptance Criteria**:
- [ ] All schema models defined
- [ ] Proper validation on required fields
- [ ] JSON serialization works

---

### TASK-3.1.4: Update Database Initialization 🗄️
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.1.3

**Description**: Update db.py to create new tables
- Add Conversation and Message to table creation
- Ensure proper migration/creation order

**Acceptance Criteria**:
- [ ] New tables created on startup
- [ ] No errors in development
- [ ] Works with existing tables

---

## Phase 3.2: MCP Tools Implementation

### TASK-3.2.1: Create MCP Directory Structure 🔧
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.1.4

**Description**: Create `/backend/mcp/` directory with files
- `__init__.py`
- `tools.py`
- `registry.py`

**Acceptance Criteria**:
- [ ] Directory structure created
- [ ] Files can be imported

---

### TASK-3.2.2: Implement add_task Tool 🔧
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.2.1

**Description**: Create add_task MCP tool function
- Parameters: user_id, title, description (optional)
- Returns: task_id, status, title
- Creates task in database

**Acceptance Criteria**:
- [ ] Tool creates task in database
- [ ] Returns correct response format
- [ ] Handles errors gracefully

---

### TASK-3.2.3: Implement list_tasks Tool 🔧
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.2.1

**Description**: Create list_tasks MCP tool function
- Parameters: user_id, status (optional: all/pending/completed)
- Returns: Array of task objects
- Queries database with filters

**Acceptance Criteria**:
- [ ] Tool lists tasks from database
- [ ] Filters work correctly
- [ ] Returns correct format

---

### TASK-3.2.4: Implement complete_task Tool 🔧
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.2.1

**Description**: Create complete_task MCP tool function
- Parameters: user_id, task_id
- Returns: task_id, status, title
- Updates task completed=True

**Acceptance Criteria**:
- [ ] Tool marks task as complete
- [ ] Returns correct response
- [ ] Handles task not found

---

### TASK-3.2.5: Implement delete_task Tool 🔧
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.2.1

**Description**: Create delete_task MCP tool function
- Parameters: user_id, task_id
- Returns: task_id, status, title
- Deletes task from database

**Acceptance Criteria**:
- [ ] Tool deletes task
- [ ] Returns correct response
- [ ] Handles task not found

---

### TASK-3.2.6: Implement update_task Tool 🔧
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.2.1

**Description**: Create update_task MCP tool function
- Parameters: user_id, task_id, title (optional), description (optional)
- Returns: task_id, status, title
- Updates task in database

**Acceptance Criteria**:
- [ ] Tool updates task
- [ ] Returns correct response
- [ ] Handles task not found

---

### TASK-3.2.7: Create Tool Registry 🔧
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.2.2 through TASK-3.2.6

**Description**: Create registry.py with all tools
- Export list of all tools for agent
- Add tool descriptions for LLM

**Acceptance Criteria**:
- [ ] Registry exports all tools
- [ ] Tools have proper descriptions
- [ ] Can be imported by agent

---

## Phase 3.3: Gemini Agent Integration

### TASK-3.3.1: Install Gemini Dependencies 🤖
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.2.7

**Description**: Add new dependencies to requirements.txt
- google-generativeai
- langchain
- langchain-google-genai

**Acceptance Criteria**:
- [ ] Dependencies added to requirements.txt
- [ ] pip install works without errors

---

### TASK-3.3.2: Create Gemini Client 🤖
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.3.1

**Description**: Create `/backend/agents/gemini_client.py`
- Configure Gemini API client
- Load API key from environment
- Create reusable client instance

**Acceptance Criteria**:
- [ ] Client initializes correctly
- [ ] API key loaded from env
- [ ] Error handling for missing key

---

### TASK-3.3.3: Create Todo Agent 🤖
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.3.2

**Description**: Create `/backend/agents/todo_agent.py`
- Create agent with MCP tools
- Configure system prompt for task management
- Implement run_agent function

**Acceptance Criteria**:
- [ ] Agent uses MCP tools
- [ ] System prompt guides behavior
- [ ] Returns structured response

---

### TASK-3.3.4: Implement Conversation Context 🤖
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.3.3

**Description**: Add conversation history handling
- Load previous messages from database
- Format for Gemini context
- Limit context window size

**Acceptance Criteria**:
- [ ] History loaded correctly
- [ ] Context formatted properly
- [ ] Token limits respected

---

## Phase 3.4: Chat API Endpoints

### TASK-3.4.1: Create Chat Router 🌐
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.3.4

**Description**: Create `/backend/routes/chat.py`
- Create APIRouter for chat endpoints
- Add to main.py router registration

**Acceptance Criteria**:
- [ ] Router created
- [ ] Registered in main.py
- [ ] No import errors

---

### TASK-3.4.2: Implement POST /api/chat 🌐
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.4.1

**Description**: Create main chat endpoint
- Accept message and optional conversation_id
- Run agent and return response
- Store messages in database

**Acceptance Criteria**:
- [ ] Creates new conversation if needed
- [ ] Runs agent with tools
- [ ] Returns response with tool_calls
- [ ] Messages stored in database

---

### TASK-3.4.3: Implement GET /api/conversations 🌐
**Status**: [ ] Pending  
**Priority**: Medium  
**Depends On**: TASK-3.4.1

**Description**: List user's conversations
- Return list of conversations for authenticated user
- Include basic info (id, title, created_at)

**Acceptance Criteria**:
- [ ] Returns user's conversations
- [ ] Sorted by most recent
- [ ] Proper pagination (optional)

---

### TASK-3.4.4: Implement GET /api/conversations/{id} 🌐
**Status**: [ ] Pending  
**Priority**: Medium  
**Depends On**: TASK-3.4.1

**Description**: Get conversation with messages
- Return conversation details and all messages
- Verify user owns conversation

**Acceptance Criteria**:
- [ ] Returns conversation with messages
- [ ] 404 if not found
- [ ] 403 if not owner

---

### TASK-3.4.5: Implement DELETE /api/conversations/{id} 🌐
**Status**: [ ] Pending  
**Priority**: Low  
**Depends On**: TASK-3.4.1

**Description**: Delete a conversation
- Delete conversation and all messages
- Verify user owns conversation

**Acceptance Criteria**:
- [ ] Deletes conversation
- [ ] Cascades to messages
- [ ] Returns success response

---

## Phase 3.5: Frontend Chat UI

### TASK-3.5.1: Create Chat API Client 🎨
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.4.2

**Description**: Create `/frontend/src/lib/chat-api.ts`
- sendMessage(message, conversationId?)
- getConversations()
- getConversation(id)
- deleteConversation(id)

**Acceptance Criteria**:
- [ ] All API methods work
- [ ] Proper error handling
- [ ] Auth token included

---

### TASK-3.5.2: Create ChatMessage Component 🎨
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: None

**Description**: Create `/frontend/src/components/chat/ChatMessage.tsx`
- Display user/assistant messages
- Different styling for each role
- Show tool calls (optional)

**Acceptance Criteria**:
- [ ] Messages display correctly
- [ ] Role styling works
- [ ] Animations smooth

---

### TASK-3.5.3: Create ChatInput Component 🎨
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: None

**Description**: Create `/frontend/src/components/chat/ChatInput.tsx`
- Text input with send button
- Disable while sending
- Enter key to send

**Acceptance Criteria**:
- [ ] Input works correctly
- [ ] Send button functional
- [ ] Loading state shows

---

### TASK-3.5.4: Create ChatContainer Component 🎨
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.5.2, TASK-3.5.3

**Description**: Create `/frontend/src/components/chat/ChatContainer.tsx`
- Message list with scroll
- Input at bottom
- Auto-scroll to new messages

**Acceptance Criteria**:
- [ ] Messages scroll properly
- [ ] New messages visible
- [ ] Layout responsive

---

### TASK-3.5.5: Create ConversationSidebar Component 🎨
**Status**: [ ] Pending  
**Priority**: Medium  
**Depends On**: TASK-3.5.1

**Description**: Create `/frontend/src/components/chat/ConversationSidebar.tsx`
- List of conversations
- New conversation button
- Delete conversation option

**Acceptance Criteria**:
- [ ] Conversations listed
- [ ] Can create new
- [ ] Can switch between

---

### TASK-3.5.6: Create Chat Page 🎨
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.5.4, TASK-3.5.5

**Description**: Create `/frontend/src/app/chat/page.tsx`
- Full chat interface
- Sidebar + main area
- Auth protected

**Acceptance Criteria**:
- [ ] Page renders correctly
- [ ] Auth working
- [ ] Full functionality

---

### TASK-3.5.7: Style Chat Components 🎨
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: TASK-3.5.6

**Description**: Apply glassmorphism styling
- Match dashboard theme
- Responsive design
- Animations

**Acceptance Criteria**:
- [ ] Matches existing UI
- [ ] Mobile-friendly
- [ ] Smooth animations

---

## Phase 3.6: Integration & Polish

### TASK-3.6.1: Add Chat Navigation 🎨
**Status**: [ ] Pending  
**Priority**: Medium  
**Depends On**: TASK-3.5.6

**Description**: Add chat link to dashboard header
- Link to /chat page
- Chat icon button

**Acceptance Criteria**:
- [ ] Navigation works
- [ ] Icon displays

---

### TASK-3.6.2: Write Unit Tests 🧪
**Status**: [ ] Pending  
**Priority**: High  
**Depends On**: All implementation tasks

**Description**: Write tests for all components
- MCP tools tests
- Agent tests
- API endpoint tests

**Acceptance Criteria**:
- [ ] 80%+ coverage
- [ ] All tests pass

---

### TASK-3.6.3: Update Documentation 📚
**Status**: [ ] Pending  
**Priority**: Medium  
**Depends On**: All tasks

**Description**: Update README and docs
- Setup instructions
- API documentation
- Usage examples

**Acceptance Criteria**:
- [ ] README updated
- [ ] Clear instructions

---

## Summary

| Category | Total Tasks | High Priority |
|----------|-------------|---------------|
| Database 🗄️ | 4 | 4 |
| MCP 🔧 | 7 | 7 |
| AI 🤖 | 4 | 4 |
| API 🌐 | 5 | 2 |
| UI 🎨 | 8 | 6 |
| Testing 🧪 | 1 | 1 |
| Docs 📚 | 1 | 0 |
| **Total** | **30** | **24** |
