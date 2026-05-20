import chalk from "chalk";
import * as fs from "fs";
import { Message } from "../types";
import { COLORS } from "../config";

export function saveHistoryOnFile(arrHis: Message[]) {
  let filteredMsgHistory = arrHis.filter((i) => i.role !== "system");
  let dt = new Date();
  let fileName = `Maarif-${String(dt.getFullYear())}-${String(dt.getMonth()).padStart(2, "0")}-${String(dt.getDay()).padStart(2, "0")}-${String(dt.getHours()).padStart(2, "0")}-${String(dt.getMinutes()).padStart(2, "0")}`;
  fs.writeFileSync(fileName, JSON.stringify(filteredMsgHistory, null, 2));
  console.log(chalk.hex(COLORS.success)(`Conversation Saved ${fileName}`));
}