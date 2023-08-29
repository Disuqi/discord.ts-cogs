import { Client, Collection } from "discord.js";
import { Cog } from "./cog";
import { SlashCommand } from "./command";
import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js";

export class CogsClient extends Client
{
	cogs: Set<string> = new Set();
	commands : Collection<string, SlashCommand> = new Collection();

	addCog(cog: Cog)
	{
		if (this.cogs.has(cog.constructor.name))
			throw new Error(`Cog ${cog.constructor.name} already added! You can only add a cog once`);

		this.cogs.add(cog.constructor.name);
		const cogCommands = cog.getCommands();
		for (const command of cogCommands)
		{
			if (this.commands.has(command.metadata.commandName))
				throw new Error(`Command ${command.metadata.commandName} already exists!`);

			this.commands.set(command.metadata.commandName, command);
		}
	}

	async syncCommands(token : string, clientId : string, guildId : string)
	{
        const rest = new REST().setToken(token);
		const body: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
		this.commands.forEach(command =>
		{
			const builder = command.build();
            body.push(builder.toJSON());
		});
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: body });
	}
}