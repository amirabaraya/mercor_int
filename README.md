# FlashLearn

FlashLearn is a full-stack flashcard study app built for the engineering demo assessment.

## Features

- User registration and login
- JWT-based authentication
- Protected deck and study routes
- Create flashcard decks
- Add cards to decks
- Study due cards one at a time
- Flip card to show the answer
- Mark answers as correct or incorrect
- Spaced repetition scheduling
- XP tracking

## Spaced Repetition Logic

- Correct answer:
  - Increments `correctCount`
  - Sets `nextReviewAt` to today plus `correctCount` days
  - Adds 10 XP

- Incorrect answer:
  - Resets `correctCount` to 0
  - Sets `nextReviewAt` to tomorrow

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Prisma
- SQLite
- JWT
- bcryptjs

## How to Run

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev