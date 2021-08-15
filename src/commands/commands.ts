import { Context } from 'telegraf';
import {bot, chatid, setChatId} from '../bot/bot';
import {cooldown} from './utils'
import {checkNewTokens, CMC_Data, getQuery, tokenString} from '../api/query'
import { randomInt } from 'crypto';

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

const wait = async (ms: number) => {
    await new Promise(r => setTimeout(r,ms));
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
        if(cooldown(timers.rompeu,Date.now(),0.125)){
            console.log('Comando "rompeu" em cooldown');
            // ctx.reply('Comando em cooldown');
            return;
        }

        ctx.replyWithAudio({source: 'res/audio/Rompeu.ogg'})
        timers.rompeu = Date.now(); 
    });
    bot.command('queda', ctx => {
        if(cooldown(timers.queda, Date.now(), 0.125)){
            console.log('Comando "queda" em cooldown');
            return;
        }

        ctx.replyWithAudio({source: 'res/audio/queda.mp3'})
        timers.queda = Date.now();
    });
    bot.command('alta', ctx => {
        if(cooldown(timers.alta, Date.now(), 0.125)){
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
            ctx.reply(message).catch(err=>{
                wait(err.response.parameters.retry_after*1001);
            }).then(() => ctx.reply(message));
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
        if(cooldown(timers.rompeu_reply, Date.now(), 1)) return;
        ctx.reply('ROMPEU ROMPEU ROMPUE HEUaHeUAhUAHurAHEUAHeuAh').catch( err => {
            console.log('Error: ' + err );
        });
        timers.rompeu_reply = Date.now();
    });

//    bot.use(async (ctx, next) => {
//        const start = Date.now();
//        await next();
//        const ms = Date.now() - start;
//        console.log('Response time: %sms', ms);
//    });

    setInterval(async () => {
        if(!chatid) return;
        let res = await checkNewTokens();
        if(res){
            for await (const token of res){
                if(token == null) continue;
                bot.telegram.sendMessage(chatid, 
                                            tokenString(token.name, 
                                                        token.symbol, 
                                                        token.quote.USD.price, 
                                                        token.quote.USD.market_cap, 
                                                        token.quote.USD.percent_change_1h,
                                                        token.quote.USD.percent_change_24h, 
                                                        token.date_added,
                                                        token.total_supply,
                                                        token.platform.name,
                                                        token.platform.token_address), {parse_mode: 'Markdown'})
                .catch( async err => {
                    console.log(err);
                    if(err.response == undefined)
                        return
                    await wait(err.response.parameters.retry_after*1001).then(() => bot.telegram.sendMessage(chatid, 
                        tokenString(token.name, 
                                    token.symbol, 
                                    token.quote.USD.price, 
                                    token.quote.USD.market_cap, 
                                    token.quote.USD.percent_change_1h,
                                    token.quote.USD.percent_change_24h, 
                                    token.date_added,
                                    token.total_supply,
                                    token.platform.name,
                                    token.platform.token_address), {parse_mode: 'Markdown'})
                        );                   
                });
                await wait(1000);
            }

            if(randomInt(12)%4 && res.length > 0){
                bot.telegram.sendMessage(chatid, "Achou o bot legal?\nFez um lucro massa?\nVocê pode doar tokens para apoiar o projeto na seguinte carteira: \n\n0x68e047CEe46f4403aa4196e72dd9E4e7BF427aD3", {parse_mode: 'Markdown'})
                .catch( async err => {
                    console.log(err);
                    await wait(err.response.parameters.retry_after*1001)
                    .then( () => bot.telegram.sendMessage(chatid, "Achou o bot legal?\nFez um lucro massa?\nVocê pode doar tokens (BNB/BUSD) para apoiar o projeto na seguinte carteira: \n\n0x68e047CEe46f4403aa4196e72dd9E4e7BF427aD3", {parse_mode: 'Markdown'}));
                })
            }   
            // console.log(`${res.length} tokens found`);
        }

        // await bot.telegram.sendMessage(chatid, tokenString(res.data[0].name, res.data[0].symbol, "Not Defined", res.data[0].date_added, res.data[0].total_supply), {parse_mode: 'Markdown'})
        // .catch( err => console.log(err));
        // await bot.telegram.sendMessage(chatid, "São " + new Date().toString())
    }, 5*60000);
};

function launch(){
    console.log("Launching Bot");
    bot.launch();
}

export default {setup, launch};