# GlossPlusOne (g+1)

**Immersion language learning, directly in your browser.**

Based on Krashen's i+1 hypothesis, g+1 selectively replaces words and phrases on any webpage gradually with their target language counterparts. Start with simple structural words and work your way up to advanced exploration vocabulary. 

## Features
- **Intelligent Text Selection:** Context-aware switching of structural and exploration words.
- **Snippet Confidence Tracking:** Visual cues fade as you master a word.
- **Hesitation Tracking:** Hover to reveal the native word, but doing so drops your confidence score, bringing the emphasis back.
- **Try Out Assessment:** Translate words right within the page to test your knowledge seamlessly.
- **Pronunciation Helper:** Hear accurate localized text-to-speech with ElevenLabs.

## Tech Stack
- React, Tailwind, Shadcn UI
- Chrome Extension (Manifest V3)
- Gemini API (Primary extraction/translation) & Groq (Fallback)
- Backboard.io (User narrative memory)
- ElevenLabs (Audio TTS)

## What's Next
- Progressive definition localization
- Server centralization for advanced processing
- Extending to videos and audio streams

**Note:** Took inspiration heavily from [GlossPlusOne on GitHub](https://github.com/sokmontrey/gloss-plus-one) to rebuild and iterate.
