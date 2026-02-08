# Informe del ZIP — ZVE Crypto App (Demo Fullstack)

Este ZIP trae un producto **completo**: **Frontend (React/Vite/Tailwind)** + **Backend (Fastify/Prisma)** + **PostgreSQL** + **Docker Compose**.

> **Advertencia:** Es una demo técnica. No es un exchange real, no custodia fondos, no hace KYC/AML, no firma transacciones on-chain, no cumple compliance.

---

## 1) Estructura del proyecto

```
zve-crypto-app-expanded/
  ├─ src/                        # Frontend React
  │  ├─ components/              # UI + Charts + Layout
  │  ├─ context/                 # Auth context
  │  ├─ hooks/                   # React Query hooks
  │  ├─ lib/                     # API client (fetch wrapper)
  │  ├─ routes/                  # Pantallas
  │  ├─ styles/                  # Tailwind css
  │  └─ main.tsx / App.tsx        # Entrada y router
  ├─ server/                     # Backend Fastify + Prisma
  │  ├─ src/
  │  │  ├─ lib/                  # env, prisma, auth, helpers
  │  │  ├─ routes/               # endpoints REST
  │  │  └─ services/             # mercado, precios, wallets
  │  └─ prisma/                  # schema + seed
  ├─ docker-compose.yml          # DB + server + web
  ├─ Dockerfile                  # web (dev)
  └─ .env.example                # VITE_API_URL
```

---

## 2) Frontend (React + Vite + Tailwind)

### Pantallas (routes)
- Onboarding:
  - `/` → Splash
  - `/welcome` → Welcome
- Auth:
  - `/login`
  - `/register`
  - `/forgot` (UI demo)
  - `/reset` (UI demo)
- App (requiere sesión):
  - `/app` → Home
  - `/app/markets` → Markets (list)
  - `/app/markets/:symbol` → MarketDetail (candles + timeframe)
  - `/app/trade` → Swap
  - `/app/wallet` → Wallet (holdings + deposit/withdraw)
  - `/app/activity` → Activity (transacciones)
  - `/app/watchlist`
  - `/app/notifications`
  - `/app/profile`
  - `/app/settings` (UI demo)
  - `/app/support` (ticket)

### Estado y data fetching
- **Auth context** (`src/context/auth.tsx`)
  - Guarda `accessToken` + `refreshToken` + `user` en `localStorage`
  - Auto-refresh cuando hay 401
- **React Query** (`src/hooks/queries.ts`)
  - `useMarkets()`, `useCandles(symbol, interval)`
  - `useHoldings()`
  - `useTransactions()`
  - `useSwapQuote()`, `useSwap()`
  - `useDeposit()`, `useWithdraw()`
  - `useWatchlist()` + add/remove
  - `useNotifications()` + mark read
  - `useSupportTicket()`

### UI/UX
- Estilo mobile-first, dark, con glass panels
- Bottom navigation persistente
- Candlestick chart con **lightweight-charts**
- Cards y botones consistentes

### Config
- `.env.local` / `.env.example`
  - `VITE_API_URL=http://localhost:4000`

---

## 3) Backend (Fastify + Prisma + PostgreSQL)

### Stack
- Fastify + CORS + JWT
- Prisma ORM (PostgreSQL)
- Swagger UI en `/docs`

### Auth
- Access token: JWT (15 min)
- Refresh token: random (hash sha256 en DB), expira en 30 días, rotación al refrescar.

### Providers de mercado
- `MARKET_DATA_PROVIDER=synthetic`
  - Genera velas determinísticas por símbolo/interval (ideal para UI)
- `MARKET_DATA_PROVIDER=binance`
  - Consume `/api/v3/klines` de Binance para velas reales
  - Nota: solo lectura, sin ordenes reales

---

## 4) API Endpoints

Base URL: `http://localhost:4000`

### Health / Docs
- `GET /health`
- `GET /docs` (Swagger UI)

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`

### Usuario
- `GET /me` (JWT)

### Markets
- `GET /markets`
- `GET /markets/:symbol`
- `GET /markets/:symbol/candles?interval=1h&limit=140`

### Portfolio / Wallet
- `GET /portfolio/holdings` (JWT)

### Transactions
- `GET /transactions` (JWT)
- `POST /transactions/deposit` (JWT)
- `POST /transactions/withdraw` (JWT)

### Swap
- `POST /swap/quote` (JWT)
- `POST /swap` (JWT)

### Watchlist
- `GET /watchlist` (JWT)
- `POST /watchlist/add` (JWT)
- `POST /watchlist/remove` (JWT)

### Notifications
- `GET /notifications` (JWT)
- `POST /notifications/read` (JWT)

### Support
- `POST /support/ticket` (JWT)

---

## 5) Base de datos (Prisma Schema)

Archivo: `server/prisma/schema.prisma`

Modelos principales:
- `User` + `RefreshToken`
- `Asset` (BTC/ETH/USDT...) + `Market` (BTCUSDT...)
- `Candle` (OHLCV por interval)
- `Wallet` (balance por asset)
- `Transaction` (deposit/withdraw/swap)
- `Order` + `OrderFill` (estructura para ampliación)
- `WatchlistItem`
- `Notification`
- `PriceAlert` (base para alertas)
- `SupportTicket`
- `Role`, `Permission`, `UserRole`, `RolePermission` (RBAC, listo para crecer)
- `AuditLog` (lista para logging)

Seed:
- Crea assets y mercados base (BTCUSDT, ETHUSDT, etc.)
- Crea usuarios demo:
  - `demo@zve.app` / `demo1234`
  - `demo2@zve.app` / `demo1234`
- Crea wallets iniciales + notificaciones

---

## 6) Docker

Archivo: `docker-compose.yml`
- `db` (postgres:16)
- `server` (Fastify dev)
- `web` (Vite dev)

Comandos:
```bash
docker compose up --build
docker exec -it zve_server sh -lc "npm run prisma:migrate && npm run seed"
```

---

## 7) Qué NO está incluido (y por qué)
- KYC/AML, compliance, custodia, firmas, retiros on-chain reales
- Gestión de riesgo real, matching engine, orderbook
- Seguridad avanzada (rate limit, WAF, 2FA real, device binding)
- Email real para reset password
- Auditoría contable real

Todo eso se puede añadir, pero no lo metí “a medias” porque en fintech eso es pedir problemas.

---

## 8) Próximas mejoras (si quieres iterar)
- Rate limiting + helmet-like headers + audit logging en cada endpoint
- Alerts reales (PriceAlert) con job scheduler (BullMQ/Redis)
- Cache de markets/candles (Redis)
- Multi-currency fiat + conversion
- 2FA real + device sessions
- UI: onboarding carousel, perfil con verificación, filtros avanzados en markets
