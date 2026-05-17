# Maarif

Terminal AI chatbot. Streams responses, maintains session memory.

## Stack

- **Runtime:** Node.js + TypeScript
- **LLM:** Groq API — `llama-3.3-70b-versatile`
- **Streaming:** Groq SDK async iterator
- **UI:** `chalk` for colored terminal output, `readline` for input

## Setup

```bash
npm install
echo "GROQ_API_KEY=your_key_here" > .env
npx ts-node index.ts
```

## Features

- Token streaming with live output
- Full conversation memory (session-scoped)
- Thinking indicator + message timestamps
- Type `exit` to quit

## License

MIT
