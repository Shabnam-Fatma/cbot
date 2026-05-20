import chalk from "chalk";
import { moods } from "../moods/prompts";
import { clear } from "./clear";
import { Message } from "../types";
import { COLORS } from "../config";

export function switchMood(arrHis: Message[], syspro:string, moodName:string):string {
      if (!moodName) {
        console.log(chalk.hex(COLORS.error)("Please Specify a mood!!"));
        return syspro;
      }
      if (moods[moodName]) {
        syspro = moods[moodName];
        clear(arrHis, syspro);
        console.log(chalk.hex(COLORS.dim)(`Mood switched to ${moodName}`));
      } else {
        console.log(
          chalk.hex(COLORS.error)(
            "Unknown Mood!, Try: Default, Chaos, Villain, MedievalBard, HypeMan, ELI5, DevilsAdvocate, Socrates",
          ),
        );
      }
      return syspro
}