# CI/CD Skill

## Purpose
Automating the "code-to-cloud" pipeline using GitHub Actions for reliability and speed.

## Pipeline Stages
1. **Lint & Test**: Automatic verification of code quality and unit test passes on every PR.
2. **Docker Build & Push**: Building optimized multi-stage images and pushing them to a registry (GHCR/DockerHub).
3. **Helm Validation**: Linting and dry-running Helm charts.
4. **Deploy**: Triggering `helm upgrade` on the target Kubernetes cluster (AKS/GKE/DOKS).

## GitHub Actions Best Practices
- **Secret Management**: Using GitHub Repository Secrets for `KUBECONFIG` and Dapr credentials.
- **Workflow Triggers**: Branch-based deployments (e.g., `main` to prod, `develop` to staging).
- **Audit Logs**: Ensuring clear logs for failed deployments to facilitate rapid rollbacks.

## Success Criteria
- Deployment happens automatically within <10 minutes of a merge to `main`.
- Rollbacks can be performed via standard Helm commands.
- Pipeline provides clear failure notifications.
