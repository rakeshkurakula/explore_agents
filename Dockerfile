# syntax=docker/dockerfile:1
FROM python:3.10-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential ffmpeg git curl && \
    rm -rf /var/lib/apt/lists/*

# Workdir
WORKDIR /app

# Python deps
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

# App code
COPY . /app

# Runtime env (documented; set at run-time)
# - OPENAI_API_KEY
# - SERPER_API_KEY
# - STORAGE_BUCKET (e.g., file:///data or s3://bucket)
# - TRANSIENT_DIR (e.g., /tmp)

# Expose API port (if serving an API)
EXPOSE 8000

# Default command
# You can override with `docker run ... mycmd`
CMD ["python", "-m", "pipelines.run", "--help"]

# --- Usage Notes ---
# Build:
#   docker build -t explore-agents:latest .
# Run (mount local data dir, set env):
#   docker run --rm -p 8000:8000 \
#     -e OPENAI_API_KEY=$OPENAI_API_KEY \
#     -e SERPER_API_KEY=$SERPER_API_KEY \
#     -e STORAGE_BUCKET=file:///data \
#     -e TRANSIENT_DIR=/tmp \
#     -v $(pwd)/data:/data \
#     explore-agents:latest
# Develop (bash):
#   docker run --rm -it -v $(pwd):/app explore-agents:latest bash
