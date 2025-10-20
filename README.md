# Next.js App with shadcn/ui

A modern web application built with Next.js 15, TypeScript, Tailwind CSS, and beautiful shadcn/ui components. This project also includes MCP (Model Context Protocol) configuration for Firecrawl integration.

## Features

- ⚡ **Next.js 15** with App Router
- 🎨 **shadcn/ui** components with Tailwind CSS
- 🔒 **TypeScript** for type safety
- 🌙 **Dark mode** support
- 🔧 **ESLint** configuration
- 🤖 **MCP** integration with Firecrawl

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Package Manager**: npm

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── globals.css     # Global styles with shadcn/ui theme
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page
├── components/         # React components
│   └── ui/            # shadcn/ui components
└── lib/               # Utility functions
    └── utils.ts       # shadcn/ui utilities
```

## Adding shadcn/ui Components

Add new shadcn/ui components using the CLI:

```bash
npx shadcn@latest add [component-name]
```

Available components include: button, card, input, select, dialog, and many more.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## MCP Integration

This project includes MCP configuration for Firecrawl in `.mcp.json`. This allows you to use web scraping and data extraction capabilities through Claude Code's MCP integration.
