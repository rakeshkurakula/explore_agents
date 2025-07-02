# Day-Trading Crew Dashboard

This example shows a minimal dashboard stack for the day-trading crew using an Express backend and React frontend. It now includes an educational component demonstrating options strategies.

## Architecture
- **Express API** with JWT authentication and a WebSocket for trade updates.
- **React** component that connects to the WebSocket and lists trades live.

## Getting Started
The API requires a `JWT_SECRET` environment variable. Copy `server/.env.example`
to `server/.env` and adjust the value before running the server.
1. Install Node 18 or later and pnpm.
2. Install server dependencies:
   ```bash
   cd dashboard/server
   pnpm install
   # Set the JWT secret (required for signing tokens)
   cp .env.example .env && \
   export $(grep JWT_SECRET .env)
   node server.js
   ```
3. In another terminal, run the React client using Vite:
   ```bash
   cd ../client
   pnpm install
   pnpm run dev
   ```
   The app reads `index.html` at the project root and mounts the exported `TradeUpdates`
   and `DerivativesMastery` components. Build a production bundle with `pnpm run build`.
   Tailwind CSS is configured in `tailwind.config.js` and included via `src/index.css`.

The server exposes:
- `POST /auth/login` – returns a JWT token when given `{username}`.
- `GET /trades` – list trades (requires `Authorization: Bearer <token>`).
- `POST /trades` – create a trade (requires auth; JSON body `{symbol, qty, price}`).
- WebSocket at `ws://localhost:3000` broadcasting trade updates.

Use the `TradeUpdates` React component to display live trades. The `DerivativesMastery` component visualises options concepts with Chart.js and Tailwind CSS.

**Disclaimer:** All examples are for educational purposes only and do not constitute financial advice.
