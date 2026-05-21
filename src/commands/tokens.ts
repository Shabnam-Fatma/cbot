import chalk from "chalk";
import { COLORS, TOKEN_LIMIT } from "../config";

export function showTokens(sessionTokens: number) {
  const pct = Math.min(100, Math.ceil((sessionTokens / TOKEN_LIMIT) * 100));
  const colorHex = pct < 50 ? COLORS.success : pct < 80 ? COLORS.warning : COLORS.error;
  const filled = Math.round((pct / 100) * 30);

  console.log();
  console.log(
    "  " + chalk.hex(COLORS.primary)("◆ ") +
    chalk.hex(COLORS.dim)("token usage"),
  );
  console.log(
    "  " +
    chalk.hex(colorHex)("█".repeat(filled)) +
    chalk.hex(COLORS.dim)("░".repeat(30 - filled)) +
    "  " + chalk.hex(colorHex)(`${pct}%`),
  );
  console.log(
    "  " + chalk.hex(COLORS.dim)(
      `${sessionTokens.toLocaleString()} / ${TOKEN_LIMIT.toLocaleString()} tokens used\n`,
    ),
  );
}