import chalk from "chalk";
import { moods } from "../moods/prompts";
import { clear } from "./clear";
import { Message } from "../types";
import { COLORS } from "../config";

const VALID = "default · chaos · villain · medievalbard · hypeman · eli5 · devilsadvocate · socrates";

export function switchMood(
  arrHis: Message[],
  syspro: string,
  moodName: string,
  currentMood: string,
): { prompt: string; mood: string } {
  if (!moodName) {
    console.log("  " + chalk.hex(COLORS.error)("✗ specify a mood, yaar."));
    console.log("  " + chalk.hex(COLORS.dim)("available: " + VALID) + "\n");
    return { prompt: syspro, mood: currentMood };
  }

  if (!moods[moodName]) {
    console.log("  " + chalk.hex(COLORS.error)(`✗ unknown mood: ${moodName}`));
    console.log("  " + chalk.hex(COLORS.dim)("try: " + VALID) + "\n");
    return { prompt: syspro, mood: currentMood };
  }

  clear(arrHis, moods[moodName]);

  console.log();
  console.log(
    "  " + chalk.hex(COLORS.primary)("◆ ") +
    chalk.hex(COLORS.dim)("mood: ") +
    chalk.hex(COLORS.warning)(currentMood) +
    chalk.hex(COLORS.dim)(" → ") +
    chalk.hex(COLORS.warning).bold(moodName),
  );
  console.log("  " + chalk.hex(COLORS.dim)("history wiped to keep the vibe pure.\n"));

  return { prompt: moods[moodName], mood: moodName };
}