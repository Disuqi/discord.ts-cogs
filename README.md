# Intro 
This is a TypeScipt package and extension for the discord.js library, which introduces cogs for discord.js (inspired by discord.py). 
This package also includes a new way to handle commands, thorugh decorators and new classes that encapsulate the command logic.
## Installation
To install this package, run the following command:
```npm install discord.ts-cogs```
## Usage
### Creating a cog
To create a cog, you need to create a class that extends the <a href="https://github.com/Disuqi/discord.ts-cogs/blob/main/src/cog.ts#L6">`Cog`</a> class.
Within your cog class use the decorators <a href="https://github.com/Disuqi/discord.ts-cogs/blob/main/src/cog.ts#L10">`@Cog.command`</a> and <a href="https://github.com/Disuqi/discord.ts-cogs/blob/main/src/cog.ts#L33">`@Cog.argument`</a>, to specify which functions are slash commands.
In the `@Cog.command` decorator you can specify the name and description of the command, however this is not a requirement, if you do not specify a name, it will default to the function name, and if you do not specify a description it will default to "...".
In the `@Cog.argument` decorator you can specify the name, type, description and if the argument is required of the argument, the name is the only requirement. The type is an <a href="https://github.com/Disuqi/discord.ts-cogs/blob/main/src/argument.ts#L1">`ArgumentType`</a> enum; that will default to being a string, the description will default to "..." and if the argument is required will default to false.

### Example of a Cog
```ts
import { Cog } from "discord.ts-cogs";

class MyCog extends Cog 
{
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
}
```

### Adding a cog to the bot
To add the cog you will need to use the <a href="https://github.com/Disuqi/discord.ts-cogs/blob/main/src/cogs-client.ts">`CogsClient`</a>, it has a method called `addCog` which takes a cog object as a parameter.
This function will automatically add the commands to the bot.
The `CogsClient` inherits from the discord.js <a href="https://old.discordjs.dev/#/docs/discord.js/main/class/Client">`Client`</a> class, therefore, it is the same class, but with a few extra features.
This client also contains a `syncCommands` method, which will sync the slash commands with the discord api, this will automatically sync cog commands, however, the cog will need to be added first.
```ts
const client = new CogsClient({intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.addCog(new MyCog());

//sync with a specific guild/server
client.syncCommands(token, appid, guildid);
//or sync with all guilds/servers
client.syncCommands(token, appid);

client.login(token);
```
### Handling commands
This package also introduces a new way to handle commands. The `CogsClient` has a `Collection<string, SlashCommand>`, where the key is the name of the command, and the value is a <a href="https://github.com/Disuqi/discord.ts-cogs/blob/main/src/command.ts#L75">`SlashCommand`</a> object which is a new class specific to this package, this class has a `call` function, which will call the function from the cog _parent_ object.
```ts
client.on(Events.InteractionCreate, async interaction => 
	{
		if (!interaction.isCommand()) return;

		const command = client.commands.get(interaction.commandName);
		if (command)
			await command.call(interaction);
	});
```

## Benefits of using Cogs
Cog can have properties which can be used in the command functions, and shared across functions within that cog, as well as other classes, if the instance of the cog is given. Furthermore, it facilitates the creation, addittion, and handling of slash commands.
Checkout the <a href="https://github.com/Disuqi/discord.ts-cogs/blob/main/example/example.ts">complete example code</a> for better understanding. 
