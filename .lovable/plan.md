

# Content Rewrite Implementation Plan

## Overview
This plan rewrites all landing page content to sound more human, professional, and emotionally intelligent. The tone will be founder-driven, career-focused, and motivational but grounded. All em dashes and robotic SaaS language will be removed.

---

## Typography Verification

The current typography system is correctly implemented:
- Sora for headlines (font-headline)
- Inter for body text (font-body)
- Space Grotesk for metrics (font-metric)
- Proper letter-spacing and line-height utilities defined

The typography classes are being applied across components, though some sections (AIInterviewerSection, AboutSection, CareersSection, CommunitySection) need the typography classes added for consistency.

---

## Content Changes by Section

### 1. Hero Section (Hero.tsx)

**Current Issues:**
- Content is overly abstract and SaaS-generic
- Uses metaphorical language that feels disconnected

**New Content:**

| Element | New Copy |
|---------|----------|
| Badge | "Preparation Made Simple" |
| Headline | "The Sky Is Not the Limit. It Is the Foundation." |
| Subheading | "Vyoman helps you prepare for the moments that define your future. Practice interviews, improve communication, and build confidence with intelligent tools designed for real growth." |
| Supporting Text | "Whether you are a student preparing for placements or a professional aiming higher, Vyoman gives you a structured way to practice, learn, and improve." |
| CTA 1 | "Start Practicing" |
| CTA 2 | "Explore AI Interviewer" |

**Card Updates:**
- Purpose-Built Intelligence: "Designed specifically for career preparation and interview success."
- Adaptive Learning: "The system evolves with your performance and experience level."
- Ethical AI First: "Your data, privacy, and growth remain our priority."

---

### 2. AI Interviewer Section (AIInterviewerSection.tsx)

**New Content:**

| Element | New Copy |
|---------|----------|
| Badge | "Now Available" |
| Headline | "Elevate Your Interview Preparation" |
| Main Paragraph | "Vyoman AI Interviewer simulates real interview environments through voice interaction and intelligent questioning." |
| Second Paragraph | "You speak naturally. The AI listens, evaluates, and responds with feedback that helps you refine both your answers and delivery." |
| CTA | "Try AI Interviewer" |
| Bottom Note | "Practice makes progress. Start your first session today." |

**Feature Cards:**
- Realistic Voice Interviews: "Practice speaking in real interview scenarios with natural conversation flow."
- Immediate Performance Feedback: "Receive clear insights on your responses, clarity, and delivery."
- Communication Analysis: "Understand how your tone, pace, and confidence come across."

**Bottom Card:**
- "The days of uncertain preparation are over. Vyoman helps you see exactly where you stand."

---

### 3. About/Philosophy Section (AboutSection.tsx)

**New Content:**

| Element | New Copy |
|---------|----------|
| Headline | "The Sky Is Not the Limit. It Is the Foundation." |
| Subheading | "Vyoman means sky in Sanskrit. We see the sky not as a limit but as the foundation that supports everything. Our platform is built on this belief." |

**Philosophy Card:**
- Title: "Our Philosophy"
- Content: "We believe preparation builds confidence, and confidence builds opportunity. Technology should support human growth, not replace it. Every feature within Vyoman is designed to strengthen your thinking, communication, and professional readiness. Our goal is simple. Help individuals present their true potential when it matters most."

**Differentiators (Updated):**
- Purpose-Built Intelligence: "We do not build AI for the sake of AI. Every feature is designed with a specific human need in mind."
- Adaptive Learning: "Our systems learn from your unique patterns, preferences, and goals. The more you use Vyoman, the better it becomes at helping you succeed."
- Ethical AI First: "We believe AI should enhance human capability, not replace human judgment. Our tools are transparent, explainable, and always keep you in control."
- Growth-Oriented Design: "Every interaction is an opportunity to learn something new. Our interfaces are designed to challenge you gently, helping you develop skills naturally over time."

**Principles (Updated):**
- Human-Centric AI: "We design AI to augment human capabilities. Our tools are intuitive partners that enhance your natural intelligence."
- Ethical Foundation: "Transparency, fairness, and accountability guide everything we build. Your privacy and trust come first."
- Continuous Evolution: "Just as learning never stops, neither does our platform. We constantly refine and improve based on real feedback."
- Clarity and Craft: "We believe in elegant solutions and precise execution. Every product reflects our dedication to quality."
- Long-term Vision: "We approach challenges with curiosity and patience. The future we are building is meant to last."

**Commitment Card:**
- "We are not just building software. We are building tools that help people grow, learn, and succeed. Join us on this journey."

---

### 4. Features Section (Features.tsx)

**New Content:**

| Element | New Copy |
|---------|----------|
| Headline | "Powerful Features for Interview Success" |
| Subheading | "Everything you need to practice, improve, and prepare with confidence." |

**Feature Cards (Updated):**
- AI Voice Interviews: "Practice speaking in real interview scenarios with natural conversation flow."
- Voice Analysis: "Get feedback on your tone, pace, and clarity through advanced voice recognition."
- Real-time Feedback: "Receive instant feedback on your answers and overall performance during practice."
- Performance Analytics: "Track improvement through structured reports and visual insights."
- Custom Question Banks: "Access questions tailored to your field and experience level."
- Mock Panel Interviews: "Practice with multiple AI interviewers to simulate panel scenarios."
- Instant Scoring: "Get immediate scores based on your interview performance."
- Privacy Protected: "Your practice sessions are completely private and secure."
- Flexible Scheduling: "Practice interviews on your schedule. No appointments or waiting required."

---

### 5. Community Section (CommunitySection.tsx)

**New Content:**

| Element | New Copy |
|---------|----------|
| Headline | "Made for Humans. Powered by Purpose." |
| Subheading | "Vyoman is more than a product. It is a growing community of learners, professionals, and builders who believe in continuous improvement. Members share insights, participate in mock sessions, and support each other's growth journeys." |

**Vision Card:**
- Title: "Our Vision for Community"
- Content: "We believe in the power of shared purpose. The Vyoman Community is a space where curiosity thrives and collaboration leads to real progress. Whether you are preparing for your first interview or your tenth, you will find support here."

**Features (Updated):**
- Exclusive Content: "Early access to new features and behind-the-scenes insights."
- Direct Access to Team: "Connect with our engineers, designers, and product leads."
- Collaborative Projects: "Work with other members on challenges and learning initiatives."
- Mentorship and Support: "Find guidance from experienced professionals and offer your own expertise."
- Events and Workshops: "Participate in virtual meetups, AMAs, and hands-on learning sessions."

**Audiences (Updated):**
- Career Seekers: "Get structured practice and clear feedback to improve your interview skills."
- Developers and Designers: "Collaborate on projects and refine your technical communication."
- Educators and Trainers: "Share insights and explore new ways to prepare students for success."
- Lifelong Learners: "Connect with people who value continuous improvement and growth."

**CTA Section:**
- Title: "Join the Movement"
- Content: "Join a growing community of people who are committed to preparation and continuous improvement. The Vyoman Community is where ideas take shape and progress happens together."
- CTA: "Join the Community"

---

### 6. Careers Section (CareersSection.tsx)

**New Content:**

| Element | New Copy |
|---------|----------|
| Headline | "Work with People Who Care About the Details" |
| Subheading | "We are building technology that impacts real lives. If you care about thoughtful design, ethical AI, and meaningful innovation, you will feel at home here. We value curiosity, ownership, and craftsmanship." |

**Values (Updated):**
- Attention to Detail: "We believe that excellence lives in the details. Every line of code, every design decision, every user interaction matters."
- Long-term Thinking: "We are building for the future, not just the next quarter. Our decisions today shape what is possible tomorrow."
- Global Impact: "Our work reaches across continents and cultures, creating tools that empower people everywhere."

**Mission Card:**
- Title: "Our Mission"
- Content: "If you are driven by a desire to create tools that make a real difference in people's lives, and if you thrive in environments where rigor meets creative freedom, Vyoman might be the right place for you. We are looking for people who bring purpose, curiosity, and a collaborative spirit to everything they do."

**Join Our Team Card:**
- Title: "Join Our Team"
- Content: "Ready to shape the future of AI-powered career tools? We are always looking for people who share our vision of ethical, human-centric technology."
- CTA: "Explore Opportunities"

**Contact Card:**
- Title: "Get in Touch"
- Content: "Have questions about our products, partnerships, or want to say hello? We would love to hear from you."
- CTA: "Contact Us"

**Footer Message:**
- "At Vyoman, every team member is a stakeholder in our shared mission to create technology that genuinely serves people. We offer competitive compensation, comprehensive benefits, and the opportunity to work on products that make a real difference."

---

### 7. Pricing Section (Pricing.tsx)

**New Content:**

| Element | New Copy |
|---------|----------|
| Headline | "Simple, Transparent Pricing" |
| Subheading | "Start practicing for free. Upgrade when you are ready for deeper insights and unlimited sessions." |

No changes to plan details or features. The pricing structure remains the same.

---

### 8. Footer (Footer.tsx)

**New Content:**
- Description: "AI-powered tools to help you prepare for interviews, build your resume, and approach opportunities with confidence."
- Copyright: "2025 Vyoman. Built for career success."

---

## Technical Implementation

### Files to Modify

| File | Changes |
|------|---------|
| src/components/Hero.tsx | Rewrite all content with humanized copy, add missing typography classes |
| src/components/AIInterviewerSection.tsx | Rewrite content, add font-headline and font-body classes |
| src/components/AboutSection.tsx | Rewrite philosophy and principles, add typography classes |
| src/components/Features.tsx | Rewrite feature descriptions |
| src/components/CommunitySection.tsx | Rewrite all content, add typography classes |
| src/components/CareersSection.tsx | Rewrite content with grounded, human tone, add typography classes |
| src/components/Pricing.tsx | Update headline and subheading |
| src/components/Footer.tsx | Update description and branding |

---

## Writing Guidelines Applied

1. Short to medium length sentences
2. No em dashes or long hyphens
3. No buzzwords like "leverage," "synergy," "revolutionary"
4. No overly poetic metaphors
5. Focus on real outcomes and value
6. Confident but supportive language
7. Speaking directly to students and job seekers

---

## Implementation Order

1. Hero.tsx - The main entry point and first impression
2. AIInterviewerSection.tsx - Core product explanation
3. AboutSection.tsx - Philosophy and values
4. Features.tsx - Product capabilities
5. CommunitySection.tsx - Community value proposition
6. CareersSection.tsx - Team and hiring content
7. Pricing.tsx - Simple pricing updates
8. Footer.tsx - Final branding touch

---

## Expected Outcome

After implementation, all landing page content will:
- Sound human and founder-driven
- Be clear and concise
- Focus on real outcomes for career preparation
- Avoid robotic SaaS language
- Use consistent typography with Sora for headlines and Inter for body text
- Feel trustworthy and motivational without being preachy

