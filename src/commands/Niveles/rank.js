const Commands = require('../../structures/Command');
const Niveles = require('../../database/niveles');
const { MessageEmbed } = require('discord.js-light');
const rank = require('../../utils/lb-rank')
module.exports = class Rank extends Commands {
    constructor(client) {
        super(client, {
            name: 'rank',
            aliases: 'rk'
        });
    }

    async run(message, args) {
        let matchUser = args[0]?.match(/^<@!?(\d+)>$/)?.[1] ?? args[0];
        const user = (await this.client.users.fetch(matchUser).catch(() => null)) || message.author

        let userDB = await Niveles.findOne({ id: user.id })
        if(!userDB) userDB = await Niveles.create({ id: user.id, tag: message.author.tag })
        const necesario = 250 * (userDB.nivel) * 2

        message.channel.send({
            embeds: [new MessageEmbed()
             .setAuthor(`${user.tag}`)
             .setThumbnail(user.displayAvatarURL({ dynamic: true }))
             .setDescription(`\`🧪\` **Nivel:** ${userDB.nivel}
\`🧫\` **XP:** ${userDB.xp}/${necesario}`)
             .setColor('#f82983')
             .setFooter(`${user.id === message.author.id ? 'Estás en el puesto' : 'Está en el puesto'} #${(await rank(user)).position}`)]})
    }
};