# OpenLearn AI — Architectural Documentation

## System Topology

```
+-----------------------------------------------------------------+
|                       User Browser (SPA)                       |
|                                                                 |
|  +------------------+  +-----------------+  +----------------+  |
|  | Document Input   |  | Speech & STT    |  | Offline        |  |
|  | Dropzone / Text  |  | Web Speech API  |  | LocalStorage   |  |
|  +--------+---------+  +--------+--------+  +--------+-------+  |
|           |                     |                    |          |
|           |                     |                    |          |
+-----------|---------------------|--------------------|----------+
            | (HTTP /api/*)       |                    |
            v                     |                    |
+---------------------------------+                    |
|       Full-Stack Node.js Server                      |
|       (Express + Vite Middlewares)                   |
|                                                      |
|   /api/extract   /api/simplify   /api/translate      |
|   /api/notes     /api/activities /api/assistant      |
+-----------------------+------------------------------+
                        |
                        | Official @google/genai SDK
                        v
+------------------------------------------------------+
|            Google Gemini AI Engine                   |
|            (gemini-3.8-flash)                        |
|                                                      |
|  - Structured JSON Output Schema Validation          |
|  - Text simplification & analogical reasoning        |
|  - Multilingual academic translation                 |
|  - Multimodal text extraction for PDFs / images      |
+------------------------------------------------------+
```

## Security & Secrets Model
- The `GEMINI_API_KEY` is kept server-side only in `process.env.GEMINI_API_KEY`. It is never bundled into client-side code or transmitted to the browser.
- All requests proxy through `/api/*` endpoints which enforce schema validation, payload truncation (up to 25,000 characters), and clean error sanitation.
- In environments without an API key, the server safely downgrades to an honest Demo Mode without crashing.
