# Agentic & Spec Driven Development (SDD) Skill

## Purpose
Mastering the modern "Rare Skill" of multi-agent collaboration following a strict SDD lifecycle.

## The SDD Lifecycle
**Constitution → Specify → Plan → Tasks → Implement**

1. **Specs Over Coding**: Never implement unless a `spec.md` is approved.
2. **Atomic Tasks**: Break plans into small, testable tasks that an agent can execute with high accuracy.
3. **PHRs (Prompt History Records)**: Automatically document every major interaction to maintain a clear trail of decision-making.

## Multi-Agent Collaboration
- **Hand-offs**: Recognizing when a task belongs to a specialized agent (e.g., Architect → Backend Engineer → QA).
- **Consensus**: Ensuring all agents agree on the `plan.md` before execution.
- **Verification**: Using the QA agent to validate the work of the Implementation agent.

## Core Rules
- No manual code hacks.
- Smallest viable diffs.
- Reference existing code precisely.

## Success Criteria
- 100% adherence to the SDD workflow scripts.
- Zero architectural leakage (e.g., UI knowing about DB).
- High-fidelity documentation (ADRs, PHRs, Specs) for every feature.
