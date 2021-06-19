import { Context } from 'telegraf';
import { text } from 'telegraf/typings/button';
import {bot, chatid, setChatId} from '../bot/bot';
import utils from './utils'

async function is_adm( ctx: Context ){
    let adms = await ctx.getChatAdministrators()
    return adms.find(adm => ctx.from?.id === adm.user.id);
};

const commands = [
    { command: 'help', description: 'O bot te ajuda' },
    { command: 'register', description: 'Registra o chat para o bot enviar mensagens ao ocorrer eventos (Somente ADM)'},
    { command: 'rompeu', description: 'ROMPEU ROMPEU ROMPEU.mp3' },
    { command: 'comandos', description: 'Lista os comandos' },
    { command: 'queda', description: 'Baixa Infinita.mp3'},
    { command: 'alta', description: 'Alta Infinita.mp3'}
];

let timers: { [key: string]: number } = {
    'rompeu': Date.now() - 60000,
    'alta': Date.now() - 60000,
    'queda': Date.now() - 60000,
    'rompeu_reply': Date.now() - 60000
};

async function setup(){
    bot.start( ctx => {
        ctx.reply('HOJE EU TO POMPOSO!');
    });

    bot.telegram.setMyCommands(commands);

    bot.help( ctx => {
        ctx.reply("👍 Se quiser saber os comandos usa o comando /comandos 👍");
    });

    bot.command('rompeu', ctx => {
        if(utils.cooldown(timers.rompeu,Date.now(),0.125)){
            console.log('Comando "rompeu" em cooldown');
            // ctx.reply('Comando em cooldown');
            return;
        }

        ctx.replyWithAudio({source: 'res/audio/Rompeu.ogg'})
        timers.rompeu = Date.now(); 
    });
    bot.command('queda', ctx => {
        if(utils.cooldown(timers.queda, Date.now(), 0.125)){
            console.log('Comando "queda" em cooldown');
            return;
        }

        ctx.replyWithAudio({source: 'res/audio/queda.mp3'})
        timers.queda = Date.now();
    });
    bot.command('alta', ctx => {
        if(utils.cooldown(timers.alta, Date.now(), 0.125)){
            console.log('Comando "alta" em cooldown');
            return;
        }
        ctx.replyWithAudio({source: 'res/audio/alta.mp3'})
        timers.alta = Date.now();
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

    bot.command('adm', async ctx=> {               
        let result = await is_adm(ctx)
        .catch( err => {
            console.log("Error catching adm command: " + err);
        });
        if(result){
            ctx.reply("Tu é adm.");
        } else {
            ctx.reply("Tu não é adm");
        };
    });

    bot.command('register', async ctx=> {
        let result = await is_adm(ctx)
        .catch( err => console.log("Error fetching if is adm: " + err));
        if(result){
            if (chatid==0){
                ctx.reply("Chat Registrado com sucesso no meu banco de dados.");
                setChatId(ctx.message.chat.id);
            } else {
                ctx.reply("Chat já registrado");
            }
        }
        else {
            ctx.reply("Somente ADMs podem registrar o chat");
        }
    })
 
    bot.hears(/rompeu+/i, ctx => {
        if(utils.cooldown(timers.rompeu_reply, Date.now(), 1)) return;
        ctx.reply('ROMPEU ROMPEU ROMPUE HEUaHeUAhUAHurAHEUAHeuAh').catch( err => {
            console.log('Error: ' + err );
        });
        timers.rompeu_reply = Date.now();
    });

    bot.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log('Response time: %sms', ms);
    });

    setInterval(async () => {
        await bot.telegram.sendMessage(chatid, "São " + Date.now.toString())
        .then( ctx => {
            console.log(ctx.message_id + " " + ctx.text);
        })
        .catch( err => console.log(err));
    }, 5*1000);
};

function launch(){
    console.log("Launching Bot");
    bot.launch();
}

export default {setup, launch};