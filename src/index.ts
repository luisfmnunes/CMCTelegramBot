// import express from 'express';
import commands from './commands/commands'
import bot from './bot/bot'

commands.setup();
commands.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
