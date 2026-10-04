# AI FitTrack — Sam Team Search Implementation

This backend now contains implementation support for the three previously missing requirements:

1. Semantic Search using Google Gemini embeddings (`gemini-embedding-001`, 768 dimensions by default).
2. MongoDB Atlas Search using the `workout_text_search` search index.
3. MongoDB Atlas Vector Search using the `workout_vector_search` vector index.

## API contracts

All workout search routes require JWT authentication.

- Existing lexical search: `GET /api/workouts/search`
- Semantic search: `GET /api/workouts/search/semantic?q=<text>&provider=auto|local|atlas&limit=10`
- Atlas text search: `GET /api/workouts/search/atlas?q=<text>&limit=10`

`provider=auto` uses Atlas Vector Search when `ATLAS_VECTOR_SEARCH_ENABLED=true`; otherwise it uses Gemini embeddings plus local cosine ranking.

## Required environment values

Copy `.env.example` to `.env` and configure secrets locally. Do not commit `.env`.

For live Atlas use:

```env
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
GEMINI_EMBEDDING_DIMENSIONS=768
ATLAS_SEARCH_INDEX=workout_text_search
ATLAS_VECTOR_INDEX=workout_vector_search
ATLAS_SEARCH_ENABLED=true
ATLAS_VECTOR_SEARCH_ENABLED=true
```

Only enable the Atlas flags after both indexes are READY / queryable.

## Developer verification commands

```powershell
npm install
npm run verify:search
npm run search:backfill
npm run search:indexes
npm run search:status
npm start
```

Index creation is asynchronous in Atlas. `npm run search:status` should eventually report both required indexes as `READY` and `QUERYABLE: true`.

Live Atlas and Gemini verification still requires valid project credentials and an Atlas deployment; static/source verification alone does not prove live cloud behavior.
