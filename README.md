# Fillout Form Builder Navbar

A modern, Figma-inspired, responsive form builder navigation bar built with Next.js and React.

This project delivers a pixel-perfect, highly interactive navigation bar for a form builder, closely matching the design and UX of Figma's page/tab navigation. It demonstrates advanced UI/UX patterns, accessibility, and smooth drag-and-drop reordering.

## Features

- **Tab Bar:** Horizontal tabs for form pages, with icons, active/inactive states, and context menus.
- **Drag-and-Drop Reordering:** Smooth, accessible drag-and-drop for reordering tabs using [dnd-kit](https://dndkit.com/).
- **Add Page Between Tabs:** "+" button appears between tabs (on hover for desktop, always on mobile), overlaying a horizontal dotted line.
- **Context Menu:** Each tab has a menu (three dots) with actions: Rename, Duplicate, Delete, Set as First Page, Copy.
- **Horizontal Scroll:** Tab bar is horizontally scrollable with hidden native scrollbars, fading edge indicators, and arrow buttons for overflow.
- **Responsive Design:** Fully responsive, with touch-friendly controls and adaptive layout for mobile and desktop.
- **Accessibility:** Keyboard navigation, focus states, and ARIA labels for all interactive elements.
- **SSR/CSR Safe:** Deterministic page IDs to avoid hydration mismatches.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router, React 19)
- [React](https://react.dev/)
- [dnd-kit](https://dndkit.com/) for drag-and-drop
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- Custom SVG icons and Figma-inspired UI patterns

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Credits

- Built for technical demonstration and UI/UX prototyping.
