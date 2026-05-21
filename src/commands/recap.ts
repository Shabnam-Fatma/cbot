import chalk from "chalk";
import { streamResponse } from "../core/stream";
import { Message } from "../types";
import { COLORS } from "../config";

export async function recapHis(arrHis: Message[]) {

  process.stdout.write(
    "  " + chalk.hex(COLORS.primary).bold("recap ") +
    chalk.hex(COLORS.dim)("» "),
  );

  await streamResponse([
    ...arrHis,
    { role: "user", content: "Summarize our entire conversation so far. Keep it tight." },
  ]);

  console.log();
}