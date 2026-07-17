# Pipecat + Supermemory (Phase 2)

Voice onboarding will use a separate Python service. Ditto's TanStack app already stores all memory in Supermemory using `containerTag = userId`, matching Pipecat's `user_id` parameter.

## Reference

- [Supermemory × Pipecat integration](https://supermemory.ai/docs/integrations/pipecat)

## Mapping

| Ditto (TypeScript) | Pipecat (Python) |
|--------------------|------------------|
| `containerTag: userId` | `user_id="unique_user_id"` |
| `sessionId` | `session_id="session_123"` |
| `SupermemoryService.addUserMemory()` | Automatic via `SupermemoryPipecatService` |
| `client.profile({ containerTag, q })` | `InputParams(mode="full")` retrieval |

## Planned pipeline

```python
from supermemory_pipecat import SupermemoryPipecatService

memory = SupermemoryPipecatService(
    api_key=os.getenv("SUPERMEMORY_API_KEY"),
    user_id=user_id,  # same as Ditto session userId
    session_id=session_id,
)
```

Place `memory` between STT context aggregator and LLM in the Pipecat pipeline so voice onboarding writes to the same Supermemory container as text onboarding.
