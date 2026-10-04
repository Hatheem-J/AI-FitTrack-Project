# AI FitTrack — First Model Frontend (Video Style)

Frontend-only React/Vite build styled to match the supplied `AI FitTrack(3).mp4` reference: light grey workspace, white top navigation, compact cards, indigo actions, horizontal user/admin navigation, Gemini search, AI Recommendation, Fitness Insights, Profile, Admin Console and floating chatbot.

## Run

```powershell
Copy-Item .env.example .env
npm install
npm run dev
```

Backend default: `http://localhost:5000/api`.

## Search implementation UI

The Workout Search page keeps the implemented Smart Semantic, Atlas Text and Atlas Vector search options while preserving the reference layout.

## Demo buttons

The login screen includes Demo User / Demo Admin quick-access buttons to match the reference video. Configure their credentials in `.env` with the optional `VITE_DEMO_*` variables. No credentials are bundled in this ZIP.
