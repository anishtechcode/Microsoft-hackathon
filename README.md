# RecallDesk

**Customer support that remembers what worked.** RecallDesk is a support workspace built around outcome-aware customer memory. A support agent recalls scoped Hindsight memories before drafting a response, avoids failed approaches, and retains a confirmed new outcome for a future interaction.

## Run locally

1. Copy `.env.example` to `.env.local` and add `HINDSIGHT_API_KEY` and `HINDSIGHT_BANK_ID`.
2. Install the Vercel CLI (`npm i -g vercel`) if needed.
3. Run `npm run dev`.

Without these values the interface stays usable as a **clearly labelled demo preview**. It never claims the preview was retrieved from Hindsight; live recall and retain return a configuration error until the server values are supplied.

## Memory lifecycle

`Ticket → POST /api/hindsight (recall) → agent draft with recalled context → resolution → POST /api/hindsight (retain) → future recall`

Memory is scoped with `customerId` metadata. Keys exist only in serverless functions, never in the browser bundle.

## Demo path

Open Aarav Mehta’s ticket, select **Recall memory**, draft a response, add the Wi-Fi context, and select **Resolve & retain**. With Hindsight configured, the new Wi-Fi outcome is stored in the selected bank and becomes retrievable on a future ticket.

## Deployment

Import this repository into Vercel, add the three `HINDSIGHT_*` variables in Project Settings, deploy, and verify `/api/hindsight` reports `configured: true`. No deployment was attempted here because no Vercel account/project credentials were supplied.

## Limits

The API endpoint shape is isolated in `api/hindsight.js`. Confirm it against the Hindsight account/API version before production deployment, as bank routes can evolve. The agent uses a safe deterministic draft when no LLM is configured; it still uses the recalled memory supplied by the server.
