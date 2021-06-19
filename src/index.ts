// import express from 'express';
import commands from './commands/commands'
import {bot} from './bot/bot'
import api from './api/query'

commands.setup();
api();
commands.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
