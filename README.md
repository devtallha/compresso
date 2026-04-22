# Compresso: Elite Media Optimization Engine

Compresso is a high-performance, cost-effective media compression system built with a focus on clean architecture and massive scalability.

## 🏗️ Architecture
The project follows a **Distributed Monorepo** pattern:
- **Producer**: Next.js App handles uploads & queuing.
- **Consumer**: Node.js Worker handles heavy CPU tasks.
- **Messaging**: RabbitMQ ensures tasks are processed reliably.
- **Caching**: Redis provides real-time job status.
- **Storage**: Streaming Local File System (Zero cost).

## 🚀 Key Features
- **Busboy Streaming**: 1GB+ uploads with minimal RAM usage.
- **Priority Queues**: Images don't wait for Videos.
- **FFmpeg slow preset**: Best-in-class compression ratios.
- **Janitor Service**: Automatic cleanup of expired files.

## 🛠️ Setup
1. **Install deps**: `npm install`
2. **Infrastructure**: `docker-compose up -d`
3. **Database**: Update `.env` with Supabase details and run `npx prisma db push` in `packages/database`.
4. **Run**: `npm run dev`

## 📂 Project Structure
- `apps/web`: Next.js 14 Dashboard & API
- `apps/worker`: Background Processing Engine
- `packages/domain`: Compression Strategies (Strategy Pattern)
- `packages/infra`: RabbitMQ & Redis Providers
- `packages/database`: Prisma & Supabase Config
- `packages/shared`: Common Types & Schemas

---
Built for 10k users. Clean. Scalable. Free.
