// import { CommandInteraction, Events, GatewayIntentBits, Interaction } from 'discord.js';
// import { token } from '../config.json';
// import { Cog, CogsClient } from '../src';
// const client = new CogsClient([GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]);
// client.once(Events.ClientReady, c => {
// 	console.log(`Ready! Logged in as ${c.user.tag}`);
// });
// client.on(Events.InteractionCreate, async interaction => 
// 	{
// 		if (!interaction.isCommand()) return;
// 		const command = client.commands.get(interaction.commandName);
// 		if (command)
// 			await command.call(interaction);
// 	});
// class TestCog extends Cog
// {
// 	private x : number;
// 	@Cog.command()
// 	@Cog.argument('test', ArgumentType.String)
// 	async test(interaction: CommandInteraction)
// 	{
// 		console.log(interaction.options);
// 		interaction.reply('test successfull');
// 	}
// }
// client.addCog(new TestCog());
// client.syncCommands();
// client.login(token);
