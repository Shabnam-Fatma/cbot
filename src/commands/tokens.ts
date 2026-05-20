import chalk from "chalk";
import { COLORS, TOKEN_LIMIT } from "../config";

export function showTokens(sessionTokens: number) {
  const limit = TOKEN_LIMIT;
  const pct = Math.ceil((sessionTokens / limit) * 100);
  const color = pct < 50 ? COLORS.success : pct < 80 ? COLORS.warning : COLORS.error;
  console.log(
    chalk.hex(color)(`tokens: ${sessionTokens} / ${limit} (${pct}%)`),
  );
}
