# AI Chat Assistant — Take-Home Assessment

A Next.js chat application powered by Claude, with tool-use capabilities.

## Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the chat interface.

## Prerequisites

- Node.js 18+
- Python 3 (for the code analysis tool)
- An [Anthropic API key](https://console.anthropic.com/)

## Project Structure

```
app/
  page.tsx              # Chat UI (complete)
  layout.tsx            # Root layout
  api/chat/route.ts     # Chat API route
lib/
  tools/weather.ts      # Weather tool (TODO)
  tools/analyze.ts      # Code analysis tool (TODO)
  utils.ts              # Utility functions
components/ui/          # UI components
```

See [INSTRUCTIONS.md](./INSTRUCTIONS.md) for assessment details.
