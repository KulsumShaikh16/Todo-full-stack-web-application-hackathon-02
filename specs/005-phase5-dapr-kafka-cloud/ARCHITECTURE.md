# Phase 5 - Architecture & Workflow Diagrams

## 🏗️ Architecture Evolution

### Phase 4 Architecture (Current)
```
┌─────────────────────────────────────────────────────────┐
│                    Minikube Cluster                      │
│                                                          │
│  ┌──────────────┐         ┌──────────────┐             │
│  │   Frontend   │────────▶│   Backend    │             │
│  │  (Next.js)   │         │  (FastAPI)   │             │
│  │  Port: 3000  │         │  Port: 8000  │             │
│  └──────────────┘         └──────┬───────┘             │
│                                   │                      │
│                                   ▼                      │
│                          ┌─────────────────┐            │
│                          │  Neon PostgreSQL│            │
│                          │  (External)     │            │
│                          └─────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

---

### Phase 5 Architecture (Target)
```
┌────────────────────────────────────────────────────────────────────────┐
│                        Cloud Kubernetes (OKE)                           │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                         Ingress (HTTPS/TLS)                      │  │
│  └────────────────────────┬────────────────────────────────────────┘  │
│                           │                                            │
│         ┌─────────────────┴─────────────────┐                         │
│         ▼                                   ▼                          │
│  ┌─────────────┐                    ┌────────────────┐                │
│  │  Frontend   │                    │    Backend     │                │
│  │  (Next.js)  │                    │   (FastAPI)    │                │
│  │             │                    │  ┌──────────┐  │                │
│  │  Port: 3000 │                    │  │   App    │  │                │
│  └─────────────┘                    │  └────┬─────┘  │                │
│                                     │       │        │                │
│                                     │  ┌────▼─────┐  │                │
│                                     │  │   Dapr   │  │                │
│                                     │  │  Sidecar │  │                │
│                                     │  └──┬───┬───┘  │                │
│                                     └─────┼───┼──────┘                │
│                                           │   │                        │
│         ┌─────────────────────────────────┘   │                        │
│         │                                     │                        │
│         ▼                                     ▼                        │
│  ┌─────────────────┐                 ┌──────────────┐                 │
│  │  Dapr Pub/Sub   │                 │  Dapr State  │                 │
│  │   Component     │                 │   Component  │                 │
│  └────────┬────────┘                 └──────┬───────┘                 │
│           │                                  │                         │
└───────────┼──────────────────────────────────┼─────────────────────────┘
            │                                  │
            ▼                                  ▼
   ┌─────────────────┐              ┌──────────────────┐
   │ Redpanda Cloud  │              │ Neon PostgreSQL  │
   │ (Managed Kafka) │              │  (Serverless)    │
   │                 │              │                  │
   │  Topics:        │              └──────────────────┘
   │  - task.events  │
   │  - reminders    │
   │  - analytics    │
   └─────────────────┘
```

---

## 🔄 Event-Driven Flow

### Task Creation Event Flow
```
User Request
    │
    ▼
┌──────────────────┐
│  Frontend        │
│  (Next.js)       │
└────────┬─────────┘
         │ POST /api/tasks
         ▼
┌──────────────────────────────────┐
│  Backend (FastAPI)               │
│                                  │
│  1. Validate request             │
│  2. Save to database            │
│  3. Publish event via Dapr      │
│     ┌─────────────────────────┐ │
│     │ Event: task.created     │ │
│     │ {                       │ │
│     │   id: "123",            │ │
│     │   title: "...",         │ │
│     │   priority: "HIGH",     │ │
│     │   due_date: "..."       │ │
│     │ }                       │ │
│     └─────────────────────────┘ │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────┐
│  Dapr Sidecar        │
│  (Pub/Sub API)       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────────┐
│  Kafka (Redpanda Cloud)      │
│                              │
│  Topic: todo.task.events     │
│  Message: task.created       │
└────────┬─────────────────────┘
         │
         ├─────────────┬──────────────┬────────────────┐
         ▼             ▼              ▼                ▼
┌────────────┐  ┌─────────────┐  ┌──────────┐  ┌────────────┐
│ Reminder   │  │ Recurrence  │  │Analytics │  │  Future    │
│ Service    │  │ Service     │  │ Service  │  │  Services  │
│            │  │             │  │(Future)  │  │            │
│ Creates    │  │ Checks if   │  └──────────┘  └────────────┘
│ scheduled  │  │ recurring   │
│ reminder   │  │ pattern     │
└────────────┘  └─────────────┘
```

---

## 🔁 SpecifyPlus Workflow

```
┌─────────────────────────────────────────────────────────┐
│                 Phase 5 Workflow                        │
└─────────────────────────────────────────────────────────┘

Step 1: CONSTITUTION (Manual Creation)
┌────────────────────────────────────────┐
│  constitution.md                       │
│  - Define principles                   │
│  - Set architectural rules             │
│  - Establish constraints               │
└──────────────────┬─────────────────────┘
                   │
                   ▼
Step 2: SPECIFY (sp specify)
┌────────────────────────────────────────┐
│  spec.md                               │
│  - User stories                        │
│  - Acceptance criteria                 │
│  - Requirements                        │
│  - Success criteria                    │
└──────────────────┬─────────────────────┘
                   │
                   ▼
Step 3: PLAN (sp plan)
┌────────────────────────────────────────┐
│  plan.md                               │
│  - Architecture decisions              │
│  - Component breakdown                 │
│  - Implementation approach             │
│  - Dependencies                        │
└──────────────────┬─────────────────────┘
                   │
                   ▼
Step 4: TASKS (sp task)
┌────────────────────────────────────────┐
│  tasks.md                              │
│  - Task 1: Add priority enum           │
│  - Task 2: Create Tag model            │
│  - Task 3: Add event publisher         │
│  - Task 4: Configure Dapr Pub/Sub      │
│  - ...                                 │
└──────────────────┬─────────────────────┘
                   │
                   ▼
Step 5: IMPLEMENT (sp implement)
┌────────────────────────────────────────┐
│  implementation.md                     │
│  - Execute each task                   │
│  - Generate code                       │
│  - Run tests                           │
│  - Document changes                    │
└──────────────────┬─────────────────────┘
                   │
                   ▼
Step 6: VALIDATE
┌────────────────────────────────────────┐
│  - Run local tests                     │
│  - Verify events                       │
│  - Check deployments                   │
│  - Update documentation                │
└────────────────────────────────────────┘
```

---

## 📊 Phase 5 Timeline

```
Week 1: Part A - Advanced Features
────────────────────────────────────
Day 1-2:  Specify + Plan (Intermediate features)
Day 3-4:  Implement (Priority, Tags, Search, Filter)
Day 5:    Testing & Validation

Week 2: Part A - Event-Driven + Part B - Minikube
───────────────────────────────────────────────────
Day 6-7:  Specify + Plan (Advanced features + Events)
Day 8-9:  Implement (Recurring, Reminders, Dapr Pub/Sub)
Day 10:   Minikube Deployment Testing

Week 3: Part C - Cloud Deployment
───────────────────────────────────
Day 11:   Setup OKE cluster + Redpanda Cloud
Day 12:   Configure Helm for production
Day 13:   Create CI/CD pipeline
Day 14:   Deploy to cloud
Day 15:   Testing, Demo, Documentation
```

---

## 🎯 Dapr Components Architecture

```
┌──────────────────────────────────────────────────────────┐
│              Dapr Components in Kubernetes                │
└──────────────────────────────────────────────────────────┘

Component 1: Pub/Sub (Kafka)
┌────────────────────────────────────────┐
│ apiVersion: dapr.io/v1alpha1           │
│ kind: Component                        │
│ metadata:                              │
│   name: pubsub-kafka                   │
│ spec:                                  │
│   type: pubsub.kafka                   │
│   metadata:                            │
│   - name: brokers                      │
│     value: "redpanda-cloud:9092"       │
│   - name: authType                     │
│     value: "password"                  │
└────────────────────────────────────────┘

Component 2: State Store (PostgreSQL)
┌────────────────────────────────────────┐
│ apiVersion: dapr.io/v1alpha1           │
│ kind: Component                        │
│ metadata:                              │
│   name: statestore-postgres            │
│ spec:                                  │
│   type: state.postgresql               │
│   metadata:                            │
│   - name: connectionString             │
│     secretKeyRef:                      │
│       name: postgres-secret            │
│       key: connection-string           │
└────────────────────────────────────────┘

Component 3: Secret Store (Kubernetes)
┌────────────────────────────────────────┐
│ apiVersion: dapr.io/v1alpha1           │
│ kind: Component                        │
│ metadata:                              │
│   name: secretstore-kubernetes         │
│ spec:                                  │
│   type: secretstores.kubernetes        │
└────────────────────────────────────────┘
```

---

## 🚀 Deployment Progression

```
Local Development
─────────────────
┌────────────────┐
│  Docker         │ ──▶ Build images
│  Compose        │     Test locally
└────────────────┘

         │
         ▼

Minikube (Part B)
──────────────────
┌────────────────┐
│  Minikube      │ ──▶ Local K8s cluster
│  + Dapr        │     Self-hosted Kafka
│  + Strimzi     │     Validate events
└────────────────┘

         │
         ▼

Cloud Production (Part C)
──────────────────────────
┌────────────────┐
│  OKE/AKS/GKE   │ ──▶ Managed K8s
│  + Dapr        │     Redpanda Cloud
│  + Redpanda    │     CI/CD
│  + CI/CD       │     HTTPS/TLS
└────────────────┘
```

---

## 📈 Scalability Model

```
Low Load                 Medium Load              High Load
────────                 ───────────              ─────────
Backend: 1 replica       Backend: 3 replicas      Backend: 5+ replicas
  │                        │   │   │                │ │ │ │ │
  ▼                        ▼   ▼   ▼                ▼ ▼ ▼ ▼ ▼
Kafka: 1 partition       Kafka: 3 partitions      Kafka: 5+ partitions

HPA triggers at 70% CPU usage
Min replicas: 2
Max replicas: 10
```

---

## 🔐 Security Layers

```
┌─────────────────────────────────────────────────────┐
│  Layer 1: Network Security                          │
│  - Ingress TLS/HTTPS                                │
│  - Network Policies (optional)                      │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│  Layer 2: Kubernetes RBAC                           │
│  - Service Accounts                                 │
│  - Role-based access control                        │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│  Layer 3: Dapr Secret Management                    │
│  - Kubernetes Secrets                               │
│  - Azure Key Vault (optional)                       │
│  - No secrets in code/images                        │
└─────────────────┬───────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────┐
│  Layer 4: Application Security                      │
│  - Input validation                                 │
│  - SQL injection prevention (SQLModel)              │
│  - CORS configuration                               │
└─────────────────────────────────────────────────────┘
```

---

## 🎬 Demo Flow (90 seconds)

```
0:00 - 0:15  │  Show architecture diagram
             │  Explain Dapr + Kafka + K8s
             
0:15 - 0:30  │  Create task with priority and tags
             │  Show recurring task configuration
             
0:30 - 0:45  │  Demonstrate search and filtering
             │  Show task completion triggers next recurrence
             
0:45 - 0:60  │  Show Dapr logs with event flow
             │  Kafka topic with messages
             
0:60 - 0:75  │  Scale deployment (kubectl scale)
             │  Show HPA in action
             
0:75 - 0:90  │  Show public cloud URL
             │  GitHub Actions CI/CD pipeline
```

---

**Visual Reference Complete! Use these diagrams in your documentation and demo. 📊**
