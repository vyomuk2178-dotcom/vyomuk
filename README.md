# OpenLearn AI — Accessible Learning Assistant

> **"Learn anything. Understand everything."**

OpenLearn AI is a full-stack, accessible, open-source educational assistant designed to make complex academic material understandable for students, educators, and lifelong learners with varied learning needs.

---

## 🌟 The Real-World Problem

Learners worldwide face significant friction when studying:
- **Dense Academic Language:** Textbooks and research papers often obfuscate core principles behind academic jargon.
- **Language Divides:** High-quality STEM material is predominantly authored in English, isolating speakers of Hindi, Marathi, Spanish, and other regional languages.
- **Reading Difficulties & Fatigue:** Traditional document viewers provide little support for readers with dyslexia, ADHD, or visual impairments.
- **Need for Active Retention:** Passive reading results in low retention without instant flashcards, self-testing quizzes, and structured checklists.

OpenLearn AI acts as an **assistive comprehension companion** alongside teachers, textbooks, and primary curriculum without fabricating citations or hallucinating facts.

---

## ✨ Features

| Feature | Description |
| :--- | :--- |
| **Text Simplification** | 4 customizable comprehension tiers: *Beginner*, *School Student*, *High School*, and *University*. Generates mental models, plain definitions, analogies, and reflection questions. |
| **Academic Translation** | Preserves scientific nomenclature and formatting in Hindi, Marathi, Spanish, French, German, Japanese, and more with side-by-side verification. |
| **Study Notes Generator** | Structured revision outlines featuring core definitions, formula boxes, interactive exam checklists, and markdown exports. |
| **Flashcards & Quizzes** | 3D interactive flip-cards with keyboard controls (`Space` to flip, arrows to navigate) and 4-option multiple-choice quizzes with explanations. |
| **Listen & Learn (Audio)** | Synchronized sentence karaoke reader using the Web Speech API with adjustable speeds (0.7x - 1.5x) and optional verbal microphone questions. |
| **Offline Learning Library** | Local device persistence via `localStorage` with JSON export, keyword search, and granular item deletion. |
| **WCAG 2.2 AA Accessibility** | Dyslexia-friendly Lexend typography, text scaling up to 140%, high-contrast border modes, dark/light themes, and full keyboard-only navigation. |

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React, Canvas Confetti
- **Full-Stack Server:** Node.js, Express, Vite middleware mode (`tsx server.ts`)
- **AI Engine:** Google Gemini (`gemini-3.8-flash`) via the official `@google/genai` TypeScript SDK
- **Speech API:** Browser Web Speech API (`SpeechSynthesis` & `SpeechRecognition`)
- **Storage:** Client-side `localStorage` (Private, zero server persistence)

---

## 🚀 Quickstart & Local Setup

### 1. Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### 2. Clone Repository
```bash
git clone https://github.com/your-username/openlearn-ai.git
cd openlearn-ai
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Gemini API Key in `.env`:
```env
GEMINI_API_KEY="your-google-gemini-api-key"
PORT=3000
```
> *Note:* If no API key is provided, OpenLearn AI automatically operates in an honest **Demo Mode** with curated educational samples.

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Production Build & Execution
```bash
npm run build
npm start
```

---

## ⌨️ Accessibility & Keyboard Navigation

OpenLearn AI is built to adhere to WCAG 2.2 Level AA guidance:
- `Tab` / `Shift + Tab`: Traverse interactive buttons and form fields.
- `Spacebar` / `Enter`: Flip flashcards front-to-back.
- `Arrow Left` / `Arrow Right`: Step between cards in the study deck.
- `Escape`: Close accessibility drawer or active modal dialogs.
- `Skip to content`: Top-level focusable bypass anchor for screen-reader users.

---

## 🔒 Privacy & Data Guarantee

- **Zero Document Retention:** Uploaded files and pasted study text are processed strictly to fulfill the requested educational action and are not permanently saved on external servers.
- **Local Storage Isolation:** Saved flashcards and preferences reside exclusively in the user's browser.
- **No Telemetry Profiling:** No third-party ad trackers or fingerprinting scripts.

---

## 🤝 Contributing

We welcome contributions from educators, students, and software engineers! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for pull request guidelines.

---

## 📄 License

Distributed under the [MIT License](./LICENSE). Free for individual learners, educational institutions, and open-source development.
