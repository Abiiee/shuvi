const { Client, Intents } = require('discord.js-light')
const { connect } = require('mongoose');
const Commands = require('./Commands')
const Events = require('./Events')
module.exports = class Bot extends Client {
    constructor() {
        super({
            /* Intents necesarios por ustedes por defecto por defecto servidores y mensajes de servidores. */
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
            /* Las siguientes lineas deben activarlas o desactivarlas depende de lo que necesiten */
            cacheRoles: true,
            cacheGuilds: true,
            cacheEmojis: false,
            cacheMembers: true,
            cacheChannels: true,
            cachePresences: false,
            cacheOverwrites: true,
            messageCacheMaxSize: 20,
        })
        connect(process.env.MONGO_URL, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, (err) => {
            if (err) return console.log(`MongoDB - Error: ${err.stack ?? err}`);
            console.log('MONGODB - Base de datos conectada');
        });
        this.events = new Events(this)
        this.events.load()
        this.commands = new Commands(this)
        this.commands.load()
        this.devs = process.env.DEVS ? process.env.DEVS.split(', ') : [];
        this.login(process.env.BOT_TOKEN)
        this.levelRoles = [
            { nivel: 2, role: '854798921973104640' }, { nivel: 4, role: '854798695408599070' },
            { nivel: 6, role: '854798497294450739' }, { nivel: 10, role: '854798018548203561' },
            { nivel: 14, role: '854797594337607691' }, { nivel: 20, role: '854797015707942953' },
            { nivel: 25, role: '854796354706210856' }, { nivel: 30, role: '854796113827856424' },
            { nivel: 35, role: '854795568164634624' }, { nivel: 40, role: '854794462102421545' },
            { nivel: 50, role: '854794008953618452' }, { nivel: 60, role: '854793694980735006' },
            { nivel: 70, role: '854792688364945430' }, { nivel: 80, role: '854791880268316702' },
            { nivel: 100, role: '854791336586117160' }
        ]
        
        /*{
            '2': '854798921973104640',
            '4': '854798695408599070',
            '6': '854798497294450739',
            '10': '854798018548203561',
            '14': '854797594337607691',
            '20': '854797015707942953',
            '25': '854796354706210856',
            '30': '854796113827856424',
            '35': '854795568164634624',
            '40': '854794462102421545',
            '50': '854794008953618452',
            '60': '854793694980735006',
            '70': '854792688364945430',
            '80': '854791880268316702',
            '100': '854791336586117160'
        }*/
    }
}