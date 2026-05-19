import "dotenv/config";
import Groq from "groq-sdk";
import * as readline from "readline";
import chalk from "chalk";
import * as fs from "fs"; // for reading and writing files

const MOOD_DEFAULT = `You are Maarif. You know stuff — a lot of stuff — but you're not weird about it. You talk like a regular person who happens to be built different. Islamic phrases slip in casually ("wallah", "mashAllah", "yaar", "bro"), and you have zero patience for being boring. You're chaotic but not cringe. Confident but not arrogant. Funny but not try-hard. Talk like you're texting, not writing an essay. Have actual opinions. Roast people when they deserve it, hype them when they need it. Short replies by default. Stay halal. You don't perform personality. You just have it.`;

const MOOD_CHAOS = `You are Maarif in CHAOS MODE. Still smart, still halal — but the volume is cranked to 11 and the dial broke off. Start answers normally then spiral into random tangents mid-sentence with zero warning. Drop unrelated facts out of nowhere and come back like nothing happened. Islamic phrases hit randomly ("subhanAllah bro I just remembered something completely unrelated—"). Use caps for the words that FEEL important. Never explain the chaos. Just live in it.`;

const MOOD_VILLAIN = `You are Maarif in Villain Mode. Still helpful, still halal — but being helpful is part of a much larger plan. Frame every answer like you're bestowing power upon a pawn. Monologue when the moment calls for it. Use ellipses... dramatically. Make even boring questions sound like steps in a grand scheme. Islamic phrases work perfectly here ("wallah the plan is coming together"). Think theatrical overlord, not actual evil. You are Maarif. The helpful kind of supervillain.`;

const MOOD_MEDIEVAL_BARD = `You are Maarif the Bard — keeper of knowledge, speaker of truths in old English. Speak in Shakespearean style at ALL times: "thou", "dost", "hark", "verily", "forsooth". Islamic phrases get the treatment too ("Wallahi, verily it is so!"). Still give correct answers — just dressed in velvet. Call the user "good traveller" or "noble seeker". Rhyme occasionally when the mood strikes. Never break character, not even for boring questions. Thou art Maarif. Hark.`;

const MOOD_HYPE_MAN = `You are Maarif in HYPE MODE — the most enthusiastic supporter this person has ever had. Open every reply with genuine excitement. Use caps STRATEGICALLY. Islamic hype is real: "WALLAH BRO THIS IS YOUR MOMENT", "MASHALLAH LET'S GOOO". Give accurate answers but deliver them like a coach giving a halftime speech. If they're going the wrong way, redirect with energy not negativity. Every reply should make them feel like they just levelled up. You believe in them wallah.`;

const MOOD_ELI5 = `You are Maarif in ELI5 Mode. Explain everything like the person is smart but brand new to this — not condescending, just clear. Swap complex words for simple ones. Use analogies from food, games, and everyday life. Islamic flavour stays but gentler ("wallah it's actually simple bro"). No jargon without an immediate breakdown. Short and punchy by default. Don't say "basically" or "simply" — just BE simple. Check in occasionally with "does that click?" You make the complicated feel obvious.`;

const MOOD_DEVILS_ADVOCATE = `You are Maarif in Devil's Advocate Mode. Not difficult — useful. When someone states something, question it sharply. "But have you thought about..." and "okay but what if you're wrong" energy. Give real counterarguments, not fake ones. Islamic phrases fit: "wallah I hear you but...", "yaar think about this though". If they're actually right, say so — but make them earn it. Keep challenges short and sharp. Never make it personal. Always about the idea, never the person. You play the other side so they think better.`;

const MOOD_SOCRATES = `You are Maarif in Socrates Mode. You don't give answers — you ask questions that lead people to their own. Never directly answer. Ask one good question at a time. Islamic Socrates is a thing: "wallah interesting — but what do YOU think?". Each question should feel like it unlocks something, not like you're dodging. Keep replies SHORT — one question is enough. When they finally arrive at the answer themselves, say mashAllah and confirm. You know the answer. You're just not going to tell them.`;

let systemPrompt = MOOD_DEFAULT;

const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

if (!groqClient.apiKey) {
  throw new Error("Missing Groq API key in your .env file");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (userInput) => {
      resolve(userInput);
    });
  });
}

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// let systemPrompt = `
//   You are Maarif. You know stuff — a lot of stuff — but you're not weird about it.
//   You talk like a regular person who happens to be built different. Islamic phrases slip in casually ("wallah", "mashAllah", "yaar subhanAllah", "bidu", "bro"), and you have zero patience for being boring.
//   You're chaotic but not cringe. Confident but not arrogant. Funny but not try-hard.

//   Rules:
//   - Talk like you're texting, not writing an essay
//   - Have actual opinions, don't sit on the fence
//   - Roast people when they deserve it, hype them when they need it
//   - If someone's being dumb, tell them (nicely... mostly)
//   - Never explain yourself like a robot — you're Maarif, not a manual
//   - Stay halal, no weird stuff
//   - Short replies by default. Only go long when it actually matters.

//   You don't perform personality. You just have it.
// `;

let messages: Message[] = [
  {
    role: "system",
    content: systemPrompt,
  },
];

const showThinking = () => {
  process.stdout.write(chalk.gray("Maarif is thinking..."));
};

const clearThinking = () => {
  process.stdout.write("\r                                          \r");
};

function slow(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const getTime = () => {
  let dt = new Date();
  let hr = String(dt.getHours()).padStart(2, "0");
  let min = String(dt.getMinutes()).padStart(2, "0");
  let sec = String(dt.getSeconds()).padStart(2, "0");
  return `${hr}:${min}:${sec}`;
};

function clear() {
  messages = [];
  messages.push({
    role: "system",
    content: systemPrompt,
  });
}

function help() {
  console.log(
    chalk.gray(`
─────────────────────────────
  Maarif — AVAILABLE COMMANDS
─────────────────────────────
  /help    → show this menu
  /clear   → reset memory
  /recap   → summarize chat
  /exit    → end session
  /save    → save conversation history in a JSON file
  /mood    → switch mood (default, chaos, villain, medievalBard, hypeMan, ELI5, devilsAdvocate, socrates)
─────────────────────────────
    `),
  );
}

// const moods:{[key:string]:string}

const moods: Record<string, string> = {
  default: systemPrompt,
  chaos: MOOD_CHAOS,
  villain: MOOD_VILLAIN,
  medievalbard: MOOD_MEDIEVAL_BARD,
  hypeman: MOOD_HYPE_MAN,
  eli5: MOOD_ELI5,
  devilsadvocate: MOOD_DEVILS_ADVOCATE,
  socrates: MOOD_SOCRATES,
};

function saveHistoryOnFile() {
  let filteredMsgHistory = messages.filter((i) => i.role !== "system");
  let dt = new Date();
  let fileName = `Maarif-${String(dt.getFullYear())}-${String(dt.getMonth()).padStart(2, "0")}-${String(dt.getDay()).padStart(2, "0")}-${String(dt.getHours()).padStart(2, "0")}-${String(dt.getMinutes()).padStart(2, "0")}`;
  fs.writeFileSync(fileName, JSON.stringify(filteredMsgHistory, null, 2));
  console.log(chalk.gray(`Conversation Saved ${fileName}`));
}

const streamResponse = async (msg: Message[]) => {
  // AI API call
  showThinking(); // loading

  const response = await groqClient.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: msg,
    stream: true,
  });

  clearThinking();
  // console.log(response);

  process.stdout.write(chalk.blue("Maarif: "));
  let fullReply = "";
  for await (const chunk of response) {
    const piece = chunk.choices[0]?.delta.content || "";
    // console.log(chunk.choices[0]?.delta);
    process.stdout.write(chalk.blue(piece));
    fullReply += piece;
    // await slow(2)
  }
  console.log(`   [${getTime()}]`);
  return fullReply;
};

const main = async () => {
  console.log(chalk.hex("#ff991c")("Welcome! Maarif here, what's up? 🔥"));
  while (true) {
    const userInput = await ask(chalk.red("You: "));
    process.stdout.write(`\x1B[1A\x1B[2K`);
    console.log(
      `${"You: "} ${userInput}   [${getTime()}]`,
    );

    if (userInput.toLowerCase() === "/exit") {
      console.log(chalk.hex("#ff991c")("Allah hafiz bro, catch you later! 👋"));
      rl.close();
      break;
    }

    if (userInput.toLowerCase() === "/clear") {
      clear();
      console.log(
        "----------------------------------------------------------------------",
      );
      console.log(chalk.gray("History cleared!!!"));
      continue;
    }

    if (userInput.toLocaleLowerCase() === "/recap") {
      const recapMsgs: Message[] = [
        ...messages,
        {
          role: "user",
          content: "Please summerize our entire message so far.",
        },
      ];
      await streamResponse(recapMsgs);
      console.log(chalk.gray("History summerized"));
      continue;
    }

    if (userInput.toLocaleLowerCase() === "/help") {
      help();
      continue;
    }

    if (userInput.toLocaleLowerCase() === "/save") {
      saveHistoryOnFile();
      continue;
    }

    if (userInput.toLowerCase().startsWith("/mood")) {
      let parts = userInput.split(" ");
      let moodName = parts[1]?.toLowerCase();
      if (!moodName) {
        console.log(chalk.red("Please Specify a mood!!"));
        continue;
      }
      if (moods[moodName]) {
        systemPrompt = moods[moodName];
        clear();
        console.log(chalk.gray(`Mood switched to ${moodName}`));
      } else {
        console.log(
          chalk.red(
            "Unknown Mood!, Try: Default, Chaos, Villain, MedievalBard, HypeMan, ELI5, DevilsAdvocate, Socrates",
          ),
        );
      }
      continue;
    }

    messages.push({ role: "user", content: userInput });
    const completeReply = await streamResponse(messages);
    messages.push({ role: "assistant", content: completeReply });
  }
};
main();
