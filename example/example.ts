/* EXAMPLE USAGE OF THE LIBRARY
This example will not work as it is. As it is missing a few things.
To run this locally follow these steps:
1. npm init
2. npm install discord.js reflect-metadata discord.ts-cogs
3. Create a config.json file with a token, appId, and guildId/serverId (guildId is optional)
*/

import { CommandInteraction, Events, GatewayIntentBits } from 'discord.js';
import { Cog, CogsClient, ArgumentType } from 'discord.ts-cogs';
import { token, appId, guildId } from './config.json';

const client = new CogsClient({intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => 
	{
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);
		if (command)
			await command.call(interaction);
        //defined at the bottom of the file
        cogBrain.printCogMemory();
	});

class MyCog extends Cog 
{
    memory : string[] = [];

    //This will create a /ping command, and it will have a "..." description
    @Cog.command()
    async ping(interaction : CommandInteraction)
    {
        await interaction.reply("Pong!");
    }

    //You can also specify the name of the command and give it a description, in this case the command will be /say with the description "Make the bot say something"
    @Cog.command("say", "Make the bot say something")
    //For arguments add the argument decorator, and you can specify the name, type and description of the argument
    @Cog.argument("arg1", ArgumentType.String, "What should I say?")
    async botSay(interaction : CommandInteraction)
    {
        let arg1 = interaction.options.data[0].value as string;
        if(!arg1)
            arg1 = "You did not tell me what to say";
        await interaction.reply(arg1);
    }

    //You can have multiple arguments of different types, and they will be displayed in the order they are declared. The following arguments are set to be required.
    @Cog.command()
    @Cog.argument("a", ArgumentType.Number, "First number", true)
    @Cog.argument("b", ArgumentType.Number, "Second number", true)
    async add(interaction : CommandInteraction)
    {
        const a = interaction.options.data[0].value as number;
        const b = interaction.options.data[1].value as number;
        await interaction.reply((a + b).toString());
    }

    @Cog.command()
    @Cog.argument("what", ArgumentType.String, "What to memorize", true)
    async memorize(interaction : CommandInteraction)
    {
        const what = interaction.options.data[0].value as string;
        this.memory.push(what);
        await interaction.reply("I have memorized " + what);
    }

    @Cog.command()
    async recall(interaction : CommandInteraction)
    {
        const memoryLength = this.memory.length;
        if(memoryLength > 0)
            await interaction.reply("I recall memorizing " + this.memory[memoryLength - 1]);
        else
            await interaction.reply("I don't remember memorizing anything");

        //defined at the bottom of the file
        cogBrain.printCogMemory();
    }
}

class CogBrain
{
    myCog : MyCog;
    constructor(myCog : MyCog)
    {
        this.myCog = myCog;
    }

    printCogMemory()
    {
        console.log(this.myCog.memory);
    }
}

const myCog = new MyCog();
const cogBrain = new CogBrain(myCog);
client.addCog(myCog);
client.syncCommands(token, appId, guildId);
client.login(token);