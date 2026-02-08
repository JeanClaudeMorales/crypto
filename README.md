# ZVE Crypto App (Demo Fullstack)

UI móvil estilo “crypto wallet/exchange” + backend Fastify + PostgreSQL (Prisma).
Esto NO es trading real ni custodia real: es una demo de producto + arquitectura.

## Qué incluye
- Onboarding: Splash + Welcome
- Auth: Register / Login / Forgot / Reset (UI demo)
- App: Home, Markets, Market Detail (candles), Trade (swap), Wallet (deposit/withdraw), Activity, Watchlist, Notifications, Profile, Settings, Support ticket
- Backend API con JWT + Refresh Tokens
- DB PostgreSQL con Prisma (schema completo)
- Provider de mercado:
  - `synthetic` (por defecto): genera velas realistas para UI
  - `binance`: consume velas reales de Binance (solo lectura)

## Requisitos
- Node 20+
- Docker (opcional, recomendado para DB)

---

## Setup rápido con Docker (recomendado)

1) Levanta DB + server + web:
```bash
docker compose up --build
```

2) En otra terminal, migra y seed (solo la primera vez):
```bash
docker exec -it zve_server sh -lc "npm run prisma:migrate && npm run seed"
```

3) Abre:
- Web: http://localhost:5173
- API: http://localhost:4000/health
- Swagger: http://localhost:4000/docs

Credenciales demo:
- email: `demo@zve.app`
- password: `demo1234`

---

## Setup manual (sin Docker)

### 1) DB
Crea Postgres y exporta:
- `server/.env` (copia desde `.env.example`)

### 2) Backend
```bash
cd server
cp .env.example .env
npm i
npm run prisma:migrate
npm run seed
npm run dev
```

### 3) Frontend
```bash
cd ..
cp .env.example .env.local
npm i
npm run dev
```

---

## Variables de entorno
Frontend:
- `VITE_API_URL` (por defecto `http://localhost:4000`)

Backend (`server/.env`):
- `DATABASE_URL`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `MARKET_DATA_PROVIDER=synthetic|binance`

---

## Notas de seguridad (importante)
- Este proyecto es demo. No hay KYC, custodia, firmas, compliance, ni protección real contra fraude.
- No uses esto para manejar dinero real.
