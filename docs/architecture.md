# Architecture

```mermaid
flowchart LR
  UI[RecallDesk browser UI] -->|customerId + query| Recall[/api/hindsight]
  Recall -->|server-only key| H[Hindsight bank]
  H -->|scoped memories| UI
  UI -->|message + recalled memories| Agent[/api/agent]
  Agent --> Draft[Memory-informed draft]
  UI -->|confirmed outcome| Retain[/api/hindsight retain]
  Retain --> H
```

## Components

- `public/`: responsive, dependency-free SaaS UI and interaction controller.
- `api/hindsight.js`: serverless boundary for Hindsight retain/recall. It requires `HINDSIGHT_API_KEY` and `HINDSIGHT_BANK_ID`, attaches customer metadata, validates inputs, and logs only operational events.
- `api/agent.js`: validates the ticket context and creates a concise response using the recalled memory context. A production LLM adapter can replace the deterministic draft while preserving the same input/output contract.

## Security and isolation

The browser cannot access Hindsight credentials. Recall and retain require a customer ID; every call includes `customerId` in metadata. Production auth should derive this ID from authorized ticket access rather than trusting a client-provided value. Errors are returned as generic API errors and secrets are not logged.

## Deployment

The app is Vercel-ready: static assets are served from `public/` and server functions from `api/`. Set environment variables in Vercel, then test the full retain/recall cycle against a non-production Hindsight bank.
