# =======================
# Stage 1: Build Frontend
# =======================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/voice-agent-ui

# install frontend dependencies
COPY voice-agent-ui/package*.json ./ 
RUN npm install

# build frontend
COPY voice-agent-ui ./ 
RUN npm run build

# =======================
# Stage 2: Backend + Frontend
# =======================
FROM python:3.11-slim

# install uv (for pyproject.toml deps)
RUN pip install uv

WORKDIR /app

# copy backend (Python files in root)
COPY pyproject.toml ./
COPY main.py ./
COPY requirements.txt ./

# install dependencies (choose whichever exists)
RUN if [ -f pyproject.toml ]; then uv pip install . --system; \
    elif [ -f requirements.txt ]; then pip install -r requirements.txt; fi

# copy frontend build from Stage 1
COPY --from=frontend-builder /app/voice-agent-ui/.next ./voice-agent-ui/.next
COPY --from=frontend-builder /app/voice-agent-ui/public ./voice-agent-ui/public

# expose ports
EXPOSE 8000
EXPOSE 3000

# run backend
CMD ["python", "main.py"]
