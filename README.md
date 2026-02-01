# DietCare

DietCare is a full-stack nutrition and diet planning app with a React frontend and an Express + Prisma backend. It supports user profiles, diet plans, progress tracking, and a RAG-powered chatbot/recommendation flow.

## Features
- Authentication with access + refresh tokens and guest sessions
- User profiles with BMI/goal tracking
- Diet plans and meal targets
- Weight and calorie logs
- Chatbot with RAG (nutrition document embeddings)
- Personalized recommendations

## Tech Stack
- Frontend: React 19, Vite, Tailwind CSS, Radix UI, Zustand, React Router
- Backend: Node.js, Express, Prisma, PostgreSQL (pgvector)
- RAG: embedding + generation providers configured via environment variables

## Project Structure
```
./
+- diet-care/            # Frontend (Vite + React)
+- diet-care-backend/    # Backend (Express + Prisma)
```

## Getting Started

### Prerequisites
- Node.js (LTS recommended)
- PostgreSQL with `vector` extension enabled (pgvector)

### Install
From the repo root:
```
cd diet-care
npm install

cd ..\diet-care-backend
npm install
```

### Environment Variables
Create `.env` files in each app directory.

Frontend (`diet-care/.env`):
```
VITE_API_URL=http://localhost:3000
```

Backend (`diet-care-backend/.env`):
```
PORT=3000
NODE_ENV=development

DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public
DIRECT_URL=postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public

JWT_SECRET=replace_me
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=30
FRONTEND_URL=http://localhost:5173
COOKIE_SECURE=false

EMBEDDING_API_KEY=replace_me
EMBEDDING_API_URL=replace_me
EMBEDDING_MODEL=replace_me

GENERATION_API_KEY=replace_me
GENERATION_API_URL=replace_me
GENERATION_MODEL=replace_me

QUERY_EMBEDDING_TTL_DAYS=30
```

Notes:
- `DATABASE_URL` and `JWT_SECRET` are required at runtime.
- `DIRECT_URL` is used for Prisma migrations.
- Rotate any keys before running in production.

### Database & Prisma
From `diet-care-backend/`:
```
# Uncomment the datasource URL in prisma/schema.prisma if needed for migrations
npx prisma migrate dev
```

### Run the Apps
Backend (in `diet-care-backend/`):
```
npm run dev
```

Frontend (in `diet-care/`):
```
npm run dev
```

Frontend defaults to `http://localhost:5173` and backend to `http://localhost:3000`.

## RAG Ingestion (Optional)
To ingest nutrition documents into the vector table:
```
cd diet-care-backend
npx tsx src/rag/ingest.ts --input ./data/nutrition_book.txt --source nutrition_book --lang en
```
To clean cached query embeddings:
```
npm run rag:cleanup
```

## Scripts
Frontend (`diet-care/`):
- `npm run dev` - start Vite dev server
- `npm run build` - typecheck and build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

Backend (`diet-care-backend/`):
- `npm run dev` - start API in watch mode
- `npm run rag:cleanup` - clean cached query embeddings

## License
ISC
