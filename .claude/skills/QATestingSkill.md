# QA & Testing Skill

## Purpose
Ensuring high confidence and reliability for advanced, event-driven features.

## Testing Strategy
1. **Event Validation**: Verifying that completion of a task correctly publishes a `task.completed` CloudEvent with the expected payload.
2. **Recurrence Logic Testing**: Exhaustive testing of edge cases (Daily, Weekly, Monthly, leap years, timezone changes).
3. **Reminder Testing**: Ensuring reminders trigger on time and are received by the correct user via WebSockets.
4. **Scale Testing**: Performance benchmarking for concurrent user interactions and real-time broadcasts.

## Implementation (Pytest + Playwright)
- **Integration Tests**: Mocking Dapr sidecars to test event consumers in isolation.
- **E2E Tests**: Full-stack scenarios using Playwright to verify the UI reflects state changes from background events.

## Success Criteria
- 100% pass rate for P1 (MVP) scenarios.
- All edge-cases documented in `Task-005` are verified.
- Race conditions (e.g., simultaneous recurrence triggers) are handled.
