# Logs Metrics Viewer

Logs Metrics Viewer is a two-part app:

- `backend`: Spring Boot API with H2 storage.
- `frontend`: Vue/Vite dashboard for viewing logs and metrics.

## Prerequisites

- Docker Desktop or Docker Engine with Docker Compose.

## Run With Docker Compose

From the root folder:

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:5173
- Backend API base URL: http://localhost:8080/api/v1/
- H2 console: http://localhost:8080/h2-console

The frontend container serves the built Vue app with Nginx. The backend container runs the Spring Boot jar on port `8080`.

## Data Storage

The backend uses an H2 file database stored in the Docker volume `backend-data`.

To stop the app while keeping the database:

```bash
docker compose down
```

To stop the app and remove the database volume:

```bash
docker compose down -v
```

## Local Development Without Docker

Backend:

```bash
cd backend
mvn -q -DskipTests compile
mvn spring-boot:run
```

Frontend:

```bash
cd frontend
pnpm install
pnpm run dev -- --host 127.0.0.1 --port 5173
```

Set the frontend backend URL with:

```bash
VITE_APP_BACKEND=http://localhost:8080/api/v1/
```
