# Phase III: Todo AI Chatbot - Implementation Plan

## Overview

**Phase**: III - AI Chatbot  
**Spec Reference**: `/specs/002-phase3-ai-chatbot/spec.md`  
**Version**: 1.1.0  
**Created**: 2026-01-14  
**Updated**: 2026-01-14 - Changed from OpenAI to Google Gemini

---

## Constitution Check

| Principle | Compliance | Notes |
|-----------|------------|-------|
| Spec-Driven Development | ✅ | Following Constitution → Spec → Plan → Tasks → Implementation |
| Phase Isolation | ✅ | Phase III allows AI/agent frameworks |
| Test-First | ✅ | Tests will be written before implementation |
| Security by Design | ✅ | JWT auth, user isolation maintained |
| Technology Matrix | ✅ | Using approved Phase III technologies |
| API-First Design | ✅ | API contracts defined before implementation |

---

## Environment Variables Required

### Backend (`backend/.env`)

```env
# Existing Phase II variables (keep these)
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key
CORS_ORIGINS=http://localhost:3000

# NEW: Phase III - Google Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-flash
```

### How to Get Gemini API Key

1. Go to https://aistudio.google.com/app/apikey
2. Click "Create API Key" (or use existing one)
3. Copy the key and add to your `backend/.env` file

**Note**: Gemini has a generous free tier, so you can get started without any cost!

---

## Implementation Phases

### Phase 3.1: Database Models & Migrations
**Duration**: ~30 minutes  
**Dependencies**: None

1. Create Conversation model in models.py
2. Create Message model in models.py
3. Add foreign key relationships
4. Update database initialization in db.py
5. Write unit tests for models

### Phase 3.2: MCP Tools Implementation
**Duration**: ~1 hour  
**Dependencies**: Phase 3.1

1. Create `/backend/mcp/` directory structure
2. Implement add_task tool
3. Implement list_tasks tool
4. Implement complete_task tool
5. Implement delete_task tool
6. Implement update_task tool
7. Create tool registry
8. Write unit tests for each tool

### Phase 3.3: Gemini Agent Integration
**Duration**: ~1 hour  
**Dependencies**: Phase 3.2

1. Install dependencies (`pip install google-generativeai langchain-google-genai`)
2. Create `/backend/agents/` directory
3. Configure Gemini client
4. Create agent with tool bindings
5. Implement conversation context handling
6. Write integration tests

### Phase 3.4: Chat API Endpoints
**Duration**: ~45 minutes  
**Dependencies**: Phase 3.3

1. Create chat router (`routes/chat.py`)
2. Implement POST /api/chat endpoint
3. Implement GET /api/conversations endpoint
4. Implement GET /api/conversations/{id} endpoint
5. Implement DELETE /api/conversations/{id} endpoint
6. Add authentication middleware
7. Write API integration tests

### Phase 3.5: Frontend Chat UI
**Duration**: ~2 hours  
**Dependencies**: Phase 3.4

1. Create chat page (`/app/chat/page.tsx`)
2. Create ChatContainer component
3. Create ChatMessage component
4. Create ChatInput component
5. Create ConversationSidebar component
6. Add chat API client
7. Integrate with auth context
8. Style with glassmorphism theme
9. Add responsive design
10. Write component tests

### Phase 3.6: Integration & Polish
**Duration**: ~1 hour  
**Dependencies**: Phase 3.5

1. End-to-end testing
2. Error handling improvements
3. Loading states and animations
4. Navigation integration (add chat link to dashboard)
5. Documentation updates

---

## Directory Structure

```
backend/
├── mcp/
│   ├── __init__.py
│   ├── tools.py              # All MCP tool definitions
│   └── registry.py           # Tool registry for agent
├── agents/
│   ├── __init__.py
│   ├── gemini_client.py      # Gemini API client setup
│   └── todo_agent.py         # Todo management agent with tools
├── routes/
│   ├── auth.py               # Existing
│   ├── tasks.py              # Existing
│   └── chat.py               # NEW: Chat endpoints
├── models.py                 # Updated with Conversation, Message
├── requirements.txt          # Updated with new dependencies
└── .env                      # Add GEMINI_API_KEY

frontend/
├── src/
│   ├── app/
│   │   ├── chat/
│   │   │   └── page.tsx      # Chat page
│   │   └── ...
│   ├── components/
│   │   └── chat/
│   │       ├── ChatContainer.tsx
│   │       ├── ChatMessage.tsx
│   │       ├── ChatInput.tsx
│   │       └── ConversationSidebar.tsx
│   └── lib/
│       └── chat-api.ts       # Chat API client
└── package.json
```

---

## New Dependencies

### Backend (requirements.txt additions)
```
google-generativeai>=0.3.0
langchain>=0.1.0
langchain-google-genai>=0.0.6
mcp>=0.9.0
```

### Frontend (package.json - no new dependencies needed)
The chat UI will be built with existing React/Next.js components.

---

## Technical Decisions

### TD-1: Gemini over OpenAI
**Decision**: Use Google Gemini API  
**Rationale**: 
- User already has Gemini API access
- Generous free tier available
- Excellent function calling capabilities
- Good performance for conversational AI

### TD-2: LangChain for Agent Orchestration
**Decision**: Use LangChain with Gemini  
**Rationale**:
- Mature tool-calling framework
- Easy integration with Gemini
- Handles conversation context
- Extensible architecture

### TD-3: MCP Tools as Python Functions
**Decision**: Implement MCP tools as decorated Python functions  
**Rationale**:
- Clean, testable code
- Easy integration with LangChain
- Follows standard patterns
- Simple to extend

### TD-4: Stateless Architecture
**Decision**: No in-memory session state  
**Rationale**:
- Horizontal scaling ready
- Server restarts don't lose state
- Any server instance can handle any request
- Database is single source of truth

### TD-5: Custom Chat UI
**Decision**: Build custom React chat components  
**Rationale**:
- Full control over design
- Matches existing glassmorphism theme
- No external dependencies
- Integrates with existing auth

---

## Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Gemini API rate limits | High | Low | Free tier is generous, implement retry logic |
| Slow response times | Medium | Medium | Use streaming, show loading states |
| Incorrect tool invocation | Medium | Low | Comprehensive prompt engineering, logging |
| Database connection issues | High | Low | Connection pooling, retry logic |

---

## Testing Strategy

### Unit Tests
- MCP tool functions
- Database model operations
- Gemini client configuration
- Message parsing

### Integration Tests
- Chat API endpoints
- Tool execution flow
- Conversation persistence
- Authentication integration

### End-to-End Tests
- Complete chat flow
- Task management via chat
- Conversation history
- Error scenarios

---

## Deployment Considerations

### Backend (Railway)
- Add GEMINI_API_KEY to environment variables
- Add GEMINI_MODEL=gemini-1.5-flash
- Update requirements.txt with new dependencies
- Redeploy after changes

### Frontend (Vercel)
- No new environment variables needed
- Auto-deploys from GitHub

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Chat response time | < 5 seconds average |
| Tool invocation accuracy | > 95% |
| Test coverage | > 80% |
| User task completion rate | > 90% |
| Error rate | < 5% |

---

## Timeline Estimate

| Phase | Duration | Cumulative |
|-------|----------|------------|
| 3.1 Database Models | 30 min | 30 min |
| 3.2 MCP Tools | 1 hour | 1.5 hours |
| 3.3 Gemini Agent | 1 hour | 2.5 hours |
| 3.4 Chat API | 45 min | 3.25 hours |
| 3.5 Frontend UI | 2 hours | 5.25 hours |
| 3.6 Integration | 1 hour | 6.25 hours |

**Total Estimated Time**: ~6-7 hours

---

## Next Steps

1. ✅ Review and approve this plan
2. Create detailed tasks from this plan
3. Add GEMINI_API_KEY to backend/.env
4. Begin implementation with Phase 3.1
