# GlossPlusOne (g+1) — Architecture

## 1. Overview
GlossPlusOne (g+1) is built as a Chrome Extension (Manifest V3) that natively modifies web pages, utilizing service workers, AI LLM routing, and a content processing pipeline to enforce language immersion.

## 2. Tech Stack Setup
- **Extension Core**: Chrome Manifest V3 + TypeScript.
- **Frontend/UI**: React, Tailwind CSS, Shadcn UI.
- **Storage & Data**: Browser Local Storage for snippet banks. Moving to centralized remote database. Backboard.io for narrative memory about the user.
- **AI & Language Processing**: Gemini API for advanced snippet extraction, generation, and contextual parsing. Groq for rate-limited LLM fallbacks.
- **Audio Output**: ElevenLabs for voice generation.

## 3. Extension Architecture Layers

**Content Scripts:**
Injected into the webpage to scan text effectively despite non-linear HTML structures. Selectively replaces text targets based on user progression.
 
**Service Workers:**
Manages API requests, tracks the confidence state of snippets, and coordinates the components.
 
**AI Router:**
Intelligently dispatches translation and extraction prompts. Handles Gemini free-tier rate limits by falling back safely to Groq.

**Storage Layer:**
Handles snippet confidence states, hesitation points, vocabulary progression, and sync state.

**Audio Layer:**
Uses ElevenLabs API for accurate snippet pronunciation in the target language.

## 4. Key Challenges & Solutions
- **Webpage Extraction:** Web pages contain ads, navigational UI, etc. The DOM filtering logic is refined to isolate meaningful text nodes for modification without breaking rendering.
- **Gemini API Proxies / Fallbacks:** LLM parsing easily hits rate limits. Addressed using Groq provider fallback logic to balance requests.
