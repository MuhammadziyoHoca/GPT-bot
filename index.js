const TelegramBot = require("node-telegram-bot-api");
const { config } = require("dotenv");
config();

const ask = require("./utils/gptRequester");
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
let customCommands = [
  { command: "start", description: "Start the bot" },
  { command: "help", description: "Get help and instructions" },
  { command: "chat1", description: "Join the default chat" },
  { command: "createchat", description: "Create a new chat" },
];
let index;

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot
    .setMyCommands(customCommands)
    .then(() => {
      bot.sendMessage(chatId, "Chat created");
      console.log(customCommands);
    })
    .catch((error) => {
      bot.sendMessage(chatId, "Chat not created");
      console.log(error.message);
    });
  
      // bot.setMyCommands([])

  bot.sendMessage(chatId, "Hello! How can I assist you today?");
});

bot.onText(/\/createChat/, async (msg) => {
  const userId = msg.chat.id; // Get the user's ID
  index = "createChat";

  await bot.sendMessage(userId, "Write name for chat");
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (index == "createChat") {
  //  customCommands= customCommands.splice(customCommands.length-2,0,{
  //     command: "chat" + customCommands.length - 3,
  //     description: text,
  //  });
    customCommands.push({ command: 'NEW' ,description:"new"});
    index = undefined
    console.log(customCommands);
   return await bot
      .setMyCommands(customCommands)
      .then(() => {
          bot.sendMessage(chatId, "Chat created");
          console.log(customCommands);
      })
      .catch((error) => {
        bot.sendMessage(chatId, "Chat not created");
        console.log(error);
      });
  } 
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
