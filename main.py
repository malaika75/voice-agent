# main.py (backend)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from agents import Agent, Runner, AsyncOpenAI, OpenAIChatCompletionsModel
from dotenv import load_dotenv
import edge_tts
import os , re
from uuid import uuid4

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

app = FastAPI()

# allow frontend (adjust or restrict later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# serve only the audio folder
AUDIO_DIR = "audio"
os.makedirs(AUDIO_DIR, exist_ok=True)
app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")

# your agent client
client = AsyncOpenAI(api_key=api_key, base_url="https://generativelanguage.googleapis.com/v1beta/openai/")
model = OpenAIChatCompletionsModel(model="gemini-2.5-flash", openai_client=client)

agent = Agent(
    name="voice agent",
    model=model,
    instructions="You are a helpful voice assistant. Always respond in the same input language, keep answers short and conversational."
)

class TextInput(BaseModel):
    text: str

@app.post("/ask")
async def ask_agent(payload: TextInput):
    user_text = payload.text or ""
    # run the agent
    result = await Runner.run(starting_agent=agent, input=user_text)
    try:
        ai_text = result.final_output
    except AttributeError:
        ai_text = result.output_text

    # make unique filename for audio to avoid collisions
    fname = f"ai_{uuid4().hex}.mp3"
    file_path = os.path.join(AUDIO_DIR, fname)

    await edge_tts.Communicate(ai_text, voice="en-US-AvaMultilingualNeural").save(file_path)


    return {
        "user_text": user_text,
        "ai_text": ai_text,
        # frontend will prefix with http://localhost:8000 if needed; using absolute path is also fine:
        "audio_url": f"/audio/{fname}"  # note: we mounted /audio -> audio/ so frontend will use /audio/<fname>
    }
