# Todo Backend

FastAPI backend for Todo application with Neon PostgreSQL and JWT authentication.

## Quick Start

### Prerequisites

- Python 3.13+
- PostgreSQL database (Neon Serverless recommended)

### Installation

```bash
cd backend
pip install -e .
```

### Configuration

Copy `.env.example` to `.env` and configure:

```env
DATABASE_URL=postgresql://user:password@ep-xyz.region.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=your-super-secret-jwt-key
BACKEND_HOST=0.0.0.0   
BACKEND_PORT=8000
CORS_ORIGINS=http://localhost:3000
```

### Run Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List user's tasks (paginated) |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/{id}` | Get specific task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |
| PATCH | `/api/tasks/{id}/complete` | Toggle completion |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | API info |

## Authentication

The backend expects JWT tokens issued by Better Auth. Tokens should be included in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Token payload must contain:
- `sub`: User ID (string)
- `email`: User email (optional)

## Models

### Todo
- `id`: Integer, primary key, auto-increment
- `user_id`: String, foreign key to User
- `title`: String (1-200 chars), required
- `description`: Optional string
- `completed`: Boolean, default False
- `created_at`: Datetime
- `updated_at`: Datetime

## Error Handling

| Status | Description |
|--------|-------------|
| 401 | Not authenticated / Invalid token |
| 403 | Not authorized to access resource |
| 404 | Task not found |
| 400 | Validation error |

## Deployment

### CORS Notes

When deploying the backend (e.g., to Railway or Render) and the frontend (e.g., to Vercel), you must ensure `CORS_ORIGINS` includes your production frontend URL.

Example:
```env
CORS_ORIGINS=https://your-app.vercel.app,http://localhost:3000
```

### Frontend Configuration

Ensure `NEXT_PUBLIC_API_URL` is set in your Vercel/frontend environment variables to point to your live backend:
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

## Development

```bash
# Install dev dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run with auto-reload
uvicorn main:app --reload
```
