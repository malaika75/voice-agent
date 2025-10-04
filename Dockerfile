# =======================
# Stage 1: Build Frontend
# =======================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# install frontend dependencies
COPY frontend/package*.json ./
RUN npm install

# build frontend
COPY frontend ./
RUN npm run build

# =======================
# Stage 2: Backend + Frontend
# =======================
FROM python:3.11-slim

# install uv (for pyproject.toml deps)
RUN pip install uv

WORKDIR /app

# copy backend project
COPY backend/ ./backend

# install backend dependencies with uv
WORKDIR /app/backend
COPY backend/pyproject.toml ./
RUN uv pip install . --system

# copy frontend build into backend folder (optional serving)
WORKDIR /app
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# expose ports
EXPOSE 8000
EXPOSE 3000

# run backend
WORKDIR /app/backend
CMD ["python", "main.py"]
