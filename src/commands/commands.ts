import { Context } from 'telegraf';
import bot from '../bot/bot';

async function is_adm( ctx: Context ){
    await ctx.getChatAdministrators()
    .then(adms => {
        return adms.find(adm => ctx.from?.id === adm.user.id)
    });
};

const commands = [
    { command: 'help', description: 'O bot te ajuda' },
    { command: 'rompeu', description: 'ROMPEU ROMPEU ROMPEU.mp3' },
    { command: 'comandos', description: 'Lista os comandos' },
    { command: 'baixa', description: 'Baixa Infinita.mp3'},
    { command: 'alta', description: 'Alta Infinita.mp3'}
];

async function setup(){
    bot.start( ctx => {
        ctx.reply('HOJE EU TO POMPOSO!');
    });

    bot.telegram.setMyCommands(commands);

    bot.help( ctx => {
        ctx.reply("👍 Se quiser saber os comandos usa o comando /comandos 👍");
    });

    bot.hears(/rompeu+/i, ctx => {
        ctx.reply('ROMPEU ROMPEU ROMPUE HEUaHeUAhUAHurAHEUAHeuAh').catch( err => {
            console.log('Error: ' + err );
        });
    });

    bot.command('rompeu', ctx => ctx.replyWithAudio({source: 'res/audio/Rompeu.ogg'}) );
    bot.command('queda', ctx => ctx.replyWithAudio({source: 'res/audio/queda.mp3'}));
    bot.command('alta', ctx => ctx.replyWithAudio({source: 'res/audio/alta.mp3'}));

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

    bot.command('adm', ctx=> {               
        let result = is_adm(ctx)
        .catch( err => {
            console.log("Error catching adm command: " + err);
        });
        if(result){
            ctx.reply("Tu é adm.");
        } else {
            ctx.reply("Tu não é adm");
        };
    });
 

    bot.use(async (ctx, next) => {
        const start = Date.now();
        await next();
        const ms = Date.now() - start;
        console.log('Response time: %sms', ms);
    });
};

function launch(){
    console.log("Launching Bot");
    bot.launch();
}

export default {setup, launch};