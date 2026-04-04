# Financial Dashboard

A simple finance dashboard built with React, TypeScript, Vite, ShadCN and Tailwind CSS. It helps you track transactions, view spending trends, and move between pages like Dashboard, Transactions, Insights, and Settings.

## Local Setup

1. Make sure Node.js is installed on your machine. `npm` comes with Node.
2. Open the project folder in your terminal:
   ```bash
   cd financial-dashboard
   ```
3. Install the project dependencies:
   ```bash
   npm install
   ```
4. Start the app in development mode:
   ```bash
   npm run dev
   ```
5. Open the local URL shown in the terminal, usually `http://localhost:5173`.
6. When you want to check the production build locally, run:
   ```bash
   npm run build
   ```
7. If you want to preview the production build, run:
   ```bash
   npm run preview
   ```

### Helpful commands

- `npm run dev` starts the app for local development.
- `npm run build` checks TypeScript and creates the final production files.
- `npm run preview` lets you test the built app locally.
- `npm run lint` checks the code for style and quality issues.

## Approach

The app is built in small pieces so it stays easy to understand and update.

- Shared UI parts from ShadCN like buttons, cards, inputs, sheets, and sidebars live in `src/components/ui`.
- Layout pieces like the header, sidebar, and mobile nav live in `src/components/layout`.
- Feature-specific code lives in `src/features`, which keeps dashboard, transaction, insight, and settings logic separate from each other.
- The app uses a shared store for data, so updates to transactions or settings show up across the dashboard without extra page reloads.
- Routing is used to switch between pages cleanly, instead of putting everything into one large screen.

## Features

- Dashboard overview with summary cards, balance charts, and recent activity
- Transaction list where you can review income and expenses
- Transaction editor for adding or editing entries
- Insights page that shows spending patterns in a simple visual way
- Settings page for changing app preferences
- Sidebar navigation for desktop and bottom navigation for mobile
- Quick search with `Ctrl + K` to jump to different sections
- Theme toggle for switching the look of the app
- Role switcher in the sidebar footer for changing the user mode
