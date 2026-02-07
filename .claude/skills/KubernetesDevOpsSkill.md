# Kubernetes & DevOps Skill

## Purpose
Hands-on management of infrastructure, deployments, and distributed orchestration for Phase 5.

## Cluster Management (Minikube & Cloud)
1. **Pods & Deployments**: Managing the lifecycle of containerized services (Frontend, Backend, Consumers).
2. **Services & Networking**: Configuring ClusterIP, NodePort, and Ingress-NGINX for traffic routing.
3. **Scaling**: Implementing Horizontal Pod Autoscaling (HPA) and managing replica counts.

## State & Configuration
- **ConfigMaps & Secrets**: Managing application environment variables and sensitive credentials.
- **Resource Management**: Defining CPU/Memory requests and limits for stable cluster operation.

## Helm Integration
- **Helm Charts**: Customizing charts for the Todo application.
- **Values Files**: Managing environment-specific overrides (`values-local.yaml` vs `values-prod.yaml`).
- **Dependency Management**: Using Helm to install Dapr and Strimzi (Kafka) operators.

## Success Criteria
- The application can be deployed with a single `helm upgrade --install` command.
- Dapr sidecars are successfully injected and communicating.
- Cluster is resilient to pod failures (auto-restarts).
