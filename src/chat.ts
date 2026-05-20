import chalk from "chalk";
import { Message } from "./types";
import { COLORS } from "./config";
import { MOOD_DEFAULT } from "./moods/prompts";
import { streamResponse } from "./core/stream";
import { ask, rl } from "./utils/terminal";
import { getTime } from "./utils/time";
import {
  help,
  clear,
  saveHistoryOnFile,
  switchMood,
  recapHis,
  showTokens,
} from "./commands";

let systemPrompt = MOOD_DEFAULT;

let messages: Message[] = [
  {
    role: "system",
    content: systemPrompt,
  },
];


// function slow(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

let sessionTokens = 0;
export const main = async () => {
  console.log(chalk.hex(COLORS.welcome)("Welcome! Maarif here, what's up? 🔥"));
  while (true) {
    const userInput = await ask(chalk.hex(COLORS.user)("You: "));
    process.stdout.write(`\x1B[1A\x1B[2K`);
    console.log(`${"You: "} ${userInput}   [${getTime()}]`);

    if (userInput.toLowerCase() === "/exit") {
      console.log(
        chalk.hex(COLORS.welcome)("Allah hafiz bro, catch you later! 👋"),
      );
      rl.close();
      break;
    }

    if (userInput.toLowerCase() === "/clear") {
      clear(messages, systemPrompt);
      console.log(
        "----------------------------------------------------------------------",
      );
      console.log(chalk.hex(COLORS.dim)("History cleared!!!"));
      continue;
    }

    if (userInput.toLowerCase() === "/recap") {
      await recapHis(messages);
      continue;
    }

    if (userInput.toLowerCase() === "/help") {
      help();
      continue;
    }

    if (userInput.toLowerCase() === "/save") {
      saveHistoryOnFile(messages);
      continue;
    }

    if (userInput.toLowerCase().startsWith("/mood")) {
      let parts = userInput.split(" ");
      let moodName = parts[1]?.toLowerCase() ?? "";
      switchMood(messages, systemPrompt, moodName);
      continue;
    }

    if (userInput.toLowerCase() === "/tokens") {
      showTokens(sessionTokens)
      continue;
    }

    messages.push({ role: "user", content: userInput });
    const { fullReply, totalTokens } = await streamResponse(messages);
    sessionTokens += totalTokens;
    messages.push({ role: "assistant", content: fullReply });
  }
};
