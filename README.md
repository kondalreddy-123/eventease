# EventEase AI — Your Smart Event Planner 🎊
> **Plan Smarter. Celebrate Better.**  
> An intelligent Generative AI-powered planning assistant for royal weddings, milestone birthdays, and community galas. Built with React, Vite, Tailwind CSS, Three.js, Recharts, Express.js, and Google Gemini API.

---

## 🌟 Executive Overview

**EventEase AI** streamlines the entire lifecycle of event management by pairing high-performance Generative AI (Google Gemini 3.8) with interactive 3D visual fidelity, dynamic budget analytics, timeline roadmaps, and vendor directory intelligence.

Whether you're organizing a 3-day Rajasthani destination wedding, a neon retro 30th birthday arcade bash, or a neighborhood eco-festival, EventEase AI calibrates recommendations, budgets, and timelines specifically to your cultural and financial parameters.

---

## 🚀 Key Feature Highlights

### 1. 🤖 AI Event Planner & Dossier Architect
- **Smart Questionnaire**: Captures event type (Wedding, Birthday, Community), guest headcount, target budget in Indian Rupees (INR ₹), decor aesthetics, catering preferences, cultural nuances, and venue layout.
- **Gemini 3.8 Plan Synthesis**:
  - Curated aesthetic title, tagline, description, and **5-swatch color palette with one-click hex code copying**.
  - Venue layout guidance and catering menu highlights.
  - Entertainment choreography, interactive photo-booth concepts, and ambient music playlists.
  - Detailed guest hospitality & RSVP logistics.
  - Suggested budget allocation across 8 categories matching target budget cap.
  - Preparation timeline milestones and vendor booking checklist.
  - Potential hazard identification & contingency mitigation plans.
- **Interactive Controls**: Instant plan regeneration with Gemini AI, PDF export, and direct line-item customization.

### 2. 📊 Smart Budget Manager & AI Cost Savings
- **Financial Analytics**: Total planned cap, estimated quotes, actual paid outflows, remaining cushion, and percentage utilized.
- **Budget Health Warnings**: Automatic high-priority alerts when commitments exceed planned budget.
- **Recharts Visualizations**:
  - **Category Share Donut Chart**: Visualizes spending proportions across venue, catering, decor, photography, entertainment, etc.
  - **Estimated vs. Actual Bar Chart**: Instant comparative audit per category.
- **Gemini AI Cost-Saving Recommendations**: Proactive value-preservation tips (e.g. menu rationalization, seasonal florals, off-peak timing) to bring over-budget plans back into balance.
- **Complete Line-Item CRUD**: Record, edit, categorize, and delete expenses with payment status tracking (Paid, Partial, Unpaid).

### 3. ⏱️ Timeline & Task Manager
- **Preparation Roadmap**: 8 calibrated milestones from concept locking to post-event settlement.
- **Dynamic Due Dates**: Tasks automatically adjust their deadlines relative to the target celebration date.
- **Task Management**: Create, edit, prioritize (High, Medium, Low), assign, and check off tasks.
- **Celebratory Micro-Interactions**: Completing milestones triggers celebratory canvas confetti bursts.
- **Multi-View Modes**: Switch between **Milestone Group View** and **Unified Checklist View**.

### 4. 🤝 Vendor Management & Comparison Engine
- **Directory**: Venues, Caterers, Decorators, Photographers, DJs/Entertainers, Florists, Transportation.
- **Contract Tracking**: Quoted price vs. agreed price, payment status, contact person, phone, email, and rating.
- **Side-by-Side Comparison Tool**: Compare shortlisted vendors within the same category on price, ratings, and inclusions.
- **Regulatory Transparency**: Clearly demarcates simulated/AI suggestions with sample data badges.

### 5. 💡 Dedicated Personalized AI Ideas Studio
- **Idea Categories**: Unique themes, decor concepts, food & menu twists, invitation wording, games & activities, return favors, photography concepts, and eco-friendly swaps.
- **Pin to Event**: One-click bookmarking of ideas directly into the active event's dossier.

### 6. 🎨 3D Features & Motion Design
- **Interactive Three.js Celebratory Canvas**: Floating polyhedral crystals, celebration rings, and glowing stardust particles that follow mouse movements with smooth inertia.
- **TiltCard 3D Physics**: Cards throughout the app tilt on mouse hover with realistic perspective and specular glare highlights.
- **Modern Color Palette**: Rich royal purple (`#7c3aed`), soft lavender, warm amber gold, and dark/light mode toggle.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Three.js, Recharts, Canvas Confetti |
| **Backend** | Node.js, Express.js, CORS, Dotenv, JWT, Bcrypt.js |
| **AI Integration** | Google Gemini API (`@google/genai` SDK with `gemini-3.8-flash` model + resilient fallback) |
| **Data Layer** | Persistent High-Performance JSON Store (`server/data/db.json`) + Optional MongoDB Atlas |
| **Architecture** | RESTful API with token-based authentication & instant 1-click Demo Mode |

---

## 📂 Project Structure

```
eventease-ai/
├── client/                     # Vite React Frontend
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx      # Sticky navbar with active event switcher & theme toggle
│   │   │   ├── ThreeCanvas.jsx # Interactive 3D Three.js celebration scene
│   │   │   ├── TiltCard.jsx    # 3D perspective mouse tilt card
│   │   │   └── Toast.jsx       # Floating notification alert system
│   │   ├── context/            # React Context state
│   │   │   ├── AuthContext.jsx # User auth, session tokens & Demo Mode
│   │   │   ├── EventContext.jsx# Active event, tasks, expenses, vendors, metrics
│   │   │   └── ThemeContext.jsx# Dark/Light mode theme state
│   │   ├── pages/              # 10 Application Pages
│   │   │   ├── LandingPage.jsx # Hero, live estimator slider, event pillars
│   │   │   ├── AuthPage.jsx    # Login, registration & 1-click Demo login
│   │   │   ├── DashboardPage.jsx # KPI stats, quick actions, mini charts
│   │   │   ├── CreateEventPage.jsx # Wizard form for Wedding/Birthday/Community
│   │   │   ├── EventPlanPage.jsx # AI plan, color swatches, venue advice, PDF
│   │   │   ├── BudgetPage.jsx  # Recharts graphs, expenses CRUD, AI savings
│   │   │   ├── TimelinePage.jsx# Milestones, task checklist, confetti
│   │   │   ├── VendorPage.jsx  # Vendor directory & comparison modal
│   │   │   ├── IdeasPage.jsx   # Dedicated AI ideas generator & bookmarks
│   │   │   └── SettingsPage.jsx# Event edits, health diagnostics, delete
│   │   ├── services/
│   │   │   └── api.js          # Centralized API fetch client
│   │   ├── App.jsx             # Main router and layout
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Tailwind & typography styling
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Express.js Backend API
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js         # JWT authorization middleware
│   │   ├── routes/
│   │   │   ├── auth.js         # Register, Login, Demo, Profile
│   │   │   ├── events.js       # Events, Tasks, Expenses, Vendors, Ideas CRUD
│   │   │   └── ai.js           # Gemini AI plan & cost saving routes
│   │   ├── services/
│   │   │   └── geminiService.js# Google GenAI SDK integration with fallback
│   │   ├── db.js               # Persistent JSON engine with cascade deletion
│   │   ├── server.js           # Express app, CORS, health endpoint
│   │   └── test-suite.js       # 10-step automated verification suite
│   ├── package.json
│   └── .env.example
├── .env.example                # Unified environment template
├── package.json                # Root package scripts
└── README.md                   # Full documentation
```

---

## ⚡ Quickstart & Local Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Step 1: Clone or Navigate to the Workspace
```bash
cd c:\Users\acer\Desktop\prompt
```

### Step 2: Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### Step 3: Configure Environment Variables
Copy `.env.example` to `.env` in `server/`:
```bash
cd server
cp .env.example .env
```
Inside `server/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=eventease-super-secret-jwt-key-2026
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If you leave `GEMINI_API_KEY` blank, the app will automatically operate in offline demo mode using its built-in rule-based heuristic planner without crashing!)*

### Step 4: Run the Application
In terminal 1 (start backend server):
```bash
cd server
npm start
# Server listens on http://localhost:5000
```

In terminal 2 (start frontend client):
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

Open your browser at **`http://localhost:5173`**!

---

## 🧪 Automated Testing

EventEase AI comes equipped with a 10-step automated test suite that validates health endpoints, authentication, event creation, AI plan generation, budget calculations, task completion, and vendor directories:

```bash
cd server
node src/test-suite.js
```

**Output:**
```
🧪 Starting EventEase AI Comprehensive Test Suite...
1. Testing Health Endpoint... ✓ Status 200 Healthy
2. Testing Demo Authentication... ✓ Token Acquired
3. Testing Event Listing... ✓ Found initial events
4. Testing Event Creation with Automatic AI Planning... ✓ Created
5. Testing AI Budget Intelligence & Cost Savings... ✓ Recommendations generated
6. Testing Personalized AI Ideas Generation... ✓ Ideas returned
7. Testing Expense Recording & Live Calculation... ✓ Expense recorded
8. Testing Timeline Task Creation and Completion... ✓ Task toggled
9. Testing Vendor Shortlisting... ✓ Vendor added
10. Testing Frontend Server Availability... ✓ Status 200 OK
🎉 ALL 10 TEST SUITE STEPS PASSED SUCCESSFULLY! 🚀
```

---

## 🌐 Production Deployment Guide

### A. Deploy Frontend to Vercel
1. Set the root directory to `client`.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build` (outputs to `dist/`).
4. Set Environment Variable:
   - `VITE_API_URL`: `https://your-backend-app.onrender.com/api`

### B. Deploy Backend to Render
1. Set Root Directory to `server`.
2. Environment: **Node**.
3. Build Command: `npm install`
4. Start Command: `node src/server.js`
5. Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `<generate-a-secure-random-string>`
   - `GEMINI_API_KEY`: `<your-gemini-api-key>`
   - `MONGODB_URI`: `<optional-mongodb-atlas-connection-string>`

---

## 🛡️ License

This project is licensed under the MIT License — feel free to customize and expand!
