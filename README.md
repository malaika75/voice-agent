
## 💼 Career Agent AI

This is a smart career agent built with **Streamlit** and powered by **Gemini AI**. It helps users find **real-time job or freelance opportunities** based on their skills, role, and location — and sends those opportunities directly to their **email**.

---

### 🚀 Features

* AI-based job/freelance opportunity finder (Gemini 2.5 Flash)
* Real-time web search using browser tool
* Results sent to user’s email using Gmail SMTP
* Clean, simple UI using Streamlit

---

### 📋 How to Use

1. Run the app:

   ```bash
   streamlit run main.py
   ```

2. Fill the form with:

   * Name
   * Email
   * Skills
   * Preferred role & location...

3. AI will search live opportunities based on your info.

4. You’ll get an email with all the opportunities found.

---

### 🔐 Setup

1. Create a `.env` file:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_gmail_app_password
   ```

2. Install dependencies:

uv init career-agent       # ✅ Creates a new project folder with pyproject.toml
cd career-agent            # ✅ Move into the project directory
uv add openai-agents python-dotenv  # ✅ Install dependencies & update pyproject.toml
uv add streamlit #for UI


3. Make sure **2-step verification** is enabled on your Gmail, and generate an **App Password** to use as `SMTP_PASSWORD`.

---

### 🛠️ Tech Stack

* Streamlit
* Gemini 2.5 Flash
* Python SMTP
* OpenAI SDK (with external Gemini client)

---
