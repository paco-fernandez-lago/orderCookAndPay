# Order Cook & Pay - Restaurant Management System

A full-stack restaurant management application built with React, Express, PostgreSQL, and Socket.io for real-time order tracking.

## Features

- **Waiter Interface**: Add orders per table from a categorized menu
- **Kitchen Display**: Real-time order updates with status management
- **Bill Management**: View and print bills per table
- **Real-time Updates**: Socket.io for instant kitchen notifications

## Project Structure

```
orderCookAndPay/
├── server/                 # Express backend + Socket.io
│   ├── src/
│   │   ├── index.js       # Express server bootstrap
│   │   ├── db.js          # PostgreSQL connection
│   │   ├── socket.js      # Socket.io instance management
│   │   ├── routes/        # REST API endpoints
│   │   └── middleware/    # Error handling
│   ├── migrations/        # SQL schema files
│   └── migrate.sh         # Run migrations script
└── client/                # React + Vite frontend
    ├── src/
    │   ├── App.jsx        # Main routing component
    │   ├── api.js         # API client
    │   ├── socket.js      # Socket.io client
    │   └── pages/         # WaiterPage, KitchenPage, BillPage
    └── vite.config.js     # Dev server config with proxy
```

## Tech Stack

- **Backend**: Node.js, Express, PostgreSQL, Socket.io
- **Frontend**: React 18, React Router v6, Socket.io-client, Vite
- **Database**: PostgreSQL with plain SQL (no ORM)

## Setup & Running

### Prerequisites

- Node.js 18+ (native WSL or local installation)
- PostgreSQL 12+

### Backend Setup

1. Install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Configure `.env`:
   ```
   DATABASE_URL=postgresql://user:pass@localhost:5432/ordercookandpay
   PORT=4000
   ```

3. Create database:
   ```bash
   createdb ordercookandpay
   ```

4. Run migrations:
   ```bash
   cd server && bash migrate.sh
   ```

5. Start server:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:4000`

### Frontend Setup

1. Install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Start dev server:
   ```bash
   npm run dev
   ```

The dev server will run on `http://localhost:5173` with API proxy to `localhost:4000`

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/tables` | List all tables |
| GET | `/api/menu-items` | List available menu items |
| POST | `/api/orders` | Create new order |
| GET | `/api/orders/pending` | Get pending/in-progress orders (kitchen) |
| GET | `/api/orders/table/:id` | Get orders for a table |
| PATCH | `/api/orders/:id/status` | Update order status |
| GET | `/api/bills/table/:id` | Get bill for a table |

## WebSocket Events

- `order:new` - New order created
- `order:status_changed` - Order status updated

## Database Schema

### restaurant_tables
- id, number (unique), created_at
- Pre-populated with tables 1-20

### menu_items
- id, name, description, price, category, available, created_at
- Pre-populated with 8 items

### orders
- id, table_id, status (pending/in_progress/ready/delivered), notes, created_at, updated_at

### order_items
- id, order_id, menu_item_id, quantity, unit_price (snapshot), created_at

## Usage

1. **Waiter**: Select table → Add items from menu → Submit order
2. **Kitchen**: View live orders → Update status (pending → in_progress → ready → delivered)
3. **Bill**: Select table → View bill → Print

## Notes

- Unit prices are snapshotted at order time for bill accuracy
- Orders automatically removed from kitchen when marked delivered
- Print CSS hides navigation bar
- Vite dev proxy handles CORS for development
- Error handling includes async/await with built-in middleware

## WSL/Windows Users

If npm install fails with WSL path errors:
- Install Node.js natively in WSL: `curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -`
- Or use WSL 2 with Ubuntu and reinstall Node.js in the WSL distro
- The npm included with Windows Node.js has compatibility issues with WSL paths
