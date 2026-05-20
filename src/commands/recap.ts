import chalk from "chalk";
import { streamResponse } from "../core/stream";
import { Message } from "../types";
import { COLORS } from "../config";

export async function recapHis(arrHis:Message[]) {
    const recapMsgs: Message[] = [
        ...arrHis,
        {
          role: "user",
          content: "Please summerize our entire message so far.",
        },
      ];
      await streamResponse(recapMsgs);
      console.log(chalk.hex(COLORS.dim)("History summerized"));
}