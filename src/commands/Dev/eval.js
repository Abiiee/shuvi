const Commands = require('../../structures/Command');
const { promisify, inspect } = require('util');
const { exec } = require('child_process');

module.exports = class Eval extends Commands {
    constructor(client) {
        super(client, {
            name: 'eval',
            aliases: ['e'],
            devsOnly: true,
            guildOnly: false,
        });
    }

    async run(message, args) {
        let evalued = 'undefined';
        switch (args[0]?.toLowerCase() || '') {
            case '-a': {
                if (!args[1]) return message.channel.send('¿Que quieres evaluar?');
                try {
                    evalued = await eval('(async() => {\n' + args.slice(1).join(' ') + '\n})();');
                    evalued = inspect(evalued, { depth: 0 });
                } catch (err) {
                    evalued = err.toString();
                }
                break;
            }
            case '-sh': {
                if (!args[1]) return message.channel.send('¿Que quieres ejecutar en la terminal?');
                evalued = args.slice(1).join(' ');
                try {
                    const { stdout, stderr } = await promisify(exec)(evalued);
                    if (!stdout && !stderr) return message.channel.send('Lo ejecute pero no obtuve ningun resultado.');
                    if (stdout)
                        evalued = stdout;
                    if (stderr)
                        evalued = stderr;
                } catch (err) {
                    evalued = err.toString();
                }
                break;
            }
            default: {
                if (!args[0]) return message.channel.send('¿Que quieres evaluar?');
                try {
                    evalued = await eval(args.join(' '));
                    evalued = inspect(evalued, { depth: 0 });
                } catch (err) {
                    evalued = err.toString();
                }
                break;
            }
        }

        const msg = await message.channel.send({
            content: evalued.slice(0, 1950),
            code: args[0]?.toLowerCase() === '-sh' ? 'sh' : 'js'
        });
        const emojiID = '829478128970629150';
        try {
            await msg.react(emojiID);
            await msg.awaitReactions((r, u) => r.emoji.id === emojiID && u.id === message.author.id, { time: 15000, max: 1, errors: ['time'] });
            if (msg.deletable)
                await msg.delete();
        } catch {
            if (!msg.deleted)
                await msg.reactions.resolve(emojiID)?.users.remove();
        }

        return msg;
    }
}