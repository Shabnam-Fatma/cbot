# Maarif

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-FF6B35?style=flat&logoColor=white)
![LLaMA](https://img.shields.io/badge/LLaMA_3.3_70B-0467DF?style=flat&logoColor=white)

A terminal-based AI assistant built with TypeScript and Node.js. Streams responses from Meta's LLaMA 3.3 70B via the Groq API. Features Maarif who Knows a lot, not weird about it. Talks like a person — Islamic phrases, actual opinions, roasts when you deserve it, hype when you need it. Always halal, never boring.

---

## Stack

| Layer | Tool |
|---|---|
| Language | TypeScript |
| Runtime | Node.js |
| AI Model | LLaMA 3.3 70B Versatile via Groq |
| Packages | groq-sdk, chalk, dotenv |
| Built-ins | readline, fs, process |

---

## Features

- Real-time streaming responses via Groq streaming API
- Conversation memory within session
- 8 switchable moods via `/mood` command
- Themed terminal UI
- Timestamps on every message
- Thinking indicator during API calls
- Save conversations to timestamped JSON files
- Conversation recap via AI summarization

---

## Slash Commands

| Command | Description |
|---|---|
| `/help` | show available commands |
| `/clear` | reset conversation memory |
| `/recap` | AI summarizes the conversation so far |
| `/save` | export conversation to a timestamped JSON file |
| `/mood <name>` | switch Maarif's personality |
| `/exit` | end the session |

---

## Moods

| Mood | Vibe |
|---|---|
| `default` | gen-z, funny, brutally honest |
| `chaos` | unhinged but correct |
| `villain` | menacing, still solves your problem |
| `medievalbard` | forsooth, historically dramatic |
| `hypeman` | your biggest fan, maximum energy |
| `eli5` | explain like you're 5, zero jargon |
| `devilsadvocate` | argues the opposite, makes you think |
| `socrates` | answers everything with a question |

---