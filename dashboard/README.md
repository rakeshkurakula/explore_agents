# Day-Trading Crew Dashboard

This example shows a minimal dashboard stack for the day-trading crew using an Express backend and React frontend.

## Architecture
- **Express API** with JWT authentication and a WebSocket for trade updates.
- **React** component that connects to the WebSocket and lists trades live.

## Getting Started
1. Install Node 18 or later and pnpm.
2. Install server dependencies:
   ```bash
   cd dashboard/server
   pnpm install
   node server.js
   ```
3. In another terminal, install client deps and run a bundler of your choice:
   ```bash
   cd ../client
   pnpm install
   # integrate with your React setup (e.g., Vite)
   ```

The server exposes:
- `POST /auth/login` – returns a JWT token when given `{username}`.
- `GET /trades` – list trades (requires `Authorization: Bearer <token>`).
- `POST /trades` – create a trade (requires auth; JSON body `{symbol, qty, price}`).
- WebSocket at `ws://localhost:3000` broadcasting trade updates.

Use the `TradeUpdates` React component to display live trades.
