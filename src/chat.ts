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
let currentMood = "default";
let messages: Message[] = [{ role: "system", content: systemPrompt }];
let sessionTokens = 0;

// function banner() {
//   const W = 52;
//   const empty = chalk.hex(COLORS.border)("║" + " ".repeat(W) + "║");
//   const centered = (text: string, c: (s: string) => string) => {
//     const padL = Math.floor((W - text.length) / 2);
//     return (
//       chalk.hex(COLORS.border)("║") +
//       " ".repeat(padL) +
//       c(text) +
//       " ".repeat(W - padL - text.length) +
//       chalk.hex(COLORS.border)("║")
//     );
//   };

//   console.log();
//   console.log(chalk.hex(COLORS.border)("╔" + "═".repeat(W) + "╗"));
//   console.log(empty);
//   console.log(
//     `
//  __  __    __      __    ____  ____  ____
// (  \/  )  /__\    /__\  (  _ \(_  _)( ___)
//  )    (  /(__)\  /(__)\  )   / _)(_  )__)
// (_/\/\_)(__)(__)(__)(__)(_)\_)(____)(__)

//     `,
//     chalk.hex(COLORS.welcome).bold,
//   );
//   console.log(
//     centered("halal chaos · terminal edition", chalk.hex(COLORS.dim)),
//   );
//   console.log(empty);
//   console.log(chalk.hex(COLORS.border)("╚" + "═".repeat(W) + "╝"));
//   console.log();
//   console.log(
//     chalk.hex(COLORS.dim)("  type ") +
//       chalk.hex(COLORS.primary)("/help") +
//       chalk.hex(COLORS.dim)(" for commands · ") +
//       chalk.hex(COLORS.primary)("/exit") +
//       chalk.hex(COLORS.dim)(" to leave"),
//   );
//   console.log();
// }

function banner() {
  const ascii = [
    " __  __    __      __    ____  ____  ____ ",
    "(  \\/  )  /__\\    /__\\  (  _ \\(_  _)( ___)",
    " )    (  /(__)\\  /(__)\\  )   / _)(_  )__) ",
    "(_/\\/\\_)(__)(__)(__)(__)(_)\\_)(____)(__)  ",
  ];
  console.log(
    chalk.hex(COLORS.border)("______________________________________________"),
  );

  console.log();
  ascii.forEach((row) =>
    console.log("  " + chalk.hex(COLORS.welcome).bold(row)),
  );
  console.log();
  console.log(
    chalk.hex(COLORS.border)("______________________________________________"),
  );
  console.log();

  console.log("  " + chalk.hex(COLORS.dim)("Your mood · Your command · terminal edition"));
  console.log();
  console.log(
    "  " +
      chalk.hex(COLORS.dim)("type ") +
      chalk.hex(COLORS.primary)("/help") +
      chalk.hex(COLORS.dim)(" for commands · ") +
      chalk.hex(COLORS.primary)("/exit") +
      chalk.hex(COLORS.dim)(" to leave"),
  );
  console.log();
}

export const chat = async () => {
  banner();

  while (true) {
    const userInput = (
      await ask(
        chalk.hex(COLORS.primary)("➜ ") +
          chalk.hex(COLORS.user).bold("you ") +
          chalk.hex(COLORS.dim)("» "),
      )
    ).trim();

    process.stdout.write(`\x1B[1A\x1B[2K`);
    console.log(
      chalk.hex(COLORS.primary)("➜ ") +
        chalk.hex(COLORS.user).bold("you ") +
        chalk.hex(COLORS.dim)("» ") +
        chalk.hex(COLORS.user)(userInput) +
        chalk.hex(COLORS.dim)(`   [${getTime()}]`),
    );

    const cmd = userInput.toLowerCase();

    if (cmd === "/exit") {
      console.log();
      console.log(
        "  " + chalk.hex(COLORS.welcome)("Allah hafiz bro, catch you later 👋"),
      );
      console.log();
      rl.close();
      break;
    }

    if (cmd === "/clear") {
      clear(messages, systemPrompt);
      console.log(chalk.hex(COLORS.dim)("  history cleared. fresh slate.\n"));
      continue;
    }

    if (cmd === "/recap") {
      await recapHis(messages);
      continue;
    }
    if (cmd === "/help") {
      help();
      continue;
    }
    if (cmd === "/save") {
      saveHistoryOnFile(messages);
      continue;
    }
    if (cmd === "/tokens") {
      showTokens(sessionTokens);
      continue;
    }

    if (cmd.startsWith("/mood")) {
      const moodName = userInput.split(" ")[1]?.toLowerCase() ?? "";
      const result = switchMood(messages, systemPrompt, moodName, currentMood);
      systemPrompt = result.prompt;
      currentMood = result.mood;
      continue;
    }

    if (!userInput) continue;

    messages.push({ role: "user", content: userInput });

    process.stdout.write(
      chalk.hex(COLORS.primary)("◆ ") +
        chalk.hex(COLORS.primary).bold("maarif ") +
        chalk.hex(COLORS.warning)(`«${currentMood}»`) +
        chalk.hex(COLORS.dim)(" » "),
    );

    const { fullReply, totalTokens } = await streamResponse(messages);
    sessionTokens += totalTokens;
    messages.push({ role: "assistant", content: fullReply });
    console.log();
  }
};
