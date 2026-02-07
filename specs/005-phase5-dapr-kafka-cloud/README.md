# Phase 5 - Enterprise Cloud-Native Event-Driven Todo Application

**Status**: 🚀 Ready to Start  
**Created**: 2026-02-04  
**Duration**: 10-15 days  
**Approach**: Spec-Driven Development with SpecifyPlus

---

## 🎯 Objective

Transform the Phase 4 Todo Chatbot into an **enterprise-ready, cloud-native, event-driven application** using:
- **Dapr** (Distributed Application Runtime)
- **Kafka** (Event-driven architecture via Dapr Pub/Sub)
- **Kubernetes** (Cloud deployment on OKE/AKS/GKE)
- **SpecifyPlus** (Spec-driven development workflow)

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[constitution.md](./constitution.md)** | Rules, principles, and guidelines for Phase 5 |
| **[PHASE5-COMMANDS.md](./PHASE5-COMMANDS.md)** | Detailed SpecifyPlus commands with specifications |
| **[QUICK-COMMANDS.md](./QUICK-COMMANDS.md)** | Quick reference cheat sheet |

---

## 🗺️ Phase 5 Roadmap

### Part A - Advanced Features (3-5 days)
**Objective**: Add intermediate and advanced features with event-driven architecture

**Features**:
- ✅ Intermediate: Priority levels, Tags, Search, Filter, Sorting
- ✅ Advanced: Recurring tasks, Due dates, Reminders
- ✅ Event-driven: Kafka events via Dapr Pub/Sub

**Commands**:
```powershell
sp specify "Advanced Features Integration - Phase 5"
sp plan "Advanced Features Integration - Phase 5"
sp task "Advanced Features Integration - Phase 5"
sp implement "Advanced Features Integration - Phase 5"
```

---

### Part B - Local Deployment (2-3 days)
**Objective**: Deploy on Minikube with Dapr and self-hosted Kafka

**Infrastructure**:
- Minikube (local Kubernetes cluster)
- Dapr (initialized in Kubernetes)
- Strimzi Kafka (self-hosted Kafka operator)
- Helm charts (updated for Dapr)

**Commands**:
```powershell
sp specify "Minikube Deployment with Dapr and Self-Hosted Kafka"
sp plan "Minikube Deployment with Dapr and Self-Hosted Kafka"
sp task "Minikube Deployment with Dapr and Self-Hosted Kafka"
sp implement "Minikube Deployment with Dapr and Self-Hosted Kafka"
```

**Manual Deployment**:
```powershell
minikube start --memory=4096 --cpus=2
dapr init -k
kubectl apply -f https://strimzi.io/install/latest?namespace=kafka
helm install todo-app ./helm/todo-app -f values-local.yaml
```

---

### Part C - Cloud Deployment (4-6 days)
**Objective**: Deploy to production cloud with managed services

**Infrastructure**:
- Oracle Cloud OKE (Always Free tier) - **Recommended**
- Redpanda Cloud (Serverless Kafka)
- GitHub Actions (CI/CD pipeline)
- TLS/HTTPS Ingress

**Commands**:
```powershell
sp specify "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"
sp plan "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"
sp task "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"
sp implement "Cloud Kubernetes Deployment on OKE with Redpanda Cloud"
```

---

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Dapr | Service mesh, Pub/Sub, State, Secrets |
| **Events** | Kafka (Dapr Pub/Sub) | Event-driven architecture |
| **Container Orchestration** | Kubernetes | Cloud-native deployment |
| **Local K8s** | Minikube | Local testing |
| **Cloud K8s** | Oracle OKE / Azure AKS / Google GKE | Production deployment |
| **Managed Kafka** | Redpanda Cloud | Serverless event streaming |
| **Package Manager** | Helm | Kubernetes deployment templating |
| **CI/CD** | GitHub Actions | Automated deployments |
| **Database** | Neon PostgreSQL | Serverless database (existing) |
| **AI Chat** | Cohere API | Conversational AI (existing) |

---

## 📋 Prerequisites

### ✅ Software Required
- [x] Docker Desktop
- [x] Minikube
- [x] kubectl
- [x] Helm
- [x] Dapr CLI
- [x] SpecifyPlus CLI
- [x] Cloud CLI (OCI / Azure / gcloud)

### ✅ Accounts Required
- [x] Oracle Cloud (Always Free)
- [x] Redpanda Cloud (Free tier)
- [x] GitHub (for CI/CD)
- [x] Docker Hub (for container registry)
- [x] Neon (already have)
- [x] Cohere (already have)

### ✅ Installation Commands

```powershell
# Install Dapr CLI
powershell -Command "iwr -useb https://raw.githubusercontent.com/dapr/cli/master/install/install.ps1 | iex"

# Verify Dapr
dapr --version

# Install kubectl (if not installed)
choco install kubernetes-cli

# Install Helm (if not installed)
choco install kubernetes-helm

# Install Minikube (if not installed)
choco install minikube

# Install SpecifyPlus CLI (check official docs)
npm install -g specifyplus-cli
# OR
pip install specifyplus
```

---

## 🚀 Getting Started

### Step 1: Review Constitution
Read the Phase 5 constitution to understand the rules and principles:
```powershell
code specs/005-phase5-dapr-kafka-cloud/constitution.md
```

### Step 2: Start with Part A (Advanced Features)
```powershell
cd "e:\gemini-cli\Todo Full-Stack Web Application"
sp specify "Advanced Features Integration - Phase 5"
```

Follow the detailed instructions in [PHASE5-COMMANDS.md](./PHASE5-COMMANDS.md)

### Step 3: Progress to Part B (Minikube)
After Part A is complete and tested locally, proceed to Minikube deployment.

### Step 4: Deploy to Cloud (Part C)
Finally, deploy to production cloud infrastructure.

---

## 📊 Success Criteria

### Part A Success
- [x] Priority, tags, search, filtering, sorting implemented
- [x] Recurring tasks auto-create on completion
- [x] Due dates and reminders working
- [x] Events published to Kafka via Dapr
- [x] NO direct Kafka SDK in application code

### Part B Success
- [x] Dapr running in Minikube
- [x] Strimzi Kafka deployed and healthy
- [x] Application pods have Dapr sidecar
- [x] Events flowing through Kafka
- [x] Reminders triggering correctly

### Part C Success
- [x] Application running on cloud Kubernetes
- [x] Redpanda Cloud integrated
- [x] CI/CD pipeline deploying on push
- [x] HPA scaling pods under load
- [x] Public HTTPS URL accessible
- [x] Demo video created (90 seconds)

---

## 🎓 Learning Outcomes

By completing Phase 5, you will master:
- ✅ Event-driven architecture patterns
- ✅ Dapr distributed application runtime
- ✅ Kafka event streaming
- ✅ Cloud-native Kubernetes deployment
- ✅ Helm chart templating for production
- ✅ CI/CD with GitHub Actions
- ✅ Horizontal Pod Autoscaling
- ✅ Production-grade security (secrets, TLS)
- ✅ Spec-driven development methodology

---

## 📦 Deliverables

### Code
- [ ] Advanced features implemented (priority, tags, recurring, reminders)
- [ ] Event publishing via Dapr Pub/Sub
- [ ] Dapr component configurations
- [ ] Updated Helm charts
- [ ] CI/CD pipeline (GitHub Actions)

### Documentation
- [ ] Updated README.md with Phase 5 architecture
- [ ] AGENTS.md (how specs were created)
- [ ] CLAUDE.md (AI interaction log)
- [ ] API documentation (event schemas)
- [ ] Deployment guides (Minikube + Cloud)

### Demo
- [ ] 90-second demo video showing:
  - Advanced features in action
  - Event-driven workflow
  - Cloud deployment
  - Scaling demonstration

---

## 🆘 Support

### If you get stuck:
1. **Review Constitution**: Check `constitution.md` for guidelines
2. **Check Commands Guide**: See `PHASE5-COMMANDS.md` for detailed steps
3. **Review Previous Phases**: Look at `specs/003-phase4-kubernetes/` for reference
4. **Dapr Docs**: https://docs.dapr.io/
5. **Kafka Docs**: https://kafka.apache.org/documentation/
6. **Strimzi Docs**: https://strimzi.io/

---

## 🎯 Current Status

**Phase 5 Setup**: ✅ Complete  
**Constitution**: ✅ Created  
**Command Guides**: ✅ Created  

**Next Action**: Run the first SpecifyPlus command:
```powershell
sp specify "Advanced Features Integration - Phase 5"
```

---

## 📝 Notes

- **NO MANUAL CODING**: Everything must go through the spec-driven workflow
- **Incremental Progress**: Validate after each part before moving forward
- **Use Free Tiers**: Oracle OKE Always Free + Redpanda Free tier
- **Document Everything**: Keep AGENTS.md and CLAUDE.md updated

---

**Ready to start? Let's go! 🚀**

```powershell
cd "e:\gemini-cli\Todo Full-Stack Web Application"
sp specify "Advanced Features Integration - Phase 5"
```
