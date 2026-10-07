# NO MERCY CV 💀🔥

> **AI-Powered Brutal CV Roasting Engine** — Because your resume is a crime scene, and we are here to inspect the evidence.

**NO MERCY CV** is a full-stack, highly interactive, premium Neo-Brutalist web application. Drop or paste your CV, select a recruiter personality, and watch your professional aspirations get roasted in real-time, accompanied by actual (albeit cynical) improvement tips.

---

## 🎨 Visual Identity & Styling
Built on **Neo-Brutalist** design principles:
- **Primary Color:** Toxic Coral (`#FF6B6B`)
- **Accents:** Vibrant Banana Yellow (`#FFDE4D`), Neon Cyan (`#00F0FF`), Neon Lime (`#74E291`)
- **Background:** Soft Warm Ivory (`#FDFBF7`)
- **Borders & Shadows:** Ultra-high contrast `4px` black borders (`#000000`) and flat `8px` box-shadows (no blur).
- **Typography:** Heavy headers (`Syne`/`Arial Black`) and monospace content (`JetBrains Mono`).

---

## ⚡ Features
- **Tactile Dropzone:** Drag and drop files (`.pdf`, `.docx`, `.txt`) natively. Watch the interface physically compress into its own shadow on hover.
- **Toxicity Selector:** Choose your judge:
  1. **Passive-Aggressive Recruiter:** Polite corporate speak that subtly makes you question your life.
  2. **Salty Startup Founder (Default):** Tech-bro condescension focused on grinding, equity, and sleeping under desks.
  3. **Unchecked Chaos:** Existential destruction. Direct attacks on your formatting, buzzwords, and career choices.
- **Dynamic Loader:** A blocky progress bar cycling through 10+ satirical checks (e.g., *[Measuring buzzword density...]*, *[Calculating parent disappointment...]*).
- **Typewriter Output:** The critique streams onto the screen letter-by-letter.
- **Violent Shaking Score Badge:** If your hireability score is under 20%, the score badge vibrates aggressively to signal emergency.
- **Actionable (but Cynical) Advice:** Provides 3-5 hyper-specific tips targeting actual bullet points and buzzwords in your CV.

---

## 🛠️ Tech Stack
- **Frontend:** Single-file HTML5, Vanilla JavaScript, and Premium Vanilla CSS.
- **Backend:** Node.js + Express.js.
- **File Parsers:** `pdf-parse` (PDF) and `mammoth` (DOCX).
- **AI Integration:** Google Gen AI Node SDK (`@google/genai`) powered by `gemini-2.5-flash`.

---

## 🚀 Local Installation

### Prerequisites
- Node.js (v18 or higher recommended)
- A Google AI Studio Gemini API Key

### Setup Steps
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the root directory (or edit the existing `.env`):
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key
   PORT=5000
   ```

3. **Start the local server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   Open your browser and navigate to **`http://localhost:5000`**.

---

## ☁️ Vercel Deployment

Deploy the full-stack application (serverless API + static frontend assets) directly to Vercel in seconds:

1. **Push your code** to a Git repository (GitHub/GitLab/Bitbucket).
2. **Import** the repository into Vercel.
3. In the project settings, add the following under **Environment Variables**:
   - **Key:** `GEMINI_API_KEY`
   - **Value:** *Your Google AI Studio Gemini API Key*
4. Click **Deploy**. Vercel will automatically read `vercel.json` and host your static files and API functions.

---

## 📄 License
MIT. Made for pure entertainment. Use at your own existential risk.
