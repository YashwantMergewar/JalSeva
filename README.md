# Jal Seva

Jal Seva is a full-stack application with an Expo/React Native client and a Node.js/Express API. The API uses Prisma with PostgreSQL, and the repository includes Docker Compose for a local database, pgAdmin, and containerized API.

## Requirements

- Node.js 22 or later recommended
- npm
- Docker Desktop (recommended for the local PostgreSQL database)
- Expo Go on a physical device, or an Android/iOS emulator, to run the mobile client

## Repository structure

```text
JalSeva/
|-- client/                  # Expo + React Native application
|   |-- app/                 # Expo Router screens and layouts
|   |-- src/                 # Client styles and shared client code
|   |-- app.json             # Expo application configuration
|   |-- .env.example         # Client environment-variable notes/template
|   `-- package.json         # Client commands and dependencies
|
|-- server/                  # Express + TypeScript API
|   |-- prisma/              # Prisma schema and migrations
|   |-- src/
|   |   |-- config/          # Database configuration
|   |   |-- generated/       # Generated Prisma client (created locally)
|   |   |-- utils/           # Shared backend utilities
|   |   |-- app.ts           # Express middleware and error handling
|   |   `-- index.ts         # API bootstrap and graceful shutdown handling
|   |-- .env.example         # Server environment template
|   |-- Dockerfile           # API container definition
|   `-- package.json         # API commands and dependencies
|
|-- docker-compose.yml       # PostgreSQL, pgAdmin, and API containers
`-- README.md                # This guide
```

## Quick start (local development)

### 1. Start PostgreSQL

From the repository root, start the database service:

```bash
docker compose up -d postgres
```

The database is available at `localhost:5432`. Its Docker Compose credentials are:

```text
Database: jalsevadb
User:     postgres
Password: postgres
```

### 2. Set up and run the server

Open a terminal in `server/` and create a local environment file from the example.

```bash
cd server
copy .env.example .env
```

On macOS/Linux, use `cp .env.example .env` instead. Update `DATABASE_URL` in `.env` to match your database. For the Compose database, use:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jalsevadb?schema=public"
```

Install dependencies, generate the Prisma client, apply database migrations, and start the API:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

The API listens on `http://localhost:5000` by default. Change `PORT` in `server/.env` if required.

Useful server commands:

```bash
npm run dev               # Watch TypeScript and restart the API on changes
npm run build             # Generate Prisma client and compile to server/dist
npm start                 # Run the compiled API
npm run prisma:generate   # Regenerate the Prisma client after schema changes
npm run prisma:migrate    # Create/apply a development migration
```

### 3. Set up and run the client

Open another terminal in `client/`:

```bash
cd client
npm install
npm start
```

Use the Expo developer tools to open the project in Expo Go, an emulator, or the web browser. You can also run a specific target:

```bash
npm run android
npm run ios
npm run web
```

The client uses Expo Router: add or edit screens in `client/app/`, and use `client/app/_layout.tsx` for shared navigation/layout configuration. Shared styles are in `client/src/global.css`.

> **Connecting a physical device to the API:** `localhost` on a phone means the phone itself. Configure the client to use your computer's LAN IP address (for example, `http://192.168.1.10:5000`) and ensure both devices are on the same network. The API binds to `0.0.0.0`, so it can accept LAN connections.

## Run client and server together

After installing dependencies in both folders and configuring `server/.env`, the client provides a convenience command:

```bash
cd client
npm run dev
```

It starts Expo and invokes the server development script. Running the client and server in separate terminals remains useful when you want to read their logs independently.

## Docker Compose

To run the full container stack from the repository root:

```bash
docker compose up --build
```

This starts:

| Service | Address | Purpose |
| --- | --- | --- |
| API | `http://localhost:5000` | Containerized Express API |
| PostgreSQL | `localhost:5432` | Application database |
| pgAdmin | `http://localhost:5050` | Database administration UI |

pgAdmin sign-in credentials are `admin@gmail.com` / `admin`. The API container connects to PostgreSQL using Docker's internal `postgres` hostname.

Stop the containers with:

```bash
docker compose down
```

This keeps the named database volumes. To remove the volumes as well (which deletes local Docker database data), run `docker compose down -v` only when you intentionally want a fresh database.

## Development guidelines

- Keep mobile screens and route files in `client/app/`; Expo Router derives routes from this folder.
- Keep reusable client-only styles and modules in `client/src/`.
- Keep API bootstrap/middleware in `server/src/app.ts` and the process startup code in `server/src/index.ts`.
- Put database schema changes in `server/prisma/schema.prisma`, then run `npm run prisma:migrate` and commit the resulting migration files.
- Do not commit `.env` files, credentials, database dumps, generated `server/dist/`, or `node_modules/`.
- When adding a client API base URL, expose only non-secret values through Expo's supported public environment-variable convention; keep database URLs and credentials exclusively on the server.
- Run `npm run build` in `server/` and `npm run lint` in `client/` before submitting changes when those checks are available in your environment.

## Troubleshooting

- **Database connection fails:** confirm Docker is running, `docker compose up -d postgres` completed successfully, and `DATABASE_URL` in `server/.env` uses `localhost` for a locally run server.
- **Prisma client errors:** run `npm run prisma:generate` inside `server/`, especially after changing the schema or reinstalling dependencies.
- **Phone cannot reach the API:** use the computer's LAN IP rather than `localhost`, allow the server port through the firewall, and verify both devices share a network.
- **Port already in use:** change `PORT` in `server/.env`, or stop the process currently using that port.
