# Cloud-Native Thinking Skill

## Purpose
Adopting a mindset for building distributed, resilient, and observable services.

## Core Mindset
1. **Stateless over Stateful**: Services must not rely on local file systems or in-memory state; delegate to Dapr State Store or PostgreSQL.
2. **Externalized Configuration**: Use environment variables, ConfigMaps, and Dapr Secrets for all settings.
3. **Observability**: Implement structured JSON logging and distributed tracing (Zipkin) to make the system transparent.
4. **Security by Default**: Enforce non-root execution and "Least Privilege" network policies (via Kubernetes/Dapr).

## Cloud-Native Patterns
- **Health Probes**: Liveness and Readiness probes that accurately reflect service health.
- **Graceful Shutdown**: Handling `SIGTERM` to allow background tasks (like event publishing) to finish before pod termination.
- **Circuit Breaking**: Using Dapr resiliency to prevent cascading failures.

## Success Criteria
- Services are "Portable" between any Cloud Provider (Azure, GCP, OOCI).
- Zero "Configuration Sprawl": All settings are centralized and versioned.
- Detailed traces are available for every inter-service call.
