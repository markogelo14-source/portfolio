# Portfolio Starter

This repository is a clean Next.js starter for your new portfolio. It already includes a homepage structure, editable content data, TypeScript, and linting so you can start customizing immediately.

## Stack

- Next.js App Router
- React + TypeScript
- ESLint
- Custom CSS with a local system typography stack

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the local dev server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Where to Edit

- `app/site-data.ts`: your name, contact links, featured work, timeline, and copy
- `public/photos/photo-titles.json`: photo titles shown in the Photos gallery
- `app/page.tsx`: homepage section structure
- `app/globals.css`: colors, layout, spacing, and the overall visual system

## Paper MCP

Paper MCP is already enabled globally in your Codex app configuration, so this repo does not need an additional project-local server config.

The active connection is defined in `~/.codex/config.toml`:

```toml
[mcp_servers.paper]
enabled = true
url = "http://127.0.0.1:29979/mcp"
```

Recommended workflow with this project:

1. Run `npm run dev`
2. Keep this repo open in Codex
3. Use Paper MCP to sketch artboards, inspect layout ideas, or translate sections from the running site into design explorations
4. Bring the chosen direction back into `app/page.tsx` and `app/globals.css`

## Next Steps

- Replace placeholder links and email addresses
- Swap the starter project cards with real case studies
- Add images, motion, and individual case-study pages as you grow the site
