# Contributing to Compresso

First off, thank you for considering contributing to Compresso! It's people like you who make the open-source community such an amazing place to learn, inspire, and create.

## 🏗️ Monorepo Architecture

Compresso is built using a **Turborepo** monorepo structure. Before you start, familiarize yourself with the workspace:

- `apps/web`: Next.js frontend and Producer API.
- `apps/worker`: Node.js Consumer (the heavy lifting).
- `packages/domain`: Business logic and compression strategies.
- `packages/infra`: Third-party providers (RabbitMQ, Redis).
- `packages/database`: Prisma schema and database logic.
- `packages/shared`: Shared types and Zod schemas.

## 🚀 How to Contribute

### 1. Reporting Bugs
- Use the **GitHub Issue Tracker**.
- Provide a clear description of the bug and steps to reproduce it.
- Include your environment details (Node version, OS).

### 2. Suggesting Features
- Open an issue with the tag `enhancement`.
- Describe why this feature would be useful and how it should work.

### 3. Pull Requests
1. **Fork the repo** and create your branch from `main`.
2. **Install dependencies**: `npm install`.
3. **Run in development**: `npm run dev`.
4. **Follow Architecture**: 
   - New compression types should be added as a new Strategy in `packages/domain`.
   - New infrastructure providers (e.g., S3 storage) should go in `packages/infra`.
5. **Lint and Format**: Ensure your code passes `npm run lint`.
6. **Submit PR**: Provide a detailed description of what your changes do.

## 🛠️ Development Workflow

### Setup Local Infrastructure
We use Docker for local development of RabbitMQ, Redis, and PostgreSQL:
```bash
docker-compose up -d
```

### Build Everything
To ensure your changes didn't break the monorepo links:
```bash
npx turbo build
```

## 🎨 Code Style
- Use **TypeScript** for everything.
- Follow the **Strategy Pattern** for media processing.
- Keep components small and focused in `apps/web`.
- Use **Zod** for all data validation in `packages/shared`.

## 📜 Code of Conduct
By participating in this project, you agree to abide by our Code of Conduct. Be respectful and collaborative!

---
Happy Coding! 🚀
