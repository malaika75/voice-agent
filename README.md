---
title: Voice Agent
emoji: 🎙️
colorFrom: blue
colorTo: pink
sdk: docker
sdk_version: "1.0.0"
app_file: main.py
pinned: false
---


# 🎙️ Voice Agent Backend (FastAPI)

This is the **backend service** of the Voice Agent project.  
It powers the AI logic, generates text/audio, and serves responses to the frontend.

---

## ✨ Features

- AI agent (Gemini via `openai-agents`)
- Text-to-Speech with Edge TTS
- REST API endpoint (`/ask`) for frontend
- Serves generated audio files via static route

---

## 🛠️ Tech Stack

- [FastAPI](https://fastapi.tiangolo.com/) – Web framework  
- [Uvicorn](https://www.uvicorn.org/) – ASGI server  
- [openai-agents](https://pypi.org/project/openai-agents/) – AI agent framework  
- [edge-tts](https://github.com/rany2/edge-tts) – Microsoft TTS  
- [python-dotenv](https://pypi.org/project/python-dotenv/) – Environment variables  
- [uv](https://docs.astral.sh/uv/) – Dependency & environment manager  

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd backend
````

### 2. Initialize project with uv

Make sure **uv** is installed globally.
If not, install first:

```bash
pip install uv
```

Initialize the project:

```bash
uv init
```

This will create a `pyproject.toml` file.

### 3. Add dependencies

```bash
uv add fastapi uvicorn openai-agents edge-tts python-dotenv
```

Now your dependencies are stored in `pyproject.toml`.

### 4. Environment variables

Create a `.env` file in the backend folder:

```env
GEMINI_API_KEY=your_api_key_here
```

### 5. Run locally

```bash
uv run uvicorn main:app --reload
```

Backend will run at:
👉 [http://localhost:8000](http://localhost:8000)

---

## 📦 Deployment (Koyeb / Render / Fly.io)

1. Push this folder to GitHub.

2. On your cloud platform, select this repo.

3. Set the **Start Command**:

   ```bash
   uv run uvicorn main:app --host 0.0.0.0 --port 8000
   ```

4. Add environment variable:

   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

✅ Now your backend API is live!