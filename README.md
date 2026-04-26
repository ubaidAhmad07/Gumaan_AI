# 🎯 GUMAAN AI — Opportunity Inbox Copilot

An intelligent, AI-powered web application that automatically discovers, filters, and ranks opportunities (scholarships, internships, fellowships, competitions) from your email inbox. Stop manually sorting through dozens of opportunity emails — let AI do the heavy lifting.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-5.4.0-purple)
![Groq API](https://img.shields.io/badge/Groq%20API-llama--3.3--70b-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

- **📧 Smart Email Parsing** – Paste raw emails or upload files directly
- **🤖 AI-Powered Classification** – Distinguishes genuine opportunities from spam using Groq's Llama model
- **🎯 Intelligent Ranking** – Scores opportunities based on:
  - **Profile Fit** – Matches your academic program, CGPA, and skills
  - **Urgency** – Deadline proximity and time-sensitivity
  - **Completeness** – Data quality and actionability
- **📊 Interactive Dashboard** – Beautiful cards with checklists, score bars, and drill-down details
- **📥 Multi-Format Exports** – Download results as PDF or Excel spreadsheets
- **💾 Profile Persistence** – Your student profile is saved locally between sessions
- **⚡ Client-Side Only** – No backend required; all processing happens in your browser
- **🎨 Dark Mode UI** – Modern, accessible design with smooth animations

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **Groq API Key** ([Get one free here](https://console.groq.com/))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/gumaan-ai.git
cd gumaan-ai

# 2. Install dependencies
npm install

# 3. Create a .env file and add your Groq API key
echo "VITE_GROQ_API_KEY=your_api_key_here" > .env

# 4. Start the development server
npm run dev
```

The app will open at **`http://localhost:5173`**

### Build for Production

```bash
npm run build
# Output: dist/
```

Deploy to any static host (Vercel, Netlify, GitHub Pages, etc.)

---

## 📖 How to Use

### Step 1: Create Your Profile
Enter your name, academic program, and CGPA. Optional: Add skills, interests, and preferences.

### Step 2: Add Emails
- **Paste emails** directly (one per section, separated by `---`)
- **Upload a file** (plain text or multiple emails)
- **Load sample emails** (8 pre-written examples to test the AI)

### Step 3: Run Analysis
Click **"Submit Emails for Analysis"** and wait 10-20 seconds while the AI processes your emails.

### Step 4: Explore Results
- View ranked opportunities sorted by overall score
- Expand cards to see details: deadlines, eligibility, documents needed, benefits
- Check off action items as you complete them
- **Export to PDF** or **Export to Excel** for offline access

---

## 🏗️ Architecture

### Tech Stack

| Layer | Technology |
|-------|------------|
| **UI Framework** | React 18.3.1 |
| **Build Tool** | Vite 5.4.0 |
| **AI Provider** | Groq API (llama-3.3-70b-versatile) |
| **State Management** | React `useReducer` + Context API |
| **Styling** | Vanilla CSS (design tokens via CSS variables) |
| **Export** | jsPDF + SheetJS |
| **Icons** | Google Material Symbols |
| **Fonts** | Space Grotesk, Manrope, Inter |

### Project Structure

```
src/
├── main.jsx                           # React entry point
├── App.jsx                            # Root component & layout
├── index.css                          # Global design system
├── context/
│   └── AppContext.jsx                 # Redux-like state management
├── components/
│   ├── StudentProfileForm.jsx         # Step 0: Profile input
│   ├── EmailInput.jsx                 # Step 1: Email ingestion
│   ├── ResultsDashboard.jsx           # Step 2: Results view
│   ├── OpportunityCard.jsx            # Individual opportunity card
│   ├── LoadingIndicator.jsx           # Loading animation
│   ├── Stepper.jsx                    # Progress indicator
│   └── Header.jsx                     # App header
├── services/
│   └── aiService.js                   # Groq API integration
└── utils/
    ├── exportUtils.js                 # PDF & Excel export
    └── sampleEmails.js                # Demo email samples
```

### Data Flow

```
User Profile
    ↓
User Emails (paste/upload/sample)
    ↓
EmailInput Component (parse emails into array)
    ↓
aiService.js (build prompt + call Groq API)
    ↓
Groq API (llama-3.3-70b-versatile, JSON mode)
    ↓
JSON Response (opportunities + rejected emails)
    ↓
AppContext (save results to state)
    ↓
ResultsDashboard (render ranked opportunities)
    ↓
Export to PDF / Excel
```

---

## 🤖 AI Integration

### Model: Llama 3.3 70B (Groq)

The app uses Groq's hosted Llama 3.3 70B model for:
- **Fast inference** via LPU hardware
- **Large context window** (handles 10+ emails simultaneously)
- **JSON mode** (guarantees valid structured output)
- **Cost-effective** free-tier API

### Temperature: `0.3`
Low temperature ensures deterministic, consistent JSON output. Higher values risk malformed responses.

### Scoring Logic

The AI evaluates each opportunity across three dimensions:

| Score | Range | Meaning |
|-------|-------|---------|
| **Profile Fit** | 0–100 | How well it matches your program, CGPA, skills |
| **Urgency** | 0–100 | Deadline proximity; expired deadlines get low scores |
| **Completeness** | 0–100 | Info quality: link, docs, deadline, contact info |
| **Overall Score** | 0–100 | Weighted composite (used for ranking) |

**Opportunities are ranked by Overall Score (descending).**

---

## 🎨 UI Components

### `StudentProfileForm.jsx`
Gathers student info: name, program, CGPA, skills, interests, languages.
Persists to localStorage for session continuity.

### `EmailInput.jsx`
Flexible email ingestion:
- **Paste** multi-email blocks (separated by `---`)
- **Upload** text files
- **Load Samples** (8 pre-written demo emails)

### `ResultsDashboard.jsx`
Displays ranked opportunities with:
- Summary statistics (total found, rejected, average score)
- AI-generated insights
- Expandable opportunity cards

### `OpportunityCard.jsx`
Per-opportunity view:
- Badge (Scholarship / Internship / Fellowship / etc.)
- Score bars (Profile Fit, Urgency, Completeness, Overall)
- Deadline & organization
- Eligibility criteria & required documents
- Action checklist with tick-off functionality
- "Apply Now" link

### `LoadingIndicator.jsx`
Animated spinner + cycling status messages (2.5 seconds, then replaced by results).

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root:

```env
VITE_GROQ_API_KEY=gsk_your_key_here
```

Get your free API key at [console.groq.com](https://console.groq.com/).

**Note:** For production apps, route API calls through a secure backend proxy to avoid embedding keys in the client bundle.

---

## 📥 Export Formats

### PDF Export
- Header with title and profile summary
- Auto-table with opportunity summary (rank, type, deadline, score, next step)
- Detailed sections per opportunity (fit reasoning + action steps)
- Auto-paginates long reports

### Excel Export
- **Sheet 1 ("Opportunities")** – One row per opportunity; all fields sortable & filterable
- **Sheet 2 ("Student Profile")** – Key-value summary of your profile
- Filename: `opportunity-report.xlsx`

---

## 🛠️ Development

### Available Scripts

```bash
npm run dev       # Start dev server (localhost:5173)
npm run build     # Build production bundle
npm run preview   # Preview production build locally
```

### Development Workflow

1. Modify components in `src/components/`
2. Update state logic in `src/context/AppContext.jsx`
3. Styling in `src/index.css`
4. Changes hot-reload automatically (Vite)

### Key Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "jspdf": "^2.5.1",
  "jspdf-autotable": "^3.8.2",
  "xlsx": "^0.18.5"
}
```

---

## 🧠 State Management (AppContext)

### State Shape

```javascript
{
  // User Input
  profile: {
    name, program, cgpa, skills, interests, languages, ...
  },
  emailText: "...",
  
  // Processing
  step: 0,                    // 0=profile, 1=emails, 2=results
  isLoading: false,
  loadingMessage: "...",
  error: null,
  
  // Results
  results: {
    opportunities: [ {...}, {...}, ... ],
    rejected: [ {...}, {...}, ... ],
    summary: "..."
  },
  
  // Config
  apiKey: "gsk_..."
}
```

### Actions

| Action | Payload | Purpose |
|--------|---------|---------|
| `SET_PROFILE` | `profile` object | Update student profile |
| `SET_EMAIL_TEXT` | `emailText` string | Store raw email input |
| `SET_STEP` | `step` (0-2) | Navigate between steps |
| `SET_LOADING` | `{ isLoading, loadingMessage }` | Control loading state |
| `SET_RESULTS` | `{ opportunities, rejected, summary }` | Store AI results |
| `SET_ERROR` | `error` string | Display error message |
| `SET_API_KEY` | `apiKey` string | Update Groq API key |

---

## 🌟 Sample Emails

The app includes 8 realistic sample emails for testing:

1. **Chevening Scholarship** – Scholarship (genuine)
2. **Google STEP Internship** – Internship (genuine)
3. **Flash Sale Alert** – Spam (rejected)
4. **Microsoft Imagine Cup** – Competition (genuine)
5. **Meeting Notes Email** – Internal (rejected)
6. **DAAD Fellowship** – Fellowship (genuine)
7. **Netflix Expiry** – Notification (rejected)
8. **LUMS Financial Aid** – Financial Aid (genuine)

**Click "Load Sample Emails"** in Step 1 to demo the full workflow instantly.

---

## 🎯 Key Design Decisions

| Decision | Why |
|----------|-----|
| **Client-side only** | No backend infrastructure; easier hackathon submission |
| **Groq API** | Fast, free-tier, excellent JSON support |
| **useReducer + Context** | Complex inter-dependent state needs a reducer pattern |
| **Single CSS file** | Faster, all design tokens centralized via CSS variables |
| **localStorage** | Profile survives page refresh without auth |
| **Email regex parsing** | Flexible; handles `---` separators and `Subject:` lines |
| **Staggered animations** | `delay: rank * 60ms` creates professional cascading effect |

---

## ⚠️ Security Considerations

**This is a client-side app — the Groq API key is visible in the browser.**

For production:
1. Create a backend proxy that handles API calls
2. Store the Groq key on your server, not in `.env`
3. Validate & rate-limit requests server-side
4. Consider authentication for user data

Example backend pattern:
```
Client → Your Server (/api/analyze) → Groq API
```

---

## 🐛 Troubleshooting

### "Invalid Groq API key"
- Verify your key in `.env` is correct
- Check that it hasn't expired at [console.groq.com](https://console.groq.com/)

### "Rate limit exceeded"
- Groq free tier has rate limits (typically 30 requests/minute)
- Wait a moment and try again

### "Failed to parse AI response"
- The AI may have returned malformed JSON despite instructions
- Try again; the low temperature (0.3) minimizes this risk

### Emails not parsing correctly
- Ensure emails are separated by `---` or contain a `Subject:` line
- Check browser console for parse errors

---

## 📝 Development Notes

### Email Parsing Logic
```javascript
// Handles both formats:
const emails = emailText.split(/(?:---+|\n(?=Subject:))/);
```

### API Prompt Structure
- System message: Role description + JSON schema
- User message: Full context (profile + all emails) + scoring instructions
- Response format: `{ type: "json_object" }`

### Component Lifecycle
1. **App.jsx** – Routes between steps
2. **StudentProfileForm** – Collects profile, stores in context
3. **EmailInput** – Ingests emails, triggers `processEmails()`
4. **LoadingIndicator** – Waits for Groq response
5. **ResultsDashboard** – Renders ranked opportunities

---

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- [ ] Support for drag-and-drop email uploads
- [ ] Dark/light theme toggle
- [ ] Mobile responsiveness enhancements
- [ ] Additional export formats (CSV, JSON)
- [ ] Custom scoring weights
- [ ] Email history & favorites
- [ ] Integration with calendar apps

### Pull Request Process
1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

## 👨‍💻 Authors

**GUMAAN AI** was developed by:
- **Ubaid Ahmad**
- **Hafiz Abdullah**
- **Aaiz Ahmed**

*Information Technology University, Pakistan*

This was a **hackathon project** — built for innovation and demonstrating AI's power in student recruitment/opportunity discovery.

---

## 🔗 Useful Links

- **Groq API Docs** – [console.groq.com](https://console.groq.com/)
- **React Docs** – [react.dev](https://react.dev/)
- **Vite Docs** – [vitejs.dev](https://vitejs.dev/)
- **jsPDF Docs** – [github.com/parallax/jsPDF](https://github.com/parallax/jsPDF)
- **SheetJS Docs** – [sheetjs.com](https://sheetjs.com/)

---

## 📞 Support

Found a bug or have a suggestion?

1. **Check existing issues** on GitHub
2. **Open a new issue** with a clear description
3. **Include reproduction steps** if it's a bug
4. **Share sample emails** if relevant

---

**Built with ❤️ for students everywhere. Powered by AI. Simplifying opportunities.**
