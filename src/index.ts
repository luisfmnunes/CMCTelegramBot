// import express from 'express';
import {Telegraf} from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error('Bot token must be provided');
}

const bot = new Telegraf(token);

bot.start( ctx => {
  ctx.reply('HOJE EU TO POMPOSO!');
});

bot.help( ctx => {
  ctx.reply("👍");
  ctx.getMyCommands().then((msg) => {
    console.log(msg);
  }).catch((err) => {
    console.log("Error: " + err);
  });
});

bot.hears('rompeu', ctx => {
  ctx.replyWithAudio({source: 'res/audio/Rompeu.ogg'}).catch( err => {
    console.log('Error: ' + err );
  });
});

bot.command('rompeu', ctx => {
  ctx.replyWithAudio({source: 'res/audio/Rompeu.ogg'});
});

bot.command('comandos', ctx=> {
  let message: string = ""; 
  ctx.getMyCommands().then( commands => {
    commands.forEach((command, i) => {
      message += i + " - /" + command.command + ": " + command.description + "\n";
    });
    ctx.reply(message);
  }).catch(err => {
    console.log("Error listing commands: " + err);
  });
})

console.log("Launching Bot");
bot.launch();
// const secretPath = `telegraf/${bot.secretPathComponent()}`;
// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
