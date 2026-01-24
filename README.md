# Premium Resume Optimizer

[Live Demo](https://resumeanalizer.vercel.app/) • [GitHub Repo](https://github.com/mahmud-r-farhan/resume-analiser)

An AI-powered career copilot that help candidates personalise their resume for every job. Upload your PDF résumé, paste the target job description, and receive a premium analysis with a regenerated, ATS-friendly résumé that reflects the feedback.

---

## ✨ Highlights

- **Premium Analysis Dashboard** – Executive summary, strengths, keyword gaps, and ATS guidance rendered in rich cards with Markdown highlighting.
- **Dynamic Fit Score** – Visual gauge backed by AI scoring to show your alignment with the role.
- **markdown-native Resume Builder** – Generate, copy, and download a professional Markdown resume that renders perfectly in the app and in exported PDFs.
- **Template-aware Optimisation** – Switch between classic, modern, and functional layouts; regenerate with one click.
- **One-click Exports** – Save analysis as Markdown/PDF and download the optimised résumé as a polished PDF instantly.
- **Resilient UX** – Graceful loading states, rate-limit handling, and contextual callouts to guide the user journey.

---

## 🧱 Tech Stack

- **Frontend:** React, Vite, Framer Motion, Tailwind utilities, Sonner toasts 
- **Cross-Platform Mobile App:** Based on Flutter!
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB
- **AI Provider:** [OpenRouter](https://openrouter.ai/)

---

## 🚀 Getting Started

### 1. Clone and install

```bash
git clone https://github.com/mahmud-r-farhan/resume-analiser.git
cd resume-analiser
```

Install dependencies inside both workspaces:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

#### Backend (`backend/.env`)

```
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
APP_URL=http://localhost:5173

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_api_key_here

# MongoDB (Optional - remove if not using)
MONGO_URI=mongodb://localhost:27017/cv-optimizer

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
JWT_SECRET=

# Mailing
SMTP_USER=
SMTP_PASS=
```

> `MONGO_URI` is optional. When provided the service stores analysis logs for later insights.

#### Frontend (`frontend/.env`)

```
VITE_API_ENDPOINT=http://localhost:5005/api
```

### 3. Run the full stack

```bash
# In backend/
npm run dev   # or npm start

# In frontend/
npm run dev
```

Open the app at [http://localhost:5173](http://localhost:5173).

---

## 🧪 Usage Flow

1. Upload a PDF résumé (max 5 MB, text-based).  
2. Paste the job description (≥ 50 words recommended).  
3. Choose an OpenRouter model (several free presets provided).  
4. Review the premium analysis dashboard and fit score.  
5. Regenerate the résumé using your preferred template and download or copy the Markdown.

---

## ⚠️ Known Limitations

- Free OpenRouter models may throttle heavy usage; the UI surfaces friendly errors and retry messaging.
- Scanned or image-based PDFs are not yet supported (OCR pipeline is on the roadmap).

---

