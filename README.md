# Resume Optimizer

[Live Demo](https://resumeanalizer.vercel.app/) • [GitHub Repo](https://github.com/mahmud-r-farhan/resume-analiser)

A **MERN stack** web application to optimize your CV/resume using AI. Upload your CV, input a job description, and get AI-powered suggestions, scoring, and insights to improve your chances of getting noticed.

---

## Features

- **Upload PDF CV** – Supports text-based PDFs (scanned images not supported).  
- **Job Description Input** – Analyze your CV against a specific job posting.  
- **AI-Powered Analysis** – Get actionable suggestions, ATS scoring, and improvement tips using OpenRouter free LLM models.  
- **Error Handling** – Handles API rate limits gracefully.  

---

## Demo

Try it online: [https://resumeanalizer.vercel.app/](https://resumeanalizer.vercel.app/)

---

## Tech Stack

- **Frontend:** React.js  
- **Backend:** Node.js + Express.js  
- **Database:** Optional / can be extended for history storage  
- **AI:** OpenRouter free LLM models  

---

## Setup

1. **Clone the repository**

```bash
git clone https://github.com/mahmud-r-farhan/resume-analiser.git
cd resume-analiser
````

2. **Setup Backend & Frontend**

Follow the instructions in `backend/README.md` and `frontend/README.md` to install dependencies.

3. **Get OpenRouter API Key**

Sign up for a free API key: [OpenRouter](https://openrouter.ai/)

4. **Run the App**

```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Limitations

* Free LLM models may have **rate limits**; errors are possible.
* **PDF must be text-based**; scanned PDFs are not supported.
* No **authentication or user history** yet.

---

## Future Improvements

* Add **CV visualization** – highlight suggested improvements directly in the PDF.
* Use **multiple LLMs in parallel** to enhance scoring and suggestions.
* Add **user accounts and history storage**.
* Support **scanned PDFs** using OCR integration.

---

## References

* OpenRouter Docs: [https://openrouter.ai/docs](https://openrouter.ai/docs)

---

## Contribution

Contributions are welcome! Feel free to open issues or submit pull requests.

---
