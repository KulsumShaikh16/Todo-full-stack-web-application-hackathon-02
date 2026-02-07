# Constitution v5.0 - Enterprise Cloud-Native Event-Driven Architecture

**Phase**: 5 - Advanced Enterprise Deployment
**Created**: 2026-02-04
**Status**: Active
**Scope**: Dapr + Kafka + Cloud Kubernetes Deployment

---

## 🎯 Mission Statement

Transform the Phase 4 Todo Chatbot into an **enterprise-ready, cloud-native, event-driven application** that leverages:
- **Dapr** for distributed application runtime abstraction
- **Kafka** for event-driven architecture
- **Kubernetes** on cloud platforms (OKE/AKS/GKE)
- **Spec-Driven Development** for all implementation

This phase demonstrates mastery of modern cloud-native patterns, microservices architecture, and production-ready deployment practices.

---

## 🏛️ Core Principles

### Principle 1: Spec-Driven Development ONLY
**Rule**: ❌ **NO MANUAL CODING ALLOWED**
- ✅ ALL features MUST be specified first using `/sp.specify`
- ✅ ALL implementation MUST follow `/sp.plan` → `/sp.task` → `/sp.implement`
- ✅ Every code change MUST trace back to a specification
- ❌ Direct code editing without spec is FORBIDDEN

**Rationale**: Maintains architectural integrity and ensures all stakeholders understand what is being built and why.

### Principle 2: Dapr-First Architecture
**Rule**: All infrastructure concerns MUST go through Dapr abstractions
- ✅ Pub/Sub MUST use Dapr Pub/Sub API (NOT direct Kafka SDK)
- ✅ State Management MUST use Dapr State API (NOT direct database calls where applicable)
- ✅ Service-to-Service calls MUST use Dapr Service Invocation
- ✅ Secrets MUST use Dapr Secrets API (NOT environment variables)
- ❌ Direct infrastructure SDK usage is FORBIDDEN unless no Dapr building block exists

**Rationale**: Dapr provides portability, observability, and resilience without vendor lock-in.

### Principle 3: Event-Driven Architecture
**Rule**: Application state changes MUST trigger events
- ✅ Task CRUD operations MUST publish events to Kafka
- ✅ Services MUST react to events asynchronously
- ✅ Event schemas MUST be versioned and documented
- ✅ Dead Letter Queues MUST be configured for failed events
- ❌ Synchronous coupling between services is DISCOURAGED

**Rationale**: Event-driven systems are scalable, resilient, and enable loosely coupled microservices.

### Principle 4: Cloud-Native Best Practices
**Rule**: Application MUST follow 12-Factor App methodology
- ✅ Configuration MUST come from environment (never hardcoded)
- ✅ Logs MUST go to stdout/stderr (never to files)
- ✅ Stateless processes (state in Dapr/DB, not in-memory)
- ✅ Graceful shutdown MUST be implemented
- ✅ Health checks MUST be exposed for liveness and readiness
- ❌ Local file storage is FORBIDDEN (use Dapr state or object storage)

**Rationale**: Cloud-native apps are portable across any cloud provider and scale horizontally.

### Principle 5: Security-First Mindset
**Rule**: Security MUST be built-in, not bolted-on
- ✅ Secrets MUST use Dapr Secret Store (Kubernetes Secrets, Azure Key Vault, etc.)
- ✅ API keys MUST NEVER be in code, commits, or container images
- ✅ TLS MUST be enabled for production deployments
- ✅ RBAC MUST be configured in Kubernetes
- ❌ Plaintext credentials are FORBIDDEN

**Rationale**: Security breaches can destroy reputation and violate compliance regulations.

### Principle 6: Incremental Deployment Strategy
**Rule**: Changes MUST be deployed incrementally with validation
- ✅ Part A (Features) → Local Testing → Validate
- ✅ Part B (Minikube) → Dapr + Self-Hosted Kafka → Validate
- ✅ Part C (Cloud) → Managed Services → CI/CD → Validate
- ❌ Big-bang deployments without intermediate validation are FORBIDDEN

**Rationale**: Small, validated steps reduce risk and enable fast rollback if issues occur.

---

## 📐 Architectural Rules

### AR-001: Microservices Boundaries
- Backend MUST remain a single service initially (monolith)
- Future microservices MUST communicate via Dapr Service Invocation
- Each microservice MUST have its own health endpoint
- Shared data MUST use events or API calls (NO shared databases yet)

### AR-002: Event Schema Design
- Events MUST follow CloudEvents specification
- Event types MUST be namespaced: `com.todo.task.created`, `com.todo.task.completed`
- Events MUST include: `id`, `source`, `type`, `datacontenttype`, `time`, `data`
- Breaking changes to events MUST version the event type (`v2`, `v3`)

### AR-003: Dapr Component Configuration
- Components MUST be defined in `dapr-components/` directory
- Each component MUST specify `namespace` scoping
- Components MUST use secrets from Dapr Secret Store
- Component configs MUST be environment-specific (dev, staging, prod)

### AR-004: Kafka Topic Design
- Topics MUST be named: `{domain}.{entity}.{event-type}` (e.g., `todo.task.created`)
- Topics MUST use at least 3 partitions for parallelism
- Retention MUST be configured (default 7 days)
- Compacted topics MUST be used for state snapshots

### AR-005: State Management
- Transactional data MUST use PostgreSQL via SQLModel
- Caching MUST use Dapr State Store (Redis or equivalent)
- State keys MUST be namespaced: `{service}.{entity}.{id}`

### AR-006: Observability
- Structured logging MUST be used (JSON format)
- Distributed tracing MUST be enabled via Dapr
- Metrics MUST be exposed for Prometheus scraping
- Dashboards SHOULD be created in Grafana (optional for Phase 5)

---

## 🚀 Feature Implementation Rules

### Advanced Features (Part A)

#### Intermediate Features
- **Priority Levels**: `HIGH`, `MEDIUM`, `LOW` enum
- **Tags**: Many-to-many relationship, max 10 tags per task
- **Search**: Full-text search on title, description, tags
- **Filtering**: By priority, tags, completion status, due date
- **Sorting**: By created_at, updated_at, priority, due_date

#### Advanced Features
- **Recurring Tasks**: Cron-like patterns (daily, weekly, monthly, custom)
  - On task completion, next instance MUST be auto-created
  - Recurring tasks MUST have `recurrence_pattern` field
- **Due Dates**: ISO 8601 datetime format
  - Overdue tasks MUST trigger `task.overdue` event
- **Reminders**: Time-based notifications
  - Reminder service MUST subscribe to `task.created` and `task.updated` events
  - Reminders MUST be sent via Dapr Bindings (email/SMS/webhook)

### FR-001: Event Publishing Rules
- When task is created → Publish `task.created` event
- When task is updated → Publish `task.updated` event
- When task is completed → Publish `task.completed` event
- When task becomes overdue → Publish `task.overdue` event
- When recurring task triggers → Publish `task.recurrence.triggered` event

### FR-002: Event Subscription Rules
- Reminder Service MUST subscribe to: `task.created`, `task.updated`
- Recurrence Service MUST subscribe to: `task.completed`
- Analytics Service (future) MAY subscribe to all task events

### FR-003: Dapr Pub/Sub Integration
- Backend MUST use Dapr Python SDK: `dapr` package
- Events MUST be published via `/v1.0/publish/{pubsub}/{topic}` endpoint
- Subscriptions MUST be registered via `/dapr/subscribe` endpoint
- CloudEvents schema MUST be enforced

---

## 🐳 Deployment Rules

### Part B: Local Deployment (Minikube)

#### DR-001: Dapr Setup
- Dapr MUST be initialized in Kubernetes: `dapr init -k`
- Dapr sidecar MUST be injected via annotations:
  ```yaml
  dapr.io/enabled: "true"
  dapr.io/app-id: "todo-backend"
  dapr.io/app-port: "8000"
  dapr.io/log-level: "debug"
  ```

#### DR-002: Self-Hosted Kafka (Strimzi)
- Kafka MUST be deployed via Strimzi operator
- Cluster MUST have 1 replica for local (3 for production)
- Topics MUST be created via Strimzi `KafkaTopic` CRDs
- Ephemeral storage for local, persistent for cloud

#### DR-003: Helm Chart Updates
- Chart MUST support Dapr sidecar injection
- Chart MUST deploy Dapr components
- Chart MUST create Kafka topics
- Values files: `values-local.yaml`, `values-minikube.yaml`

### Part C: Cloud Deployment

#### DR-004: Cloud Provider (OKE Recommended)
- Oracle Cloud OKE: Always Free tier (2 worker nodes)
- Alternatives: Azure AKS (\$200 credits), GCP GKE (\$300 credits)
- Cluster MUST have at least 2 worker nodes
- Node pools MUST use autoscaling (min 2, max 10)

#### DR-005: Managed Kafka (Redpanda Cloud)
- Redpanda Serverless MUST be used (free tier)
- Connection details MUST be stored in Kubernetes Secrets
- Topics MUST be created via Redpanda Cloud Console or API
- SASL/SCRAM authentication MUST be enabled

#### DR-006: Managed Database (Neon PostgreSQL)
- Continue using Neon Serverless PostgreSQL
- Connection pooling MUST be enabled
- SSL MUST be required
- Database URL MUST be in Dapr Secret Store

#### DR-007: CI/CD Pipeline (GitHub Actions)
- Workflow: `.github/workflows/deploy-cloud.yaml`
- Triggers: Push to `main` branch
- Steps: Build → Test → Push Images → Deploy Helm Chart
- Secrets: `DOCKER_USERNAME`, `DOCKER_PASSWORD`, `KUBECONFIG`, `COHERE_API_KEY`

#### DR-008: Production Hardening
- Resource limits MUST be set (CPU, memory)
- HPA (Horizontal Pod Autoscaler) MUST be configured
- Ingress MUST use TLS (Let's Encrypt or cloud provider)
- Network policies SHOULD be defined (optional)

---

## 🧪 Testing Rules

### TR-001: Local Testing
- MUST test on Minikube before cloud deployment
- MUST verify all events are published and consumed
- MUST test recurring task creation
- MUST test reminder notifications

### TR-002: Integration Testing
- MUST test end-to-end flows (create task → event → reminder)
- MUST test failure scenarios (Kafka down, DB down)
- MUST test Dapr retry policies

### TR-003: Load Testing
- SHOULD test with at least 100 concurrent users (optional)
- MUST verify HPA scales pods under load
- MUST verify Kafka consumer lag is minimal

---

## 📋 Documentation Rules

### DOC-001: Required Documentation
- `README.md` MUST include:
  - Architecture diagram (Dapr + Kafka + K8s)
  - Local setup guide (Minikube)
  - Cloud deployment guide
  - API documentation
  - Event schema reference
- `AGENTS.md` MUST document:
  - How specs were created
  - Which agents were used (Claude Code + SpecifyPlus)
  - Iteration process
- `CLAUDE.md` MUST include:
  - Prompts used for each phase
  - Key decisions made by AI
  - Challenges overcome

### DOC-002: Commenting Standards
- Dapr component YAMLs MUST have explanatory comments
- Complex event handlers MUST have docstrings
- Helm values MUST document each configuration option

---

## 🚫 Constraints & Limitations

### What is OUT OF SCOPE for Phase 5:
- ❌ Breaking into multiple microservices (backend remains monolith)
- ❌ Frontend changes (only backend and infrastructure)
- ❌ New UI features (focus on backend capabilities)
- ❌ User authentication changes (OAuth, SSO, etc.)
- ❌ Multi-tenancy
- ❌ Advanced observability stack (ELK, Jaeger) - basic only
- ❌ Cost optimization (focus on functionality first)

### What to MINIMIZE:
- Manual kubectl commands (use Helm and GitOps principles)
- Custom scripts (use out-of-the-box tools)
- Vendor-specific features (keep it portable)

---

## ✅ Success Criteria Hierarchy

### Part A Success (Advanced Features):
1. ✅ Priority, tags, search, filtering, sorting work end-to-end
2. ✅ Recurring tasks auto-create next instance on completion
3. ✅ Due dates and reminders trigger events correctly
4. ✅ All events flow through Kafka via Dapr Pub/Sub
5. ✅ NO direct Kafka SDK usage in application code

### Part B Success (Minikube):
1. ✅ Dapr initialized in Minikube cluster
2. ✅ Self-hosted Kafka running via Strimzi
3. ✅ Application deploys with Dapr sidecar
4. ✅ Events published and consumed successfully
5. ✅ Reminders sent on schedule

### Part C Success (Cloud):
1. ✅ Application running on cloud Kubernetes (OKE/AKS/GKE)
2. ✅ Redpanda Cloud Kafka integrated
3. ✅ CI/CD pipeline deploying on every push
4. ✅ HPA scaling pods under load
5. ✅ Public URL accessible with HTTPS
6. ✅ Demo video showing all features (90 seconds max)

---

## 🎯 Phase 5 Workflow

### Step 1: Constitution (THIS DOCUMENT)
Define rules, principles, and boundaries for Phase 5.

### Step 2: Specify (/sp.specify)
Create detailed specifications for:
- Advanced features (priorities, tags, recurring, reminders)
- Event schemas
- Dapr component configurations

### Step 3: Plan (/sp.plan)
Break down implementation into:
- Backend changes (models, APIs, event publishers)
- Dapr integration (Pub/Sub, State, Secrets)
- Infrastructure (Strimzi Kafka, Helm charts)
- Cloud deployment (OKE, Redpanda, GitHub Actions)

### Step 4: Tasks (/sp.task)
Generate atomic, actionable tasks for implementation.

### Step 5: Implementation (/sp.implement)
Execute tasks via Claude Code following spec-driven workflow.

---

## 📜 Version History

| Version | Date       | Changes                                                                 |
|---------|------------|-------------------------------------------------------------------------|
| 5.0     | 2026-02-04 | Initial constitution for Phase 5 (Dapr + Kafka + Cloud)                |

---

## 🔗 References

- [Dapr Documentation](https://docs.dapr.io/)
- [Apache Kafka Documentation](https://kafka.apache.org/documentation/)
- [Strimzi Kafka Operator](https://strimzi.io/)
- [Redpanda Cloud](https://redpanda.com/cloud)
- [Oracle Cloud OKE](https://www.oracle.com/cloud/compute/container-engine-kubernetes.html)
- [CloudEvents Specification](https://cloudevents.io/)
- [12-Factor App](https://12factor.net/)

---

**End of Constitution v5.0**
