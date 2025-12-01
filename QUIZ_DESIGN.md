# Comprehensive Onboarding Quiz Design

## Overview
This document outlines the design for the one-time onboarding quiz for the Device Recommendation App. The goal is to gather deep insights into the user's lifestyle, usage patterns, and preferences to provide highly personalized recommendations.

## Core Philosophy
- **Conversational**: Questions should feel like a chat with a friend.
- **Insight-Driven**: Every question must feed into the recommendation algorithm.
- **User-Centric**: Focus on the user's needs, not just specs.

## Quiz Structure
The quiz is divided into 5 sections with a total of ~20 questions.
1.  **The Basics & Lifestyle** (Understanding the user's world)
2.  **Usage & Habits** (How they interact with tech)
3.  **Current Tech Ecosystem** (What they already have)
4.  **Preferences & Priorities** (What matters most)
5.  **Pain Points & Future** (Solving problems and looking ahead)

---

## Section 1: The Basics & Lifestyle

### Q1. Welcome! To get started, how would you describe your primary daily grind?
*   **Type**: Single Choice (Card Selection with Icons)
*   **Options**:
    *   **Student**: "Juggling classes, assignments, and campus life."
    *   **Creative Professional**: "Designing, editing, or creating content daily."
    *   **Corporate/Office**: "Meetings, emails, and professional workflows."
    *   **Remote/Hybrid Worker**: "Working from home, cafes, or anywhere with Wi-Fi."
    *   **Entrepreneur/Business Owner**: "Running the show, always on the go."
    *   **Tech Enthusiast/Gamer**: "Living on the bleeding edge of tech."
    *   **Casual User**: "Just need things to work simply and reliably."
*   **Insight**: Sets the baseline persona. Adjusts weightings for portability, performance, or battery life.

### Q2. How does your day usually look regarding movement?
*   **Type**: Single Choice (Slider or Visual Scale)
*   **Options**:
    *   **Stationary**: "Mostly at a desk/home."
    *   **Commuter**: "Daily commute (train/bus/car)."
    *   **Nomad**: "Always moving, travel frequently for work/leisure."
    *   **Active**: "Gym, outdoors, and active lifestyle."
*   **Insight**: Determines importance of Portability, Durability, and Battery Life.

### Q3. When you're not working/studying, what's your go-to downtime activity?
*   **Type**: Multiple Choice (Select up to 3)
*   **Options**:
    *   **Streaming**: Netflix, YouTube, Movies.
    *   **Gaming**: AAA titles, competitive, or casual.
    *   **Reading/Browsing**: News, eBooks, social media.
    *   **Creative Hobbies**: Photography, music, digital art.
    *   **Fitness/Outdoors**: Running, hiking, sports.
    *   **Socializing**: Video calls, messaging, social apps.
*   **Insight**: Prioritizes Display (Streaming), GPU/Performance (Gaming), Camera (Creative), or Durability (Fitness).

---

## Section 2: Usage & Habits

### Q4. Which of these sounds most like your digital workflow?
*   **Type**: Single Choice
*   **Options**:
    *   **Focus Mode**: "I do one thing at a time, deeply."
    *   **Multitasker**: "I have 50 tabs open and 3 apps running."
    *   **Creator**: "I'm constantly editing, rendering, or compiling."
    *   **Consumer**: "I mostly watch, read, and listen."
*   **Insight**: RAM requirements (Multitasker), CPU/GPU power (Creator vs Consumer).

### Q5. How much time do you spend on your primary device daily?
*   **Type**: Slider (Hours)
*   **Range**: < 2 hours to 12+ hours
*   **Insight**: Battery life importance, Ergonomics, Display comfort (Eye care).

### Q6. Content Creation vs. Consumption Ratio?
*   **Type**: Slider (0% Creation - 100% Creation)
*   **Insight**:
    *   High Consumption: Focus on Display, Audio, Battery.
    *   High Creation: Focus on Processor, RAM, Storage, Color Accuracy.

---

## Section 3: Current Tech Ecosystem

### Q7. Which ecosystem feels like "home" to you right now?
*   **Type**: Single Choice
*   **Options**:
    *   **Apple Garden**: "iMessage, iCloud, iPhone are my life."
    *   **Google/Android**: "Google Workspace, Android, Assistant."
    *   **Windows/Microsoft**: "Office 365, PC gaming, Windows productivity."
    *   **Mixed/Agnostic**: "I use the best tool for the job, regardless of brand."
*   **Insight**: Ecosystem lock-in, compatibility checks, OS recommendations.

### Q8. What devices do you currently own and use regularly?
*   **Type**: Multi-Select (Checkbox with Icons)
*   **Options**: Smartphone, Laptop, Tablet, Smartwatch, Wireless Earbuds, Desktop PC, Game Console.
*   **Insight**: Cross-device synergy opportunities (e.g., Samsung phone + tablet, iPhone + Mac).

### Q9. How tech-savvy would you say you are?
*   **Type**: Single Choice (Likert Scale equivalent)
*   **Options**:
    *   "I need help setting up Wi-Fi." (Novice)
    *   "I can troubleshoot basic issues." (Average)
    *   "I build my own PCs / root my phones." (Expert)
*   **Insight**:
    *   Novice: Prioritize Ease of Use, Support, Reliability (Apple/Pixel).
    *   Expert: Prioritize Customizability, Specs, Features (Android/Windows/Linux).

---

## Section 4: Preferences & Priorities

### Q10. When buying new tech, what's your budget philosophy?
*   **Type**: Single Choice
*   **Options**:
    *   **Value Hunter**: "Best bang for the buck. I love a good deal."
    *   **Balanced**: "Willing to pay for quality, but not unnecessary luxury."
    *   **Premium**: "I want the best experience and build quality, price is secondary."
    *   **Future-Proofer**: "I spend more now so it lasts longer."
*   **Insight**: Price sensitivity weighting.

### Q11. Rank these features in order of importance to you (Drag and Drop):
*   **Type**: Ranking
*   **Items**:
    1.  Performance & Speed
    2.  Battery Life
    3.  Camera Quality
    4.  Display & Screen Quality
    5.  Portability & Design
    6.  Durability
*   **Insight**: The core weighting mechanism for the recommendation engine.

### Q12. Aesthetically, what draws you in?
*   **Type**: Visual Choice (Images of devices)
*   **Options**:
    *   **Minimalist**: Clean lines, simple colors (e.g., MacBook, Pixel).
    *   **Industrial/Rugged**: Durable, functional (e.g., ThinkPad, Rugged phones).
    *   **Gamer/Bold**: RGB, aggressive lines, high contrast.
    *   **Elegant/Luxury**: Premium materials, gold/silver accents.
*   **Insight**: Design preferences for specific model recommendations.

### Q13. Are you open to trying new brands, or do you stick to what you know?
*   **Type**: Single Choice
*   **Options**:
    *   **Loyalist**: "I stick to my trusted brands."
    *   **Open-Minded**: "I'm willing to switch if the product is better."
    *   **Adventurous**: "I love trying new and niche brands."
*   **Insight**: Brand filtering strength.

---

## Section 5: Pain Points & Future

### Q14. What is the biggest frustration with your CURRENT device?
*   **Type**: Single Choice
*   **Options**:
    *   "Battery dies too fast."
    *   "It's getting slow/laggy."
    *   "Storage is full."
    *   "Camera takes bad photos."
    *   "Screen is cracked/bad quality."
    *   "It's too heavy/bulky."
    *   "Nothing, just want an upgrade."
*   **Insight**: Immediate problem to solve. Boosts score of devices solving this specific pain point.

### Q15. How long do you typically keep a device before upgrading?
*   **Type**: Single Choice
*   **Options**:
    *   "1-2 years (I like the new stuff)"
    *   "3-4 years (Standard cycle)"
    *   "5+ years (Until it dies)"
*   **Insight**:
    *   Short cycle: Resale value matters (Apple/Samsung).
    *   Long cycle: Reliability, repairability, and software support longevity matter.

### Q16. Are you interested in emerging technologies?
*   **Type**: Multi-Select
*   **Options**:
    *   Foldable Screens
    *   AI Features (On-device AI)
    *   AR/VR Compatibility
    *   Sustainable/Eco-friendly materials
*   **Insight**: Flags for specific feature sets (e.g., Galaxy Fold, Pixel AI features).

---

## UI/UX Suggestions

### Components
*   **Cards**: Large, clickable cards with icons/illustrations for single-choice questions.
*   **Sliders**: Smooth, interactive sliders for budget and usage time.
*   **Drag & Drop**: For ranking priorities.
*   **Progress Bar**: A subtle bar at the top indicating "% Complete".
*   **Transitions**: Smooth fade/slide transitions between questions.

### Tone & Microcopy
*   **Encouraging**: "Great choice!", "Almost there...", "This helps us narrow it down."
*   **Helpful**: Tooltips for technical terms (e.g., explaining "Ecosystem").
*   **Non-Judgmental**: All answers are valid.

## Validation & Logic
*   **Skip Logic**:
    *   If Q1 = "Gamer", ask specific gaming questions (Genre, Portable vs Desktop).
    *   If Q3 includes "Photography", ask about Camera importance (Video vs Stills).
*   **Validation**:
    *   Required fields: Most should be required, but allow "Skip" for sensitive ones (like budget if uncomfortable, though unlikely).
    *   Multi-select: Enforce min/max selections where appropriate (e.g., "Select top 3").

## Output Data Structure
The quiz will generate a `UserPreferenceProfile` object:
```json
{
  "lifestyle": { "type": "student", "mobility": "commuter" },
  "usage": { "primary": ["streaming", "social"], "multitasking": "high" },
  "tech_context": { "ecosystem": "apple", "expertise": "average" },
  "priorities": { "ranked": ["battery", "camera", "performance"] },
  "budget": { "type": "balanced" },
  "pain_points": ["battery"],
  "future": { "upgrade_cycle": 3, "interests": ["ai"] }
}
```
This object will be passed to the recommendation engine to score and rank devices.
