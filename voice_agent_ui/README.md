
# 🎨 Voice Agent Frontend (Next.js)

This is the **frontend application** of the Voice Agent project.  
It provides a simple UI to interact with the backend, send text, and play AI-generated voice responses.

---

## ✨ Features

- Built with [Next.js](https://nextjs.org) (App Router)  
- UI components with **Tailwind CSS**  
- Icons via **Lucide React**  
- Animations with **Framer Motion**  
- Sends requests to backend `/ask` endpoint  
- Plays audio responses from backend  

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org) – React framework  
- [Tailwind CSS](https://tailwindcss.com) – Styling  
- [Lucide React](https://lucide.dev) – Icons  
- [Framer Motion](https://www.framer.com/motion/) – Animations  

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd frontend
````

### 2. Install dependencies

Make sure you have **Node.js 18+** installed.
Then install packages:

```bash
npm install
```

### 3. Configure Backend API

Update the API base URL inside your frontend code (e.g. in `utils/api.ts` or directly in your component) to point to the backend:

```ts
const API_URL = "http://localhost:8000"; 
// or replace with your deployed backend link
```

### 4. Run locally

```bash
npm run dev
```

Frontend will run at:
👉 [http://localhost:3000](http://localhost:3000)

---

## 📦 Deployment (Vercel)

1. Push the frontend folder to GitHub.
2. Go to [Vercel](https://vercel.com) and import your repo.
3. Set **Environment Variables** if needed (e.g. backend URL).
4. Click **Deploy**.

Now your frontend is live ✅

---

## 🔗 Connecting Frontend & Backend

* Backend runs on **Koyeb / Render / Fly.io** at something like:
  `https://your-backend-service.koyeb.app`

* Frontend (on Vercel) should call that URL instead of localhost.
  Example:

```ts
const API_URL = "https://your-backend-service.koyeb.app";
```

This way, one click on the frontend link will connect to your backend and the full project will work end-to-end 🎉

```

