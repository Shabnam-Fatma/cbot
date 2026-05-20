import chalk from "chalk";
import { COLORS } from "../config";

export function help() {
  console.log(
    chalk.hex(COLORS.border)(`
─────────────────────────────
  Maarif — AVAILABLE COMMANDS
─────────────────────────────
  /help    → show this menu
  /clear   → reset memory
  /recap   → summarize chat
  /exit    → end session
  /save    → save conversation history in a JSON file
  /mood    → switch mood (default, chaos, villain, medievalBard, hypeMan, ELI5, devilsAdvocate, socrates)
  /tokens  → shows numbers of tokens used
─────────────────────────────
    `),
  );
}