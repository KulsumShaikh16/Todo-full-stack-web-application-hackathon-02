# Feature Specification: Phase 5 - Advanced Cloud Deployment (Digital Ocean)

**Feature Branch**: `phase5-digital-ocean`
**Created**: 2026-02-04
**Status**: In Progress
**Input**: Advanced Cloud Deployment requirements for Digital Ocean with Dapr and Kafka.

---

## 1. Executive Summary
This specification outlines the deployment of the Todo Full-Stack Web Application to **Digital Ocean Kubernetes (DOKS)** using **Dapr** for distributed runtime capabilities and **Kafka** (via Strimzi or Redpanda Cloud) for event-driven communication. The goal is to move from a local Minikube environment to a production-grade cloud environment.

---

## 2. User Scenarios & Testing

### US-5.1: Cloud Infrastructure Provisioning (Priority: P1)
**As a** DevOps Engineer,  
**I want to** provision a Digital Ocean Kubernetes (DOKS) cluster and configure `kubectl` access,  
**So that** I have a target environment for deployment.

**Acceptance Scenarios**:
1. **Given** I have a Digital Ocean account, **When** I run provisioning scripts, **Then** a DOKS cluster is created.
2. **Given** a running DOKS cluster, **When** I run `doctl kubernetes cluster kubeconfig save`, **Then** `kubectl` can communicate with the cluster.

### US-5.2: Dapr Deployment in Cloud (Priority: P1)
**As a** System Architect,  
**I want to** initialize Dapr on the DOKS cluster with full building blocks enabled,  
**So that** the application can use Pub/Sub, State, and Jobs APIs.

**Acceptance Scenarios**:
1. **Given** a DOKS cluster, **When** I run `dapr init -k`, **Then** the Dapr control plane is healthy in the cluster.
2. **Given** Dapr is initialized, **When** I deploy Dapr components, **Then** they show as healthy in `dapr status -k`.

### US-5.3: Event-Driven Reminders via Dapr Jobs API (Priority: P1)
**As a** User,  
**I want to** receive notifications at the exact time a task is due,  
**So that** I don't miss my deadlines.

**Acceptance Scenarios**:
1. **Given** a task with a reminder time, **When** the task is created/updated, **Then** a Dapr Job is scheduled.
2. **Given** a reached reminder time, **When** Dapr triggers the job callback, **Then** a notification event is published to Kafka.

### US-5.4: CI/CD Pipeline (Priority: P1)
**As a** Developer,  
**I want to** automatically build and deploy my application on every push to the `main` branch,  
**So that** the deployment process is reliable and automated.

**Acceptance Scenarios**:
1. **Given** a code change, **When** I push to GitHub, **Then** a GitHub Action builds Docker images and pushes them to Digital Ocean Container Registry (DOCR).
2. **When** the build is complete, **Then** the action updates the Helm release in DOKS.

---

## 3. Requirements

### 3.1 Digital Ocean Infrastructure
- **DOKS Cluster**: 2+ worker nodes (s-2vcpu-4gb recommended for Kafka/Dapr).
- **DOCR**: Digital Ocean Container Registry for storing images.
- **Load Balancer**: DO Load Balancer for Ingress (NGINX).

### 3.2 Kafka Configuration
- **Option A (Self-Hosted)**: Deploy Strimzi Kafka Operator in the `kafka` namespace.
- **Option B (Managed)**: Connect to Redpanda Cloud Serverless.
- **Topics**: `todo.task.events`, `todo.task.reminders`, `todo.task.updates`.

### 3.3 Dapr Components
- **Pub/Sub**: `pubsub.kafka` connecting to the cloud Kafka.
- **State Store**: `state.postgresql` using the Neon DB or DO Managed Postgres.
- **Jobs API**: Use the new Dapr Jobs API for exact-time reminders.
- **Secrets**: `secretstores.kubernetes` for managing API keys and DB strings.

### 3.4 Application Updates
- **Backend**: Implement the Jobs API callback endpoint `/api/jobs/trigger`.
- **Backend**: Implement `schedule_reminder` logic using Dapr Jobs API.
- **Backend**: Implement "Activity Log" consumer (optional for visualization).

### 3.5 Monitoring & Logging
- **Dapr Dashboard**: Accessible via `dapr dashboard -k`.
- **Logging**: Configure structured logging for production auditing.

---

## 4. Success Criteria
- ✅ DOKS cluster running with 2+ nodes.
- ✅ Dapr healthy in the cluster (status: Running).
- ✅ Kafka topics created and accessible via Dapr Pub/Sub.
- ✅ Application deployed via Helm to DOKS.
- ✅ Ingress accessible via Public IP/Domain.
- ✅ Reminders triggered at exact times via Dapr Jobs API.
- ✅ GitHub Actions successfully deploying on push.

---

## 5. Technical Constraints
- No manual coding: All changes must be based on tasks generated from this spec.
- Digital Ocean is the primary cloud provider.
- Dapr version 1.12+ recommended for Jobs API features.

---
**End of Specification**
