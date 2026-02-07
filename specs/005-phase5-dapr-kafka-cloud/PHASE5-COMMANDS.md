# Phase 5 - SpecifyPlus Commands Guide

This document contains all the commands you need to execute Phase 5 using the **SpecifyPlus (SP)** workflow.

---

## 📋 Prerequisites

Before running these commands, ensure you have:
- ✅ SpecifyPlus CLI installed
- ✅ Constitution v5.0 created (already done!)
- ✅ Working directory: `e:\gemini-cli\Todo Full-Stack Web Application`

---

## 🎯 Part A - Advanced Features (3-5 Days)

### Step 1: ✅ Constitution (COMPLETED)

The constitution has been created at:
```
specs/005-phase5-dapr-kafka-cloud/constitution.md
```

---

### Step 2: Specify Advanced Features

Run the following command to create the feature specification:

```powershell
# Navigate to project root
cd "e:\gemini-cli\Todo Full-Stack Web Application"

# Run sp.specify for Advanced Features
sp specify "Advanced Features Integration - Phase 5"
```

**When prompted, provide this specification:**

```
Feature: Advanced Todo Features with Event-Driven Architecture

## Part 1: Intermediate Features

### 1.1 Priority Levels
- Add priority field to Task model (HIGH, MEDIUM, LOW enum)
- Update API endpoints to support priority filtering
- Publish task.priority.changed event when priority is updated

### 1.2 Tags
- Create Tag model with many-to-many relationship to Task
- Add tags endpoints: GET /api/tags, POST /api/tasks/{id}/tags
- Support filtering tasks by tags
- Maximum 10 tags per task
- Publish task.tags.updated event

### 1.3 Search & Filter
- Full-text search on task title, description, and tags
- Filter by: priority, completion status, tags, due date range
- Sort by: created_at, updated_at, priority, due_date
- Search endpoint: GET /api/tasks/search?q={query}&priority={}&tags={}

### 1.4 Sorting
- Support multiple sort fields
- Sort orders: asc, desc
- Default sort: created_at desc

## Part 2: Advanced Features

### 2.1 Recurring Tasks
- Add recurrence_pattern field (daily, weekly, monthly, custom cron)
- When recurring task is completed, automatically create next instance
- Publish task.recurrence.triggered event
- Recurrence service subscribes to task.completed events

### 2.2 Due Dates
- Add due_date field (ISO 8601 datetime)
- Check for overdue tasks daily
- Publish task.overdue event for overdue tasks
- Update task status to show overdue state

### 2.3 Reminders
- Add reminder_time field (datetime before due date)
- Reminder service subscribes to task.created and task.updated events
- Send reminders via Dapr Output Binding (console log for Phase 5A)
- Support multiple reminder times per task (optional)

## Part 3: Event-Driven Architecture

### 3.1 Event Schema (CloudEvents)
All events must follow CloudEvents specification:
- id: Unique event ID
- source: Service name (todo-backend)
- type: Event type (com.todo.task.created)
- datacontenttype: application/json
- time: ISO 8601 timestamp
- data: Event payload

### 3.2 Event Types
- com.todo.task.created
- com.todo.task.updated
- com.todo.task.completed
- com.todo.task.deleted
- com.todo.task.priority.changed
- com.todo.task.tags.updated
- com.todo.task.overdue
- com.todo.task.recurrence.triggered

### 3.3 Kafka Topics
- todo.task.events (all task events)
- todo.task.reminders (reminder notifications)
- todo.task.analytics (for future analytics)

## Part 4: Dapr Integration

### 4.1 Pub/Sub Component
- Use Dapr Pub/Sub building block
- NO direct Kafka SDK usage
- Publish via Dapr HTTP API or Python SDK
- Subscribe via /dapr/subscribe endpoint

### 4.2 State Store Component (Optional)
- Use Dapr State Store for caching
- Cache frequently accessed tasks
- TTL: 300 seconds

### 4.3 Secrets Component
- Store DB credentials in Dapr Secret Store
- Store Cohere API key in Dapr Secret Store
- Store Kafka credentials in Dapr Secret Store

## Success Criteria
- ✅ All intermediate features working end-to-end
- ✅ All advanced features working end-to-end
- ✅ Events published to Kafka via Dapr
- ✅ Recurring tasks auto-create on completion
- ✅ Reminders sent on schedule
- ✅ NO direct Kafka SDK usage in application code
```

**Alternative: If you want to specify in parts, run multiple specifications:**

```powershell
# Specify Intermediate Features
sp specify "Intermediate Features: Priority, Tags, Search, Filter"

# Specify Advanced Features
sp specify "Advanced Features: Recurring Tasks, Due Dates, Reminders"

# Specify Event-Driven Architecture
sp specify "Event-Driven Architecture with Dapr and Kafka"
```

---

### Step 3: Plan the Implementation

After specification is created, run the planning command:

```powershell
# Generate implementation plan
sp plan "Advanced Features Integration - Phase 5"
```

**Or if you created multiple specs:**

```powershell
sp plan "Intermediate Features: Priority, Tags, Search, Filter"
sp plan "Advanced Features: Recurring Tasks, Due Dates, Reminders"
sp plan "Event-Driven Architecture with Dapr and Kafka"
```

**The plan should generate:**
- Backend model changes (SQLModel schemas)
- API endpoint changes (FastAPI routes)
- Event publishing logic
- Dapr component configurations
- Testing strategy

---

### Step 4: Generate Tasks

Convert the plan into actionable tasks:

```powershell
# Generate tasks from plan
sp task "Advanced Features Integration - Phase 5"
```

**Or for individual plans:**

```powershell
sp task "Intermediate Features: Priority, Tags, Search, Filter"
sp task "Advanced Features: Recurring Tasks, Due Dates, Reminders"
sp task "Event-Driven Architecture with Dapr and Kafka"
```

**Expected task output examples:**
- Task 1: Add priority field to Task model (HIGH, MEDIUM, LOW enum)
- Task 2: Create Tag model with SQLModel
- Task 3: Add tags relationship to Task model (many-to-many)
- Task 4: Create priority filter endpoint
- Task 5: Create search endpoint with full-text search
- Task 6: Add due_date field to Task model
- Task 7: Add recurrence_pattern field to Task model
- Task 8: Create event publishing function for task.created
- Task 9: Create Dapr Pub/Sub component YAML
- Task 10: Install Dapr Python SDK
- ...and more

---

### Step 5: Implement Tasks

Execute the implementation:

```powershell
# Implement all tasks
sp implement "Advanced Features Integration - Phase 5"
```

**Or implement incrementally:**

```powershell
# Implement task by task
sp implement --task-id 1  # Add priority field
sp implement --task-id 2  # Create Tag model
# ... etc
```

---

## 🧪 Part B - Local Deployment on Minikube (2-3 Days)

### Step 1: Specify Minikube + Dapr + Kafka Setup

```powershell
sp specify "Minikube Deployment with Dapr and Self-Hosted Kafka"
```

**Specification content:**

```
Feature: Local Kubernetes Deployment with Dapr and Strimzi Kafka

## Infrastructure Components

### 1. Dapr Setup
- Initialize Dapr in Kubernetes cluster
- Deploy Dapr control plane
- Configure Dapr sidecar injection

### 2. Strimzi Kafka
- Deploy Strimzi operator in kafka namespace
- Create Kafka cluster (1 replica for local)
- Create Kafka topics: todo.task.events, todo.task.reminders
- Use ephemeral storage for local testing

### 3. Helm Chart Updates
- Add Dapr annotations to deployment manifests
- Create dapr-components directory in Helm chart
- Add pubsub.kafka component YAML
- Add state.postgresql component YAML
- Add secrets.kubernetes component YAML
- Update values-local.yaml for Minikube

### 4. Deployment Process
- Start Minikube with sufficient resources (4GB RAM, 2 CPUs)
- Deploy Dapr: dapr init -k
- Deploy Strimzi Kafka
- Deploy application via Helm
- Verify Dapr sidecars are running
- Verify Kafka topics are created
- Test event publishing and consumption

## Success Criteria
- ✅ Dapr running in Minikube
- ✅ Kafka cluster healthy with 1 broker
- ✅ Topics created and accessible
- ✅ Application pods have Dapr sidecar
- ✅ Events flow from backend → Kafka → consumers
```

### Step 2: Plan Minikube Deployment

```powershell
sp plan "Minikube Deployment with Dapr and Self-Hosted Kafka"
```

### Step 3: Generate Tasks

```powershell
sp task "Minikube Deployment with Dapr and Self-Hosted Kafka"
```

### Step 4: Implement

```powershell
sp implement "Minikube Deployment with Dapr and Self-Hosted Kafka"
```

---

## ☁️ Part C - Cloud Deployment (4-6 Days)

### Step 1: Specify Cloud Infrastructure

```powershell
sp specify "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"
```

**Specification content:**

```
Feature: Production Cloud Deployment

## Cloud Infrastructure

### 1. Oracle Cloud OKE Cluster
- Create OKE cluster with 2 worker nodes (Always Free tier)
- Configure kubectl access
- Install Dapr: dapr init -k
- Configure RBAC

### 2. Redpanda Cloud Kafka
- Create Redpanda Serverless cluster (free tier)
- Create topics: todo.task.events, todo.task.reminders, todo.task.analytics
- Configure SASL/SCRAM authentication
- Store credentials in Kubernetes Secrets

### 3. Managed Database (Neon)
- Continue using existing Neon PostgreSQL
- Enable connection pooling
- Update connection string in Dapr Secret Store

### 4. Helm Chart for Production
- Create values-production.yaml
- Configure resource limits and requests
- Enable HPA (Horizontal Pod Autoscaler)
- Configure Ingress with TLS
- Update Dapr components for Redpanda Cloud

### 5. CI/CD Pipeline (GitHub Actions)
- Create .github/workflows/deploy-cloud.yaml
- Build Docker images on push to main
- Push images to Docker Hub
- Deploy to OKE using Helm
- Run smoke tests

## Success Criteria
- ✅ OKE cluster running with 2+ nodes
- ✅ Redpanda Cloud connected
- ✅ Application accessible via public HTTPS URL
- ✅ CI/CD pipeline deploying on every push
- ✅ HPA scaling pods under load
```

### Step 2: Plan Cloud Deployment

```powershell
sp plan "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"
```

### Step 3: Generate Tasks

```powershell
sp task "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"
```

### Step 4: Implement

```powershell
sp implement "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"
```

---

## 🔥 Quick Command Reference

### Complete Phase 5A (Advanced Features)
```powershell
sp specify "Advanced Features Integration - Phase 5"
sp plan "Advanced Features Integration - Phase 5"
sp task "Advanced Features Integration - Phase 5"
sp implement "Advanced Features Integration - Phase 5"
```

### Complete Phase 5B (Minikube)
```powershell
sp specify "Minikube Deployment with Dapr and Self-Hosted Kafka"
sp plan "Minikube Deployment with Dapr and Self-Hosted Kafka"
sp task "Minikube Deployment with Dapr and Self-Hosted Kafka"
sp implement "Minikube Deployment with Dapr and Self-Hosted Kafka"
```

### Complete Phase 5C (Cloud)
```powershell
sp specify "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"
sp plan "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"
sp task "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"
sp implement "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"
```

---

## 📊 Progress Tracking

Create a checklist to track your progress:

### Part A Progress
- [ ] Constitution created
- [ ] Features specified
- [ ] Implementation planned
- [ ] Tasks generated
- [ ] Tasks implemented
- [ ] Local testing completed
- [ ] Events verified in local setup

### Part B Progress
- [ ] Minikube infrastructure specified
- [ ] Dapr setup planned
- [ ] Kafka setup planned
- [ ] Helm charts updated
- [ ] Deployment tested locally
- [ ] Events verified in Minikube

### Part C Progress
- [ ] Cloud infrastructure specified
- [ ] OKE cluster created
- [ ] Redpanda Cloud configured
- [ ] CI/CD pipeline created
- [ ] Production deployment successful
- [ ] Public URL accessible
- [ ] Demo video created

---

## 🎬 Final Commands (Testing & Verification)

### Test Local Deployment (Minikube)
```powershell
# Start Minikube
minikube start --memory=4096 --cpus=2

# Verify Dapr
dapr status -k

# Verify Kafka
kubectl get pods -n kafka

# Deploy application
helm install todo-app ./helm/todo-app -f ./helm/todo-app/values-local.yaml

# Test events
kubectl logs -l app=todo-backend -c daprd --tail=100
```

### Test Cloud Deployment (OKE)
```powershell
# Configure kubectl for OKE
oci ce cluster create-kubeconfig --cluster-id <cluster-ocid>

# Verify cluster
kubectl get nodes

# Deploy via Helm
helm install todo-app ./helm/todo-app -f ./helm/todo-app/values-production.yaml

# Check deployment
kubectl get all -n todo-app

# Get public URL
kubectl get ingress -n todo-app
```

### Verify Events are Flowing
```powershell
# Check Dapr logs
kubectl logs -l app=todo-backend -c daprd -f

# Create a test task and watch events
curl -X POST https://your-app-url/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Event Flow","priority":"HIGH"}'
```

---

## 💡 Tips

1. **Run commands incrementally**: Don't try to specify everything at once
2. **Validate after each step**: Test locally before moving to the next phase
3. **Use the constitution as reference**: Review `constitution.md` before each specification
4. **Save outputs**: Keep logs of `sp plan` and `sp task` outputs for reference
5. **Iterate if needed**: If implementation fails, go back to `sp plan` and adjust

---

## 🆘 Troubleshooting

### If `sp` command not found:
```powershell
# Check if SpecifyPlus CLI is installed
sp --version

# If not installed, install it (check SpecifyPlus documentation)
npm install -g specifyplus-cli
# or
pip install specifyplus
```

### If specification fails:
- Check constitution.md for guidelines
- Ensure you're in the project root directory
- Review previous specs in `specs/` directory for format examples

### If implementation fails:
- Review generated tasks
- Check logs for specific errors
- Go back to `sp plan` and refine the approach

---

**Ready to start? Run the first command:**

```powershell
cd "e:\gemini-cli\Todo Full-Stack Web Application"
sp specify "Advanced Features Integration - Phase 5"
```

Good luck with Phase 5! 🚀
