# Read the doc: https://huggingface.co/docs/hub/spaces-sdks-docker
FROM python:3.12-slim

# ✅ Install system dependencies for audio packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    portaudio19-dev \
    espeak \
    espeak-data \
    ffmpeg \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install uv (fast Python package manager)
RUN pip install --no-cache-dir uv

# Copy pyproject.toml first (for better Docker caching)
COPY ./pyproject.toml .

# ✅ INSTALL DEPENDENCIES AS ROOT (before switching user)
RUN uv pip install --system .

# ✅ NOW create non-root user and switch
RUN useradd -m -u 1000 user && chown -R user:user /app
USER user

ENV PATH="/home/user/.local/bin:$PATH"

# Copy rest of the application code (as user)
COPY --chown=user . .

# Expose port (HF Spaces uses 7860 by default)
EXPOSE 7860

# Run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]