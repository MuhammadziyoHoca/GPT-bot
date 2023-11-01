const TelegramBot = require("node-telegram-bot-api");
const { config } = require("dotenv");
config();
const ask = require("./utils/gptRequester");

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });


// bot.onText(/\/start/, (msg) => {
//   const chatId = msg.chat.id;
//   // bot.sendMessage(chatId, "Hello! How can I assist you today?");
// });



bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text) {
    bot.sendMessage(chatId, await ask(chatId, text), {
      parse_mode: "Markdown",
    });
  } else { 
    bot.sendMessage(
      chatId,
      "Sorry, we don't support this type of message at the moment. Please try sending a text message."
    );
  }
});
