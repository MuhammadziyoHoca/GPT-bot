const { Redis } = require("ioredis");
const { default: OpenAI } = require("openai");
const client = new Redis(process.env.REDIS_URL);

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_IPI_KEY,
});

async function ask(id, question) {
  let messages = JSON.parse(await client.get(id));
  messages ? (messages = messages) : (messages = []);
  messages.push({ role: "user", content: question });

  const chatCompletion = await openai.chat.completions.create({
    messages,
    model: "gpt-4",
  }); 
  messages.push(chatCompletion.choices[0].message);
  await client.set(id, JSON.stringify(messages));
  return chatCompletion.choices[0].message.content;
}

module.exports = ask;
