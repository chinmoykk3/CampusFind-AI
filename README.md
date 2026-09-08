# CampusFind AI 🎓🤖

CampusFind AI is an intelligent, automated Lost and Found platform built specifically for university campuses. It leverages multimodal AI (NLP & Computer Vision) to automatically match lost items with found items based on semantics, images, dates, and locations.

## Features ✨

- **Multimodal AI Matching:** Combines text similarity (descriptive properties), image signatures, category relevance, context heuristics, and timing scores.
- **Microservices Architecture:**
  - Express.js Backend (Authentication, Business Logic, Web APIs)
  - FastAPI AI Service (Hugging Face Transformers inference endpoint)
  - React + Vite Web Client (Beautiful Glassmorphism interfaces built with Tailwind CSS v4 and Framer Motion)
- **Role-based Authentication:** Independent student dashboards and administrative moderation panels.
- **Comprehensive UX:** Dynamic routing, skeleton loaders, protected sessions, and unified design token logic.

## Technology Stack 🛠️

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, Zustand, React Router DOM, Axios, Lucide React, Recharts.
- **Backend API**: Node.js, Express, MongoDB (Mongoose), JWT Auth.
- **AI Engine**: Python 3, FastAPI, sentence-transformers, PyTorch 2, scikit-learn.

## Folder Structure 📁

```
CampusFind-AI/
├── ai-service/        # Python FastAPI engine (Similarity models)
├── backend/           # Node.js backend (Core APIs & Database)
├── web/               # React Vite client (User & Admin interfaces)
├── admin/             # (Placeholder / Included in web routes)
├── docs/              # Additional design documents
└── tests/             # QA and specific tests
```

## Setup Instructions 🚀

### 1. Database Setup

Ensure you have MongoDB running locally or a MongoDB Atlas URI.

1. `cd backend`
2. Create `.env` (copy `.env.example`).
3. Set `MONGODB_URI` properly.

### 2. Run the AI Service

1. Navigate to the AI service: `cd ai-service`
2. Install python dependencies: `pip install -r requirements.txt`
3. Check and load models: `python main.py`
The AI service automatically exposes matching algorithms on port `8000`.

### 3. Run the Backend API

1. Navigate to backend: `cd backend`
2. Run installation: `npm install`
3. Optional: Create initial admin users by running `npm run create-admin`
4. Start the server: `npm run dev` (Runs on port `5000` by default).

### 4. Run the Web Interface

1. Navigate to web frontend: `cd web`
2. Install specific packages: `npm install --legacy-peer-deps`
3. Run the vite client: `npm run dev`
4. Open your browser at `http://localhost:5173`.

## AI Matching Explanation 🧠

CampusFind-AI avoids trivial keyword searching.
When a new item is found, the system compares it against unresolved records. The node wrapper (`matching.service.js`) asynchronously requests semantic vectors from the Python Inference engine and applies a weighted scoring algorithm:

- Text + Metadata: ~45%
- Pre-defined categorics: ~25%
- Spatiotemporal metrics (Location / Time): ~30%
Overall match yields exceeding **70%** triggers an automated notification and populates on the AI match dashboards.

## API Overview 📡

- `/api/auth/***` : User management & JWT endpoints.
- `/api/reports/***` : CRUD logic for Lost, Found reports.
- `/api/matching/***` : Inference proxy endpoints for automated match suggestions.
- `/api/categories` & `/api/locations` : Static enum endpoints.

## Future Enhancements 🔮

- **Mobile app companion** via React Native (see `/mobile` shell directory).
- Native push notifications via WebSockets.
- Fully fledged image similarity indexing.

*Developed iteratively with ❤️.*
