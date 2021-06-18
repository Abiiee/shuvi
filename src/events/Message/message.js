const Events = require('../../structures/Event')
const Niveles = require('../../database/niveles')
const { Collection } = require('discord.js')
module.exports = class Message extends Events {
    constructor(client) {
        super(client, {
            name: 'message'
        })
        this.cooldowns = new Collection()
    }

    async run(message) {
        let prefix = process.env.BOT_PREFIX || '!';
        if (!message.author || message.author.bot) return;

        const prefixes = [prefix, `<@${this.client.user.id}>`, `<@!${this.client.user.id}>`];

        const usedPrefix = prefixes.find((p) => message.content.startsWith(p));
        if (!usedPrefix) {
            if(this.checkNivelCooldown(message.author.id)) return;
            let userDB = await Niveles.findOne({ id: message.author.id })
            if(!userDB) userDB = new Niveles({ id: message.author.id })
            userDB.xp += Math.floor(Math.random() * 30) + 3
            const necesario = 250 * (userDB.nivel) * 2
            if(userDB.xp >= necesario) {
                userDB.xp = 0
                userDB.nivel += 1
                const respuesta = [
                    `**${message.member.displayName}**, ¡has subido al nivel **${userDB.nivel}**! Sigue así.`,
                    `**${message.member.displayName}**, ha subido al nivel **${userDB.nivel}**, quiza el sea el elegido.`,
                    `**${message.member.displayName}** has subido al nivel **${userDB.nivel}**, no pares de subir.`,
                    `**${message.member.displayName}** sigue obteniendo más y más niveles, ahora es nivel **${userDB.nivel}**.`,
                    `**${message.member.displayName}**, has subido al nivel **${userDB.nivel}**, todos confiamos en que seguiras subiendo.`
                ][Math.floor(Math.random() * 5)]
                const recompenza = this.client.levelRoles.find(c => c.nivel == userDB.nivel)
                if(recompenza) {
                    await message.member.roles.add(recompenza.role).catch(() => {})
                    await message.member.roles.remove('854844011868454932').catch(() => {})
                    respuesta += `\n\n**Extra:** Consiguio el rol de prestigio **<@&${recompenza.role}>**.`
                }
                message.channel.send({
                    content: respuesta,
                    allowedMentions: {
                        roles: []
                    }
                })
            }
            await userDB.save();
            return;
        };
        if (usedPrefix !== prefix)
            message.mentions.users.delete(message.mentions.users.first().id);

        const args = message.content.slice(usedPrefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const cmd = this.client.commands.find(c => c.name === command || c.aliases.includes(command));
        if (!cmd) return;
        try {
            if (!cmd.canRun(message)) return;
            cmd.run(message, args);
        } catch (e) {
            console.log(e.stack || e);
            message.channel.send(`Un error a ocurrido: ${e.message || e}`);
        }
    }
    checkNivelCooldown(user) {
        if (this.cooldowns.has(user)) return true;
        this.cooldowns.set(user, Date.now() + (60 * 1000));
        setTimeout(() => {
            this.cooldowns.delete(user);
        }, 60 * 1000);
        return false;
    }
}