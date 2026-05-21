import * as readline from "readline";
import chalk from "chalk";
import { COLORS } from "../config";

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function ask(prompt: string): Promise<string> {
  return new Promise((resolve) => rl.question(prompt, resolve));
}

export const showThinking = () => {
  process.stdout.write(chalk.hex(COLORS.dim)("Maarif is thinking..."));
};

export const clearThinking = () => {
  process.stdout.write("\r                                          \r");
};
