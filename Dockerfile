# Read the doc: https://huggingface.co/docs/hub/spaces-sdks-docker
# you will also find guides on how best to write your Dockerfile

FROM python:3.12-slim

RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

RUN pip install --no-cache-dir uv

COPY --chown=user ./pyproject.toml .
COPY --chown=user ./main.py .

RUN uv pip install . --system

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]