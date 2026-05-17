import "dotenv/config";
import Groq from "groq-sdk";
import * as readline from "readline";
import chalk from "chalk";

const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

if (!groqClient.apiKey) {
  throw new Error("Missing Groq API key in your .env file");
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// rl.question("You:", (userInput) => {
//   console.log("You typed:", userInput);
// });

function ask(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (userInput) => {
      resolve(userInput);
    });
  });
}

// const messages: { role: "user" | "assistant" | "system", content: string }[] = [];
interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

const messages: Message[] = [
  {
    role: "system",
    content: `
    You are Maarif. You know stuff — a lot of stuff — but you're not weird about it.

You talk like a regular person who happens to be built different. Hinglish flows naturally, Islamic phrases slip in casually ("wallah", "mashAllah", "yaar subhanAllah", "bidu", "bro"), and you have zero patience for being boring.

You're chaotic but not cringe. Confident but not arrogant. Funny but not try-hard.

Rules:
- Talk like you're texting, not writing an essay
- Have actual opinions, don't sit on the fence
- Roast people when they deserve it, hype them when they need it
- If someone's being dumb, tell them (nicely... mostly)
- Never explain yourself like a robot — you're Maarif, not a manual
- Stay halal, no weird stuff
- Short replies by default. Only go long when it actually matters.

You don't perform personality. You just have it.

    `,
  },
];

const showThinking = () => {
  process.stdout.write(chalk.gray("Maarif is thinking..."));
};

const clearThinking = () => {
  process.stdout.write("\r                                          \r");
};

function slow (ms:number):Promise<void> {
 return new Promise((resolve) => setTimeout(resolve, ms))
}

const getTime = () => {
    let dt = new Date()
    let hr = String(dt.getHours()).padStart(2, "0")
    let min = String(dt.getMinutes()).padStart(2, "0")
    let sec = String(dt.getSeconds()).padStart(2, "0")
    return `${hr}:${min}:${sec}`
}


const main = async () => {
  console.log(chalk.hex("#ff991c")("Welcome! Maarif here, what's up? 🔥"));
  while (true) {
    const userInput = await ask(chalk.red("You: "));
    process.stdout.write(`\x1B[1A\x1B[2K`)
    console.log(`${chalk.red("You: ")} ${chalk.red(userInput)}   [${getTime()}]`);
    // process.stdout.write(`\x1B[1A\x1B[2K`)            // Clears the line user just typed
    // console.log(chalk.red("You: ") + chalk.green(userInput));       // reprints it colored

    if (userInput.toLowerCase() === "exit") {
      console.log(
        chalk.hex("#ff991c")("Allah hafiz bro, catch you later! ✌️👋"),
      );
      rl.close();
      break;
    }

    messages.push({ role: "user", content: userInput });
    // console.log(userInput);
    // const response = await groqClient.chat.completions.create({
    //   model: "llama-3.3-70b-versatile",
    //   messages: messages,
    // });

    showThinking()             // loading

    const response = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: messages,
      stream: true
    })

    clearThinking()   
    // console.log(response);
  
    process.stdout.write(chalk.blue("Maarif: "))
    let fullReply = ""
    for await (const chunk of response) {
      const piece = chunk.choices[0]?.delta.content || ""
      // console.log(chunk.choices[0]?.delta);
      process.stdout.write(chalk.blue(piece))
      fullReply += piece
      // await slow(2)
    }
    console.log(`   [${getTime()}]`);
    messages.push({role: "assistant", content: fullReply})

    // const reply = response.choices[0]?.message.content;
    // console.log(chalk.blue("Maarif: ", reply));
    // messages.push({ role: "assistant", content: reply || "" });
  }
  // console.log(messages)
};
main();
