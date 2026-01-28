<!--
SYNC IMPACT REPORT
==================
Version Change: 2.1.0 → 2.2.0
Modified Principles:
  - II. Phase Isolation (Updated with detailed Phase IV rules and constraints)
  - V. Technology Matrix Compliance (Updated with detailed Phase IV technologies)
Added Sections:
  - Phase IV: Local Kubernetes Deployment (Detailed requirements and constraints)
Removed Sections: None
Templates Requiring Updates:
  ✅ .specify/templates/plan-template.md (Updated Phase IV scope)
  ✅ .specify/templates/spec-template.md (Aligned with Phase IV infrastructure)
  ✅ .specify/templates/tasks-template.md (Updated for K8s/Docker tasks)
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
- Phase III: AI Chatbot (Natural Language Processing, MCP, Gemini)
- Phase IV: Local Kubernetes Deployment (Docker, Kubernetes, Helm, Docker AI, kubectl-ai, Kagent)
- Phase V+: Advanced cloud/enterprise features (Future)
- Cross-phase technology leakage is prohibited
- Frontend and backend MUST be containerized in Phase IV
- Containers MUST be deployed via Kubernetes manifests or Helm charts in Phase IV
- Helm charts are required for application deployment in Phase IV
- kubectl-ai and/or Kagent may be used to generate or assist with Kubernetes resources in Phase IV
- Docker AI (Gordon) may be used for Dockerfile generation and container operations in Phase IV
- No new application features, UI changes, or backend/frontend logic changes in Phase IV
- No cloud Kubernetes (EKS, GKE, AKS), CI/CD pipelines, or production-grade infrastructure in Phase IV
- No paid cloud services or modification of Phase III functionality in Phase IV

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
- **Infrastructure**: All manifests MUST pass linting/validation before deployment

**Rationale**:
Prevents regressions, documents behavior, enables refactoring, and ensures quality.

### IV. Security by Design
Security requirements MUST be addressed at every phase, not as an afterthought.

**Rules**:
- All user data MUST be isolated (user-scoped queries)
- Authentication required for all protected resources
- Secrets MUST be stored in environment variables or K8s Secrets (never hardcoded)
- Input validation on all public APIs
- SQL injection prevention (parameterized queries only)
- JWT token verification on all authenticated requests
- **Container Security**: Non-root users required for all Docker images

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
- Phase III (AI Chatbot):
  - AI Framework: Google Gemini API
  - Agent Orchestration: LangChain/Custom
  - Tool Protocol: MCP (Model Context Protocol)
- Phase IV (Infrastructure):
  - Containerization: Docker (Docker Desktop)
  - Docker AI: Docker AI Agent (Gordon) for AI-assisted Docker operations
  - Orchestration: Kubernetes (Minikube – local cluster only)
  - Package Management: Helm Charts
  - Kubernetes AI Ops:
    - kubectl-ai (AI-assisted kubectl operations)
    - Kagent (cluster analysis, optimization, diagnostics)
  - Application: Phase III Todo Chatbot (Frontend + Backend already implemented)
  - Deployment Scope: Local development only (Minikube), No cloud Kubernetes providers

**Prohibitions**:
- No web technologies in Phase I
- No AI/agent frameworks until Phase III
- No orchestration/containerization until Phase IV
- No real-time features until Phase V+

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

### Phase II: Full-Stack Web Application (Completed)
**Scope**: Web-based todo application with persistence and authentication
**Technology**:
- Backend: Python REST API (FastAPI)
- Database: Neon Serverless PostgreSQL
- ORM/Data Layer: SQLModel
- Frontend: Next.js (React, TypeScript)

### Phase III: AI Chatbot (Completed)
**Scope**: Natural language todo management via AI chatbot
**Technology**:
- AI Framework: Google Gemini API
- Tool Protocol: MCP (Model Context Protocol)
- Frontend: Custom React Chat UI

### Phase IV: Local Kubernetes Deployment (Cloud-Native Todo Chatbot) (Current)
**Scope**: Containerization, Orchestration, and Local Kubernetes Deployment for Todo Chatbot
**Technology**:
- **Containerization**: Docker (Docker Desktop)
- **Docker AI**: Docker AI Agent (Gordon) for AI-assisted Docker operations
- **Orchestration**: Kubernetes (Minikube – local cluster only)
- **Package Management**: Helm Charts
- **Kubernetes AI Ops**:
  - kubectl-ai (AI-assisted kubectl operations)
  - Kagent (cluster analysis, optimization, diagnostics)
- **Application**: Phase III Todo Chatbot (Frontend + Backend already implemented)
- **Deployment Scope**: Local development only (Minikube), No cloud Kubernetes providers
**Features**:
- Containerized frontend and backend components
- Kubernetes manifests or Helm charts for deployment
- Helm charts required for application deployment
- kubectl-ai and/or Kagent may be used to generate or assist with Kubernetes resources
- Docker AI (Gordon) may be used for Dockerfile generation and container operations

**Constraints**:
- No new application features
- No UI changes
- No backend or frontend logic changes
- No cloud Kubernetes (EKS, GKE, AKS)
- No CI/CD pipelines
- No production-grade infrastructure
- No paid cloud services
- No modification of Phase III functionality

### Phase V+: Advanced Features (Future)
**Scope**: Enhanced capabilities with advanced infrastructure
**Technology**:
- Multi-region cloud deployment
- Multi-modal AI (voice/image)
- Real-time collaboration
- Advanced analytics dashboard

## Governance

### Constitution Authority
This constitution is the authoritative source for all technical decisions. It supersedes individual preferences and framework defaults.

### Amendment Process
1. Proposal: Document proposed changes with rationale
2. Review: Assess impact on existing phases and features
3. Approval: Requires explicit user confirmation
4. Propagation: Update all dependent artifacts (templates, agents, docs)

### Version Policy
- **MAJOR**: Backward-incompatible governance changes
- **MINOR**: New principle or phase scope added
- **PATCH**: Clarifications, wording fixes

**Version**: 2.2.0 | **Ratified**: 2025-01-02 | **Last Amended**: 2026-01-27
