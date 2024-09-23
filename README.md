# Elikita Project

AI-Powered Healthcare for Rural Africa

## Project Overview

Elikita is an innovative project aimed at empowering healthcare practitioners in rural Africa with AI-powered solutions. This application leverages Next.js 14, Supabase and Azure technologies to provide a robust, scalable platform for improving healthcare delivery in underserved areas.

## Folder Structure

1. Root Directory:
   - `app/`: Main directory for Next.js 14 App Router.
   - `components/`: Reusable React components.
   - `utils/`: Utility functions and helpers.
   - `public/`: Static assets like images.

2. App Directory (`app/`):
   - Uses Next.js 14's App Router.
   - Each folder represents a route, with `page.tsx` as the main component.
   - `layout.tsx` files define layouts wrapping page components.
   - `(auth-pages)/`: Group for authentication-related pages.

3. Components Directory (`components/`):
   - Contains reusable React components.
   - `ui/`: Basic UI components (buttons, inputs, etc.).
   - `tutorial/`: Components specific to tutorial sections.

4. Utils Directory (`utils/`):
   - Contains utility functions, including Supabase client creation and middleware.

5. Public Directory (`public/`):
   - Stores static assets that are publicly accessible.

6. Configuration Files:
   - `next.config.js`: Next.js configuration.
   - `tailwind.config.js`: Tailwind CSS configuration.
   - `tsconfig.json`: TypeScript configuration.

## Key Files

- `app/page.tsx`: Main landing page component.
- `app/layout.tsx`: Root layout component.
- `app/actions.ts`: Server actions for form submissions.
- `middleware.ts`: Next.js middleware for handling requests.

## Routing

1. File-based Routing: Next.js uses the file system for routing.
2. Dynamic Routes: Folders with names in square brackets create dynamic routes.
3. Route Groups: Folders in parentheses are used for organizing without affecting the URL structure.
4. Layouts: `layout.tsx` files apply to all pages within their directory and nested subdirectories.
5. Server Components: By default, all components in the `app/` directory are React Server Components.
6. Client Components: Add `'use client'` at the top of the file to make a component a Client Component.

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (copy `.env.example` to `.env.local` and fill in the values)
4. Run the development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Features

- AI-powered chat interface for healthcare consultations
- Secure authentication and authorization
- Session management for persistent user experiences
- Responsive design for various devices

## Contributing

We welcome contributions to the Elikita project. Please read our contributing guidelines before submitting pull requests.


Microsoft Hackathon Project 2024
