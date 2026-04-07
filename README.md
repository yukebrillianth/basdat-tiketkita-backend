# TiketKita Backend

Backend REST API untuk platform tiket online TiketKita.

## Kelompok 11

|                 |                                 |
| --------------- | ------------------------------- |
| **Dosen**       | Dr. Arief Kurniawan, S.T., M.T. |
| **Mata Kuliah** | Sistem Basis Data               |

### Anggota

| Nama                       | NRP        |
| -------------------------- | ---------- |
| Aisyah Nuurii Winsetyowati | 5024241008 |
| Atika Najwa Azzahra        | 5024241091 |
| Yuke Brilliant Hestiavin   | 5024241016 |

## Tech Stack

- Node.js + TypeScript + Express.js
- MySQL 8.0
- mysql2 (raw SQL, no ORM)
- JWT Authentication

## Setup

### Prerequisites

- Node.js 22+
- pnpm
- Docker & Docker Compose

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env

# Start MySQL dan phpMyAdmin via Docker
docker-compose up -d

# Run migrations
pnpm migrate
```

### Development

```bash
# Run dev server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run migrations up/down
pnpm migrate
pnpm migrate:down
```

phpMyAdmin tersedia di `http://localhost:8080`

## Struktur Proyek

```
src/
├── config/         # Database connection
├── migrations/     # Database migrations + seed
├── middleware/     # Auth, validation, error handler
├── modules/        # Feature modules (controller, service, repository, routes)
├── types/          # TypeScript interfaces dan types
├── utils/          # Helper functions
├── app.ts          # Express app setup
└── server.ts       # Server entry point
```

## API Endpoints

| Method | Path                             | Auth | Keterangan           |
| ------ | -------------------------------- | ---- | -------------------- |
| POST   | `/api/auth/register`             | -    | Register user        |
| POST   | `/api/auth/login`                | -    | Login                |
| GET    | `/api/auth/me`                   | user | Profil sendiri       |
| GET    | `/api/events`                    | -    | List event published |
| GET    | `/api/events/:id`                | -    | Detail event         |
| POST   | `/api/orders`                    | user | Buat order           |
| GET    | `/api/orders`                    | user | Riwayat order        |
| POST   | `/api/payments/:orderId/confirm` | user | Konfirmasi bayar     |
| GET    | `/api/wishlist`                  | user | Wishlist user        |
| POST   | `/api/wishlist`                  | user | Toggle wishlist      |

Endpoint admin tersedia di `/api/events`, `/api/promo-codes`, `/api/payment-methods`, `/api/categories`, `/api/venues`.
