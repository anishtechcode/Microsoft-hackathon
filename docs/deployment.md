# Production deployment

## Prerequisites

- A Vercel account authenticated in the CLI, or a `VERCEL_TOKEN`.
- A Hindsight bank and its server-side API key.

## Vercel dashboard (fastest)

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project**, import that repository, and leave the framework preset as **Other**.
3. Add `HINDSIGHT_API_KEY`, `HINDSIGHT_BANK_ID`, and optionally `HINDSIGHT_BASE_URL` in Environment Variables. Do not add an `OPENAI_API_KEY` unless the agent endpoint is upgraded to use it.
4. Deploy.
5. Open `<deployment-url>/api/hindsight`. It must return `{ "configured": true }`.
6. In the product, click **Seed live demo bank**, then **Recall memory**. Confirm the memory cards show `LIVE` before presenting.

## CLI

```powershell
npx vercel@latest login
npx vercel@latest --prod
```

Add the Hindsight variables in the Vercel dashboard before step 2, or using `vercel env add`. Do not pass secrets on the command line or commit `.env.local`.

## Production acceptance

- Homepage opens and the API reports configured.
- Seed stores historical Aarav outcomes in the selected Hindsight bank.
- Recall returns Hindsight results scoped to Aarav.
- Agent uses the recalled memory to avoid failed reinstall/cache steps.
- Resolving retains a Wi-Fi-specific outcome; a future recall retrieves it.
