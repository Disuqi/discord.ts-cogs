"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CogsClient = void 0;
const discord_js_1 = require("discord.js");
const discord_js_2 = require("discord.js");
class CogsClient extends discord_js_1.Client {
    constructor() {
        super(...arguments);
        this.cogs = new Set();
        this.commands = new discord_js_1.Collection();
    }
    addCog(cog) {
        if (this.cogs.has(cog.constructor.name))
            throw new Error(`Cog ${cog.constructor.name} already added! You can only add a cog once`);
        this.cogs.add(cog.constructor.name);
        const cogCommands = cog.getCommands();
        for (const command of cogCommands) {
            if (this.commands.has(command.metadata.commandName))
                throw new Error(`Command ${command.metadata.commandName} already exists!`);
            this.commands.set(command.metadata.commandName, command);
        }
    }
    async syncCommands(token, clientId, guildId) {
        const rest = new discord_js_2.REST().setToken(token);
        const body = [];
        this.commands.forEach(command => {
            const builder = command.build();
            body.push(builder.toJSON());
        });
        if (guildId)
            await rest.put(discord_js_2.Routes.applicationGuildCommands(clientId, guildId), { body: body });
        else
            await rest.put(discord_js_2.Routes.applicationCommands(clientId), { body: body });
    }
}
exports.CogsClient = CogsClient;
