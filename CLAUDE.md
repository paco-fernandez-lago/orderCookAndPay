# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Quick Start Commands

### Server (Node.js + Express)
```bash
cd server
npm install                    # Install dependencies
npm run dev                   # Start with nodemon for development
npm start                     # Start in production mode
bash migrate.sh               # Run all SQL migrations (requires DATABASE_URL set)
```

### Client (React + Vite)
```bash
cd client
npm install                   # Install dependencies
npm run dev                   # Start dev server on http://localhost:5173
npm run build                 # Build for production (output: dist/)
npm run preview               # Preview production build locally
```

### Database
```bash
createdb ordercookandpay      # Create database (requires PostgreSQL)
psql ordercookandpay          # Connect to database
```

## Architecture Overview

### Monorepo Structure
- **server/**: Express backend with Socket.io real-time updates
- **client/**: React frontend with React Router v6 and Vite
- **Vite Proxy**: Dev server proxies `/api/*` and `/socket.io` to `http://localhost:4000`

### Backend Architecture

**Core Pattern**: Routes receive `io` instance as parameter to emit WebSocket events, avoiding circular dependencies.

```
server/src/
├── index.js          # Express + HTTP server setup with Socket.io
├── db.js             # PostgreSQL pool singleton for queries
├── socket.js         # Socket.io instance getter/setter (global ref)
├── routes/
│   ├── tables.js     # GET /tables
│   ├── menuItems.js  # GET /menu-items
│   ├── orders.js     # POST (create), GET (pending/table/:id), PATCH (status)
│   └── bills.js      # GET /bills/table/:id
└── middleware/
    └── errorHandler.js
```

**Real-time Flow**: When an order is created or status changes:
1. Route handler updates database (transactional with BEGIN/COMMIT)
2. Fetches full order with JOINed items
3. Calls `io.emit()` to broadcast `order:new` or `order:status_changed` to all connected clients
4. KitchenPage listens and updates state immediately

### Frontend Architecture

**Pages** (React Router v6):
- `/waiter` — TableSelector + MenuGrid + OrderSummary (cart with qty controls)
- `/kitchen` — Real-time OrderCard grid, status workflow buttons
- `/bill` — Table selector + BillTable + Print button

**Socket Integration**: 
- `socket.js` provides `getSocket()` singleton initialized in App.jsx via `initSocket()`
- KitchenPage registers listeners on mount with cleanup on unmount
- Listeners update state directly; removes cards when status = 'delivered'

**API Client**: `api.js` exports fetch wrappers (getTables, createOrder, etc.) — all calls use `/api` prefix proxied by Vite in dev.

### Database Design

**Key Decision**: Unit prices are **snapshotted** at order time (order_items.unit_price), not joined from current menu price. This ensures bills remain accurate even if menu prices change.

```sql
-- Critical indexes for queries
orders(table_id, status)
order_items(order_id)
restaurant_tables(number)
menu_items(category, available)
```

**Pre-seeded Data**:
- 20 restaurant tables (numbers 1–20)
- 8 menu items across 4 categories (Salads, Main Courses, Pasta, Pizza, Desserts, Beverages)

## Common Patterns & Implementation Notes

### Order Status Workflow
Enforced client-side via `ORDER_STATUSES` array in KitchenPage:
```
pending → in_progress → ready → delivered
```
No database constraint; validate on frontend.

### Error Handling
- Express uses `express-async-errors` to catch async/await exceptions
- `errorHandler` middleware catches all errors and returns 500 (or err.status if set)
- No input validation (assumes waiter/kitchen interfaces are trusted)

### Transactions
Orders endpoint wraps item insertion in `BEGIN/COMMIT/ROLLBACK` to ensure order is created with all items atomically.

### Why No ORM
Plain SQL with `pg` library keeps dependencies minimal and queries explicit. All SQL is in route handlers or migration files—easy to audit.

## Setup Checklist for New Development

1. **Database**: `createdb ordercookandpay` then `cd server && bash migrate.sh`
2. **Environment**: Ensure `server/.env` has `DATABASE_URL` and `PORT=4000`
3. **Server**: `cd server && npm install && npm run dev` (runs on port 4000)
4. **Client**: In another terminal, `cd client && npm install && npm run dev` (runs on port 5173)
5. **Test**: Open http://localhost:5173, select table, submit order, watch kitchen page update in real time

## Known Issues & Workarounds

**WSL/Windows npm failures**: If `npm install` fails in client with UNC path errors when running from WSL:
- Problem: Windows npm doesn't handle WSL paths properly
- Solution: Install Node.js natively in WSL instead of using Windows Node.js
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install nodejs
  ```

## Future Development Notes

- **Authentication**: Add user session/JWT if needed; currently all routes are open
- **Input Validation**: Add schema validation (e.g., joi, zod) at route boundaries
- **Testing**: Jest/Vitest for unit tests; Cypress/Playwright for E2E (KitchenPage socket updates are hard to test in jsdom)
- **Print CSS**: Already handles navbar hiding; media queries are in `BillPage.css`
- **Scaling**: Socket.io scales with Redis adapter if moving to multiple server instances; currently in-memory broadcasts only
