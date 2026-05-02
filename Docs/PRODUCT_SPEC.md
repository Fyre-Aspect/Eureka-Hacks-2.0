# GlossPlusOne (g+1) — Product Specification

## 1. Vision
GlossPlusOne (g+1) is a browser extension that translates a selected subset of text on web pages into your target language, slowly building up the complexity until the user is fully immersed. Grounded in Krashen's i+1 hypothesis, it assumes that learning happens best when you are exposed to comprehensible input that is just one step beyond your current proficiency level.

## 2. Target Users
- Language learners looking to build fluency naturally without strict daily routines.
- People wanting to make their daily browsing time more productive.
- Users who need constant exposure (immersion) but do not live in a native speaking country.

## 3. Core Features

### 3.1 Intelligent Text Selection & Embedded Context Translation
g+1 finds and replaces two specific types of text snippets:
- **Structural Snippets:** Words that provide flow such as "that," "the," "is," or "this." Replacing these early on helps build a foundation.
- **Exploration Snippets:** General words, technical terms, or phrases (e.g., "software development", "bird"). 

### 3.2 Snippet Confidence Tracker
Tracks how strongly a snippet should be highlighted to indicate it is newly acquired. High confidence snippets blend naturally into the text, whereas lower confidence snippets pop out. 

### 3.3 Hesitation Tracker
Users can hover over a replaced snippet to see its original meaning in their native language. Doing so slightly reduces the confidence score of the snippet, making it structurally pop out more to encourage spaced repetition naturally.

### 3.4 Pronunciation Helper
Hovering over a snippet allows the user to listen to its accurate pronunciation in the target language.

### 3.5 Try Out (Self-Assessment)
A frictionless assessment system. Users can select any text snippet to add to their vocabulary bank. They can attempt to translate the snippet themselves, receiving a score, corrections, and feedback right on the page without navigating away to quizzes.
