import {Telegraf} from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.BOT_TOKEN;
if (token === undefined) {
  throw new Error('Bot token must be provided');
}

const bot = new Telegraf(token);
let chatid = 0;

let setChatId = (value: number) => chatid = value;

export {bot, chatid, setChatId};
