<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3B82F6,50:6366F1,100:8B5CF6&height=220&section=header&text=AI%20Workflow%20Bot&fontSize=50&fontColor=ffffff&fontAlignY=38&desc=Plan%20workflows%2C%20track%20progress%2C%20and%20get%20AI%20insights&descSize=18&descAlignY=60&animation=fadeIn" width="100%" alt="AI Workflow Bot banner" />

*A smart workflow management app that visualizes steps, calculates timelines, flags delays and uses Gemini AI to summarize progress.*

<br/>

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Gemini_API-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

</div>

---

## 📌 Overview

**AI Workflow Bot** helps you break any process (for example *Employee Onboarding*) into clear steps, assign owners, track status, and see at a glance whether you are on schedule. With one click, the built-in AI assistant reads the workflow and writes a summary and delay analysis.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗂️ **Multiple workflows** | Create any number of workflows from the sidebar, each with a name, start date and deadline. |
| 🧩 **Step editor** | Add, edit and delete steps. Each step has a name, owner, status and notes. |
| 📊 **Visual diagram** | A diagram of the workflow's steps updates as you edit them. |
| ⏱️ **Timeline calculation** | Duration in days is calculated automatically from the start date and deadline. |
| 🚨 **Delay detection** | Workflows past their deadline and not yet completed are flagged **Overdue** in the sidebar and header. |
| 🔄 **Automatic status** | Workflow status updates from its steps: *Pending → In Progress → Completed*. |
| 🤖 **AI Summary** | Generates a workflow analysis with Google Gemini and shows it in the "Bot Workflow Analysis" panel. |

### Status rules

- **Completed**: every step is *Completed* (and there is at least one step).
- **In Progress**: at least one step is no longer *Pending*.
- **Pending**: all steps are still *Pending*, or the workflow has no steps.
- **Overdue**: the deadline has passed and the workflow is not *Completed*.

---

## 🛠️ Tech Stack

| Area | Technology |
|---|---|
| **UI** | React 19, TypeScript |
| **Build tool** | Vite 6 with `@vitejs/plugin-react` |
| **Styling** | Tailwind CSS (CDN), Inter font |
| **Icons** | lucide-react |
| **AI** | Google Gemini via `@google/genai` |

---

## 📁 Project Structure

```text
ai-workflow-bot/
├── index.html              # App shell, Tailwind CDN and import map
├── index.tsx               # React entry point
├── App.tsx                 # Main UI: sidebar, workflow header, step editor, create modal
├── types.ts                # Workflow, WorkflowStep, WorkflowStatus types
├── components/
│   └── StepVisualizer.tsx  # Visual diagram of workflow steps
├── services/
│   └── geminiService.ts    # generateWorkflowSummary() - calls the Gemini API
├── vite.config.ts          # Dev server (port 3000) and API key injection
├── tsconfig.json
├── package.json
├── metadata.json
└── .env.local              # Your GEMINI_API_KEY (not committed)
```

---

## 🚀 Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/) (v18 or newer recommended) and a [Gemini API key](https://aistudio.google.com/app/apikey).

```bash
# 1. Clone the repository
git clone https://github.com/manjushriofc/<repo-name>.git
cd <repo-name>

# 2. Install dependencies
npm install

# 3. Add your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# 4. Start the dev server
npm run dev
```

Open **http://localhost:3000** in your browser.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

---

## 🧭 How to Use

1. Click **+** in the sidebar to create a workflow (name, start date, deadline).
2. Click **Add Step** and fill in the step name, owner, status and notes.
3. Update step statuses as work progresses and watch the workflow status and diagram update.
4. Click **AI Summary** for an AI-generated analysis of the workflow.

---

## 🔐 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes (for AI Summary) | Your Google Gemini API key, read from `.env.local` |

> ⚠️ **Security note:** `vite.config.ts` injects the key into the client bundle, so it is visible in the browser. This is fine for local use and demos. For a public deployment, move the Gemini call to a small backend and keep the key on the server. `.env.local` is already covered by `.gitignore` (`*.local`), so never commit it.

---

## ⚠️ Current Limitations

- **No persistence:** workflows are kept in memory, so refreshing the page clears them.
- **Single user:** there is no login, sharing or database.

---

## 🗺️ Possible Improvements

- Save workflows with `localStorage` or a backend database
- Drag-and-drop step reordering
- Step-level due dates and reminders
- Export workflows as PDF or CSV

---

## 🔗 Links

- **AI Studio app:** https://ai.studio/apps/drive/1lLAG07EhjG0_YGZ9mYQB4wQhxHVX8usp

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3B82F6,50:6366F1,100:8B5CF6&height=120&section=footer" width="100%" alt="Footer banner" />

</div>
