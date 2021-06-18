const { MessageEmbed } = require('discord.js');
const Commands = require('../../structures/Command');
const rank = require('../../utils/lb-rank')

module.exports = class Lb extends Commands {
    constructor(client) {
        super(client, {
            name: 'leaderboard',
            aliases: ['lb', 'tabla']
        });
    }

    async run(message, args) {
        const chunkSize = 10;
        const ranks = await rank(message.author)
        const arr = ranks.ordenado
        const groups = arr.map((e, i) => {
            return i % chunkSize === 0 ? arr.slice(i, i + chunkSize) : null;
        }).filter(e => { return e; });
        let page = 1;
        if (!isNaN(parseInt(args[0]?.toLowerCase())))
            page = parseInt(args[0]?.toLowerCase());
        if (page > groups.length || page < 1)
            page = 1
        message.channel.send({
            embeds: [
                new MessageEmbed()
                .setAuthor(`Top de usuarios con más nivel`)
                .setDescription((await Promise.all(groups[page - 1].map(async (u, i) => { 
                    let user = await this.client.users.fetch(u.id).catch(() => {})
                    const number = ((page - 1) * 10) + (i + 1);
                    return `${number === 1 ? '🥇' : (number === 2 ? '🥈' : (number === 3 ? '🥉' : `\`[${number}]\``))} - ${user ? user.tag : `# (${u.id})`} - \`🧪\` **Nivel:** ${u.nivel} \`🧫\` **XP:** ${u.xp}`;
                }))).join('\n'))
                .setColor('#f82983')
                .setFooter(`Estás en la posición #${ranks.position} - Página: ${page}/${groups.length}`)
            ]
        })
    }
};