import { Message } from "../types";

export function clear(arrHis: Message[], sysPromt: string) {
  arrHis.splice(0, arrHis.length)
  arrHis.push({
    role: "system",
    content: sysPromt,
  });
}
