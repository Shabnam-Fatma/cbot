import chalk from "chalk";
import { COLORS } from "../config";

export function help() {
  console.clear();

  const W = 52;
  const border = chalk.hex(COLORS.border);
  const title = chalk.hex(COLORS.warning).bold;
  const cmd = chalk.hex(COLORS.primary).bold;
  const desc = chalk.hex(COLORS.text);
  const dim = chalk.hex(COLORS.dim);
  const success = chalk.hex(COLORS.success);

  const top = border("╔" + "═".repeat(W) + "╗");
  const bot = border("╚" + "═".repeat(W) + "╝");
  const sep = border("╠" + "═".repeat(W) + "╣");
  const empty = border("║") + " ".repeat(W) + border("║");

  const line = (content: string, visibleLen: number) =>
    border("║") + content + " ".repeat(Math.max(0, W - visibleLen)) + border("║");

  const centered = (text: string, colorFn: (s: string) => string) => {
    const padL = Math.floor((W - text.length) / 2);
    const padR = W - padL - text.length;
    return border("║") + " ".repeat(padL) + colorFn(text) + " ".repeat(padR) + border("║");
  };

  const commands: [string, string][] = [
    ["/help",    "show this menu"],
    ["/clear",   "reset memory"],
    ["/recap",   "summarize chat"],
    ["/save",    "save conversation"],
    ["/mood",    "switch Maarif mood"],
    ["/tokens",  "show token usage"],
    ["/exit",    "end session"],
  ];

  console.log();
  console.log(top);
  console.log(centered("COMMAND CENTER", title));
  console.log(sep);
  console.log(empty);

  commands.forEach(([c, d]) => {
    const content = "  " + cmd(c.padEnd(10)) + dim("→  ") + desc(d);
    const visible = 2 + 10 + 3 + d.length;
    console.log(line(content, visible));
  });

  console.log(empty);
  console.log(sep);
  console.log(centered("MOODS", title));
  console.log(sep);
  console.log(empty);

  const mood1 = "default · chaos · villain · medievalbard";
  const mood2 = "hypeman · eli5 · devilsadvocate · socrates";
  const m1Pad = Math.floor((W - mood1.length) / 2);
  const m2Pad = Math.floor((W - mood2.length) / 2);

  console.log(
    border("║") + " ".repeat(m1Pad) + dim(mood1) +
    " ".repeat(W - m1Pad - mood1.length) + border("║"),
  );
  console.log(
    border("║") + " ".repeat(m2Pad) + dim(mood2) +
    " ".repeat(W - m2Pad - mood2.length) + border("║"),
  );

  console.log(empty);
  console.log(bot);
  console.log();
  console.log("  " + success("wallah bro let's cook."));
  console.log();
}