# PartnerIQ™ — Due Diligence Platform

A PE-style romantic due diligence platform implementing the Hypothesis-Driven Dating (HDD) framework.

Built by Damilola George Ojo Jr.

## Features

- Multi-candidate pipeline with HDD phase tracking (5 phases)
- 9 pillars, 46 criteria with anchored 1–5 behavioural descriptors
- Phase-gated scoring (pillars unlock as phases progress)
- Pre-committed criteria with audit-trail editing
- Structured observation log (behaviour vs. interpretation)
- Score snapshots and trajectory chart
- Red flag veto layer
- Introspective self-scoring panel with candidate deltas
- IC deal memo generator
- 100% local — all data stored in browser localStorage

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to vercel.com → Add New Project → import the repo
3. Vercel auto-detects Vite — click Deploy

## Tech stack

- React 18 + Vite
- Zero external dependencies beyond React
- Inline styles (no CSS frameworks)
- localStorage for persistence
