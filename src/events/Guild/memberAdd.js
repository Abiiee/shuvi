const Events = require('../../structures/Event')

module.exports = class Ready extends Events {
    constructor(client) {
        super(client, {
            name: 'guildMemberAdd'
        })
    }
    async run(member) {
        if (member.guild.id !== '854738921287057428') return;
        if (member.user.bot) {
            await member.roles.add('854744769887338537').catch(() => { })
        } else {
            const channel = this.client.channels.fetch('854855767194992640').catch(() => {})
            if(channel) channel.send([
                `Contaba la leyenda que un usuario entró épicamente al servidor, parece que ${member} es real.`,
                `${member} ¡Creo que eres el usuario que estábamos buscando, Bienvenido!`,
                `Sabios dicen que había un dios con tu nombre ${member}, por eso eres bienvenido.`,
                `Dicen que eres uno de los que desafió a los sin nombre, eres bienvenido ${member}`,
                `${member} ¿Tratas de refugiarte de la guerra? Nosotros te protegeremos.`,
            ][Math.floor(Math.random() * 5)])
            await [
                '854844011868454932',
                '854757480743829555',
                '854776444534390797',
                '854801483127193660',
            ].forEach(async (r) => await member.roles.add(r).catch(() => { }))
        }

    }
}