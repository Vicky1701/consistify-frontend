# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


Consistify – DSA Practice Tracker

## Project Overview
Consistify is a personal DSA consistency coach designed to help developers stick to their practice schedule through goal-setting, repetition reminders, and motivational nudges—all in a distraction-free environment. It introduces fresh motivators and unique naming conventions, making practice fun and memorable without copying streak-based systems.

## Phase 1 Features

### 1. Consistency Paths (Goal Setting)
Create a Consistency Path with:
- Customizable name (e.g., “7-Day Kickstart”, “DSA Reboot”)
- Duration (number of days)
- Daily Target (e.g., 2 problems/day)
- Repetition Cycle (e.g., repeat every 2 days)

### 2. Checkpoints (Problem Logging)
Manually enter problems:
- Problem Title
- Source (LeetCode/GFG/custom link)
- Tags (Arrays, DP, Graphs, etc.)
- Personal Notes
- Write & test code in a lightweight Java code editor

### 3. Memory Echo (Repetition Reminders)
- Smart scheduler for repetition reminders
- In-app notifications when it’s time to repeat problems
- Problems reappear in a “Review Board”

### 4. Progress Dashboard
- Consistency Meter: Bar fills as daily targets are met
- Momentum Rings: Circular progress for each Consistency Path
- Echo Score: Points for successfully repeated problems

### 5. Motivation Boost
- Celebration animations (fireworks/confetti on goal completion)
- Badges with unique names:
  - Pathfinder (first Consistency Path completed)
  - Echo Master (repeated problems for 3 cycles)
  - Unstoppable (daily target met for X days straight)
- Daily Dopamine Nudges: Fun, positive quotes after solving

### 6. Extra Features
- Notes section for each checkpoint
- Tag-based tracking (problems solved per topic)
- Daily recap popup (problems solved, due for repetition, progress meter)
- Custom reminder time setting
- Motivation quotes bank (rotating daily one-liners)

## Phase 1 Task List

### Initial Setup
**Frontend (React)**
- Set up React project (Vite or Create React App)
- Configure folder structure (components, pages, services, assets)
- Install UI library (Material-UI or Chakra UI)
- Set up routing (React Router)
- Set up API service layer (Axios)

**Backend (Java + PostgreSQL)**
- Set up Java backend project (Spring Boot recommended)
- Configure PostgreSQL database connection
- Set up basic project structure (controllers, services, repositories, entities)
- Implement CORS and REST API configuration
- Create initial database schema

### Feature Development
1. Consistency Path (Goal Creation)
	- Frontend: Build form, validate, connect to backend, display active paths
	- Backend: Entity/model, create/fetch endpoints, validation
2. Checkpoints (Problem Logging)
	- Frontend: Add form, display checkpoints, code editor
	- Backend: Entity/model, add/fetch endpoints, store code/notes/tags
3. Memory Echo (Repetition Reminders)
	- Frontend: Display reminders, notifications, mark repeated
	- Backend: Scheduler logic, fetch due checkpoints, track cycles/score
4. Progress Dashboard & Motivation
	- Frontend: Dashboard UI, badges, animations, quotes
	- Backend: Progress stats endpoints, badge logic, serve quotes
5. Extra Features
	- Frontend: Notes, tag tracking, daily recap, custom reminders
	- Backend: Store/fetch notes/tags, daily recap API, reminder time

### General Tasks
- Error handling and loading states
- Unit and integration tests
- Deployment scripts
- API and frontend documentation

## Unique Naming Summary
- Goals: Consistency Paths
- Problems: Checkpoints
- Repetition System: Memory Echo
- Progress Bar: Consistency Meter
- Circular Progress: Momentum Rings
- Repetition Points: Echo Score
- Badges: Pathfinder, Echo Master, Unstoppable

---
This file summarizes all features and tasks for Phase 1 development. Update as you progress!

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
