<!--
SYNC IMPACT REPORT
==================
Version Change: [INITIAL] → 1.0.0
Modified Principles: N/A (initial creation)
Added Sections:
  - Core Principles (6 principles)
  - Phase-Based Technology Matrix
  - Development Workflow
  - Testing Discipline
  - Security & Compliance
  - Quality Gates
Removed Sections: N/A
Templates Requiring Updates:
  ✅ .specify/templates/plan-template.md (Constitution Check alignment)
  ✅ .specify/templates/spec-template.md (Scope alignment)
  ✅ .specify/templates/tasks-template.md (Task categorization)
  ⚠ .claude/agents/* (Review agent descriptions for Phase alignment)
Follow-up TODOs: None
-->

# Evolution of Todo Constitution

## Core Principles

### I. Spec-Driven Development (NON-NEGOTIABLE)
All features MUST follow the strict workflow: Constitution → Specification → Plan → Tasks → Implementation.

**Rules**:
- No code generation without approved specification
- No implementation without approved tasks
- All decisions must be documented (spec/plan/tasks)
- Amendments to specs require explicit user approval
- Skipping steps is prohibited

**Rationale**:
Ensures alignment, prevents scope creep, maintains traceability, and reduces rework.

### II. Phase Isolation (NON-NEGOTIABLE)
Each phase has strict technology boundaries. Features MUST NOT introduce technologies from future phases.

**Rules**:
- Phase I: In-memory console application only
- Phase II: Full-stack web application (Python REST API, Neon PostgreSQL, Next.js)
- Phase III+: Advanced cloud infrastructure, agents, AI, orchestration
- Cross-phase technology leakage is prohibited

**Rationale**:
Incremental delivery, technical debt control, milestone-focused development, and progressive complexity.

### III. Test-First (NON-NEGOTIABLE)
TDD is mandatory for all production code. Tests MUST exist before implementation.

**Rules**:
- Write tests → Get approval → Watch tests fail → Implement → Watch tests pass → Refactor
- Red-Green-Refactor cycle strictly enforced
- Minimum 80% code coverage required
- Integration tests for all API contracts
- End-to-end tests for critical user flows

**Rationale**:
Prevents regressions, documents behavior, enables refactoring, and ensures quality.

### IV. Security by Design
Security requirements MUST be addressed at every phase, not as an afterthought.

**Rules**:
- All user data MUST be isolated (user-scoped queries)
- Authentication required for all protected resources
- Secrets MUST be stored in environment variables (never hardcoded)
- Input validation on all public APIs
- SQL injection prevention (parameterized queries only)
- JWT token verification on all authenticated requests

**Rationale**:
Protects user data, prevents unauthorized access, maintains trust, and ensures compliance.

### V. Technology Matrix Compliance
All implementations MUST adhere to the phase-specific technology stack.

**Rules**:
- Phase I (Console App): Python, in-memory storage, CLI interface
- Phase II (Web App):
  - Backend: Python REST API (FastAPI)
  - Database: Neon Serverless PostgreSQL
  - ORM/Data Layer: SQLModel or equivalent
  - Frontend: Next.js (React, TypeScript)
  - Authentication: Better Auth (signup/signin only)
  - Architecture: Full-stack web application
- Phase III+ (Advanced): Cloud infrastructure, agents, AI, orchestration

**Prohibitions**:
- No web technologies in Phase I
- No AI/agent frameworks until Phase III+
- No advanced cloud services until Phase III+
- No real-time features in Phase II

**Rationale**:
Clear boundaries prevent scope creep, enable focused delivery, and maintain architectural coherence.

### VI. API-First Design
All interfaces MUST be designed and documented before implementation.

**Rules**:
- API specifications MUST exist before backend implementation
- Frontend MUST communicate via REST APIs only
- No direct database access from frontend
- All APIs MUST have JSON request/response format
- Error responses MUST follow consistent format
- OpenAPI documentation for all endpoints

**Rationale**:
Enables parallel development, clear contracts, testable interfaces, and maintainable code.

## Phase-Based Development Strategy

### Phase I: Console Application (Completed)
**Scope**: Basic todo management in CLI
**Technology**:
- Python
- In-memory storage (no persistence)
- Command-line interface
- 5 Basic Level features (add, list, edit, delete, toggle complete)
**Constraints**:
- No database
- No web interface
- No authentication
- No external APIs

### Phase II: Full-Stack Web Application (Current)
**Scope**: Web-based todo application with persistence and authentication
**Technology**:
- Backend: Python REST API (FastAPI)
- Database: Neon Serverless PostgreSQL
- ORM/Data Layer: SQLModel
- Frontend: Next.js (React, TypeScript)
- Authentication: Better Auth (email/password signup/signin)
- Architecture: Full-stack web application
**Features**:
- 5 Basic Level features as web application
- User signup/signin via Better Auth
- User-specific todo isolation
- RESTful API endpoints
- Responsive UI (desktop + mobile)
- Data persistence in Neon PostgreSQL
**Constraints**:
- No AI or agents
- No background jobs
- No real-time features
- No advanced analytics
- No future phase features

### Phase III: AI Chatbot (Current)
**Scope**: Natural language todo management via AI chatbot
**Technology**:
- Backend: Python FastAPI (continues from Phase II)
- Database: Neon Serverless PostgreSQL (continues from Phase II)
- ORM/Data Layer: SQLModel (continues from Phase II)
- Frontend: Next.js with custom React Chat UI
- Authentication: Better Auth with JWT (continues from Phase II)
- AI Framework: Google Gemini API
- Agent Orchestration: LangChain with Gemini
- Tool Protocol: MCP (Model Context Protocol)
**Features**:
- Natural language task management
- MCP tools for todo CRUD operations
- Conversation persistence in database
- Stateless chat endpoint architecture
- Chat history and context management
**Constraints**:
- No voice input/output
- No multi-language support
- No task scheduling/reminders
- No collaborative todos
- No real-time notifications
- No future phase features

### Phase IV+: Advanced Features (Future)
**Scope**: Enhanced capabilities with advanced infrastructure
**Technology**:
- Advanced cloud infrastructure
- Multi-modal AI capabilities
- Real-time features
- Advanced analytics
**Constraints**:
- Defined in Phase IV specification
- Not to be introduced earlier

## Development Workflow

### Spec-Driven Development Lifecycle

1. **Constitution Review**: Verify feature aligns with current phase and principles
2. **Specification Creation**: Define WHAT (user stories, requirements, acceptance criteria)
3. **Technical Planning**: Define HOW (architecture, data models, API contracts)
4. **Task Breakdown**: Create testable, actionable tasks
5. **Implementation**: Execute tasks following test-first approach
6. **Verification**: Validate against spec acceptance criteria

### Approval Gates

- **Spec Gate**: User must approve specification before planning
- **Plan Gate**: Plan must pass constitution check before tasks
- **Implementation Gate**: Tasks must be approved before coding

## Testing Discipline

### Unit Tests
- Test individual functions and methods
- Mock external dependencies
- Cover edge cases and error paths
- Minimum 80% coverage required

### Integration Tests
- Test API endpoints with test database
- Verify request/response contracts
- Test authentication flows
- Validate database operations

### End-to-End Tests
- Test critical user journeys
- Verify frontend-backend integration
- Test authentication state management
- Validate responsive behavior

## Security & Compliance

### Data Isolation
- All queries MUST filter by user_id
- No cross-user data access
- Test data isolation in all layers

### Authentication
- JWT token verification on all protected endpoints
- Token refresh mechanism
- Session management via Better Auth

### Credential Management
- All secrets in environment variables (.env files)
- Never commit secrets to version control
- Validate environment on application startup

## Quality Gates

### Pre-Commit Requirements
- All tests passing
- No linting errors
- No TypeScript errors
- All acceptance criteria met
- Documentation updated

### Pre-Merge Requirements
- Code review approved
- All tests passing
- Security scan clean
- Performance benchmarks met
- No breaking changes without version bump

## Governance

### Constitution Authority
This constitution is the authoritative source for all technical decisions. It supersedes:
- Individual preferences
- External framework defaults
- Convenience-driven shortcuts

### Amendment Process
1. Proposal: Document proposed changes with rationale
2. Review: Assess impact on existing phases and features
3. Approval: Requires explicit user confirmation
4. Propagation: Update all dependent artifacts (templates, agents, docs)
5. Versioning: Increment version (MAJOR/MINOR/PATCH) per change severity

### Compliance Requirements
- All PRs MUST reference applicable principles
- Complexity beyond phase boundaries MUST be justified
- New technologies MUST have constitution amendment
- Violations MUST be blocked at review gate

### Version Policy
- **MAJOR** (X.0.0): Backward-incompatible governance changes, principle removals/redefinitions
- **MINOR** (0.X.0): New principle or section added, material guidance expansion
- **PATCH** (0.0.X): Clarifications, wording fixes, non-semantic refinements

**Version**: 2.0.0 | **Ratified**: 2025-01-02 | **Last Amended**: 2026-01-14 (Phase III added)

