# Dapr Components for Todo Application - Phase V

This directory contains Dapr component configurations for the Todo application.

## Components

### 1. `pubsub-console.yaml` - In-Memory Pub/Sub (Local Development)

**Type**: `pubsub.in-memory`  
**Purpose**: Local development and testing without Kafka  
**Usage**: Events are published to Dapr and logged to console

```yaml
apiVersion: dapr.io/v1alpha1
kind: Component
metadata:
  name: pubsub-console
spec:
  type: pubsub.in-memory
```

**When to use**: Part A (Advanced Features) - local development

---

### 2. `pubsub-kafka.yaml` - Kafka Pub/Sub (Part B onward)

**Type**: `pubsub.kafka`  
**Purpose**: Event streaming via Kafka  
**Usage**: Events are published to Kafka topics

This component will be created in Part B for Minikube deployment.

---

## Running with Dapr

### Local Development (Part A)

```bash
cd backend

# Run backend with Dapr sidecar
dapr run \
  --app-id todo-backend \
  --app-port 8000 \
  --dapr-http-port 3500 \
  --components-path ./dapr-components \
  -- python run_server.py
```

**Explanation**:
- `--app-id todo-backend`: Application identifier for Dapr
- `--app-port 8000`: Port where FastAPI backend runs
- `--dapr-http-port 3500`: Port where Dapr HTTP API is exposed
- `--components-path ./dapr-components`: Path to Dapr components
- `-- python run_server.py`: Command to run the backend

### Without Dapr (Development without Events)

```bash
cd backend
python run_server.py
```

Events will not be published, but the application will function normally.

---

## Component Lifecycle

| Phase | Component | Purpose |
|-------|-----------|---------|
| **Part A** | `pubsub-console.yaml` | Local testing, events logged to console |
| **Part B** | `pubsub-kafka.yaml` | Minikube deployment with self-hosted Kafka (Strimzi) |
| **Part C** | `pubsub-kafka.yaml` | Cloud deployment with Redpanda Cloud |

---

## Event Topics

| Topic | Events |
|-------|--------|
| `todo.task.events` | All task lifecycle events (created, updated, completed, deleted) |
| `todo.task.reminders` | Reminder notifications (future) |
| `todo.task.analytics` | Analytics events (future) |

---

## Event Types (CloudEvents)

All events follow CloudEvents 1.0 specification:

| Event Type | Trigger | Purpose |
|------------|---------|---------|
| `com.todo.task.created` | Task created | Notify downstream services of new task |
| `com.todo.task.updated` | Task updated | Sync changes across services |
| `com.todo.task.completed` | Task marked complete | Trigger recurrence logic, analytics |
| `com.todo.task.deleted` | Task deleted | Cleanup related data |
| `com.todo.task.priority.changed` | Priority modified | Re-prioritization workflows |
| `com.todo.task.tags.updated` | Tags added/removed | Tag-based automation |
| `com.todo.task.overdue` | Task past due date | Reminder/notification systems |
| `com.todo.task.recurrence.triggered` | Recurring task creates next instance | Track recurrence chains |

---

## Verifying Events

### View Dapr Logs

```bash
# In a separate terminal, check Dapr sidecar logs
dapr logs --app-id todo-backend
```

### Test Event Publishing

```bash
# Create a task via API
curl -X POST http://localhost:8000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "Test Event", "priority": "HIGH"}'

# Check Dapr logs for published event
```

---

## Troubleshooting

### Events Not Publishing

**Symptom**: No events in Dapr logs  
**Solution**:
1. Verify Dapr sidecar is running: `dapr list`
2. Check Dapr port: `curl http://localhost:3500/v1.0/healthz`
3. Check backend logs for connection errors

### Dapr Sidecar Not Starting

**Symptom**: Error starting Dapr  
**Solution**:
1. Initialize Dapr: `dapr init`
2. Verify Docker is running: `docker ps`
3. Check Dapr version: `dapr --version`

### Component Not Found

**Symptom**: `pubsub-console` component not found  
**Solution**:
1. Verify `--components-path` points to this directory
2. Check YAML syntax is valid
3. Ensure component name matches in code (`pubsub-console`)

---

## Next Steps

- **Part A**: Use `pubsub-console.yaml` for local development
- **Part B**: Create `pubsub-kafka.yaml` for Minikube with Strimzi
- **Part C**: Update `pubsub-kafka.yaml` with Redpanda Cloud credentials

---

**Documentation**: https://docs.dapr.io/reference/components-reference/supported-pubsub/  
**CloudEvents Spec**: https://cloudevents.io/
