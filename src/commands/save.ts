import chalk from "chalk";
import * as fs from "fs";
import { Message } from "../types";
import { COLORS } from "../config";

export function saveHistoryOnFile(arrHis: Message[]) {
  const filtered = arrHis.filter((i) => i.role !== "system");

  if (filtered.length === 0) {
    console.log("\n  " + chalk.hex(COLORS.error)("✗ nothing to save yet bro.\n"));
    return;
  }

  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const fileName =
    `Maarif-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `-${pad(d.getHours())}${pad(d.getMinutes())}.json`;

  fs.writeFileSync(fileName, JSON.stringify(filtered, null, 2));

  console.log();
  console.log("  " + chalk.hex(COLORS.primary)("◆ ") + chalk.hex(COLORS.success)("saved."));
  console.log("  " + chalk.hex(COLORS.dim)("file: ") + chalk.hex(COLORS.success)(fileName));
  console.log("  " + chalk.hex(COLORS.dim)(`messages: ${filtered.length}\n`));
}