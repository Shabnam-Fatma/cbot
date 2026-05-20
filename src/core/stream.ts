import Groq from "groq-sdk";
import { Message } from "../types";
import { clearThinking, showThinking } from "../utils/terminal";
import chalk from "chalk";
import { getTime } from "../utils/time";
import { COLORS, MODEL } from "../config";

export const streamResponse = async (msg: Message[]) => {
  const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

  if (!groqClient.apiKey) {
    throw new Error("Missing Groq API key in your .env file");
  }
  showThinking();

  const response = await groqClient.chat.completions.create({
    model: MODEL,
    messages: msg,
    stream: true,
  });

  clearThinking();

  process.stdout.write(chalk.hex(COLORS.primary)("Maarif: "));
  let fullReply = "";
  let totalTokens: number = 0;
  for await (const chunk of response) {
    const piece = chunk.choices[0]?.delta.content || "";
    process.stdout.write(chalk.hex(COLORS.text)(piece));
    fullReply += piece;
    totalTokens = chunk.x_groq?.usage?.total_tokens ?? 0;
  }
  console.log(`   [${getTime()}]`);
  return { fullReply, totalTokens };
};
