# MahaSafar

MahaSafar is a React + TypeScript travel guide for Maharashtra, deployed as a GitHub Pages site.

## Run locally

```bash
npm install
npm run dev
```

The app works fully without any backend. The **Chat with AI** button in the navbar uses a built-in local fallback that answers questions about destinations, itineraries, hidden spots, best times to visit, and more — no API key required.

## Enable real AI replies (optional)

To get actual AI-powered responses, connect a Supabase project with a deployed Edge Function.

### 1. Create a Supabase project

Sign up at [supabase.com](https://supabase.com/dashboard), create a new project, and copy its **Project URL** and **anon public key** from **Settings → API**.

### 2. Add environment variables

Create `.env.local` in the project root (never commit this file):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Restart `npm run dev` after adding these.

### 3. Install the Supabase CLI and link the project

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### 4. Set the AI API key as a Supabase secret

The key is stored **only in Supabase** — never in frontend code or in the repository.

```bash
supabase secrets set AI_API_KEY=YOUR_PROVIDER_KEY
```

The Edge Function defaults to **OpenRouter** with the free `meta-llama/llama-3.3-70b-instruct:free` model.
To use a different provider or model, set additional secrets before deploying:

```bash
supabase secrets set AI_API_URL=https://your-provider.com/v1/chat/completions
supabase secrets set AI_MODEL=your-model-name
```

### 5. Deploy the Edge Function

```bash
supabase functions deploy chat
```

### 6. Add GitHub Actions secrets (for production builds)

In your GitHub repository go to **Settings → Secrets and variables → Actions** and add:

| Secret name            | Value                              |
|------------------------|------------------------------------|
| `VITE_SUPABASE_URL`    | Your Supabase project URL          |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon public key    |

The workflow in [`.github/workflows/main.yml`](.github/workflows/main.yml) already passes these to the Vite build.

> **Important:** Do **not** add `AI_API_KEY` to GitHub secrets or any `VITE_` variable.  
> The AI key lives only in Supabase secrets and is never sent to the browser.

### What works without Supabase?

Everything. The chat always replies using the local keyword-based fallback engine that knows about:
- All destinations in `src/data/destinations.ts`
- Hidden spots in `src/data/hiddenSpots.ts`
- Categories, regions, planning tips, best times to visit, and more

The fallback adds a short artificial delay (400–700 ms) so the typing indicator is visible.

## Checks

```bash
npx tsc -b
npx oxlint
npm run build
```

## How to test the chat

1. Run `npm run dev` and open the app in your browser.
2. Click **Chat with AI** in the top-right navbar.
3. Try the suggestion chips or type your own question (e.g. "Plan a weekend trip from Mumbai").
4. Send 3 messages quickly — replies always arrive in the same order as the questions.
5. Reload the page — conversation is restored from `sessionStorage`.
6. Test the **Clear chat** button (trash icon in the panel header).
7. Press **Escape** to close the panel.
8. Resize to 375 px width to verify the mobile bottom-sheet layout.
9. Toggle the theme (sun/moon icon) — panel adapts to both light and dark.
