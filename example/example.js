"use strict";
/* EXAMPLE USAGE OF THE LIBRARY
This example will not work as it is. As it is missing a few things.
To run this locally follow these steps:
1. npm init
2. npm install discord.js reflect-metadata discord.ts-cogs
3. Create a config.json file with a token, appId, and guildId/serverId (guildId is optional)
*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_ts_cogs_1 = require("discord.ts-cogs");
const config_json_1 = require("./config.json");
const client = new discord_ts_cogs_1.CogsClient({ intents: [discord_js_1.GatewayIntentBits.GuildVoiceStates, discord_js_1.GatewayIntentBits.GuildMessages, discord_js_1.GatewayIntentBits.MessageContent] });
client.once(discord_js_1.Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    if (!interaction.isCommand())
        return;
    const command = client.commands.get(interaction.commandName);
    if (command)
        yield command.call(interaction);
    //defined at the bottom of the file
    cogBrain.printCogMemory();
}));
class MyCog extends discord_ts_cogs_1.Cog {
    constructor() {
        super(...arguments);
        this.memory = [];
    }
    //This will create a /ping command, and it will have a "..." description
    ping(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.reply("Pong!");
        });
    }
    //You can also specify the name of the command and give it a description, in this case the command will be /say with the description "Make the bot say something"
    botSay(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let arg1 = interaction.options.data[0].value;
            if (!arg1)
                arg1 = "You did not tell me what to say";
            yield interaction.reply(arg1);
        });
    }
    //You can have multiple arguments of different types, and they will be displayed in the order they are declared. The following arguments are set to be required.
    add(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const a = interaction.options.data[0].value;
            const b = interaction.options.data[1].value;
            yield interaction.reply((a + b).toString());
        });
    }
    memorize(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const what = interaction.options.data[0].value;
            this.memory.push(what);
            yield interaction.reply("I have memorized " + what);
        });
    }
    recall(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const memoryLength = this.memory.length;
            if (memoryLength > 0)
                yield interaction.reply("I recall memorizing " + this.memory[memoryLength - 1]);
            else
                yield interaction.reply("I don't remember memorizing anything");
            //defined at the bottom of the file
            cogBrain.printCogMemory();
        });
    }
}
__decorate([
    discord_ts_cogs_1.Cog.command(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], MyCog.prototype, "ping", null);
__decorate([
    discord_ts_cogs_1.Cog.command("say", "Make the bot say something")
    //For arguments add the argument decorator, and you can specify the name, type and description of the argument
    ,
    discord_ts_cogs_1.Cog.argument("arg1", discord_ts_cogs_1.ArgumentType.String, "What should I say?"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], MyCog.prototype, "botSay", null);
__decorate([
    discord_ts_cogs_1.Cog.command(),
    discord_ts_cogs_1.Cog.argument("a", discord_ts_cogs_1.ArgumentType.Number, "First number", true),
    discord_ts_cogs_1.Cog.argument("b", discord_ts_cogs_1.ArgumentType.Number, "Second number", true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], MyCog.prototype, "add", null);
__decorate([
    discord_ts_cogs_1.Cog.command(),
    discord_ts_cogs_1.Cog.argument("what", discord_ts_cogs_1.ArgumentType.String, "What to memorize", true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], MyCog.prototype, "memorize", null);
__decorate([
    discord_ts_cogs_1.Cog.command(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [discord_js_1.CommandInteraction]),
    __metadata("design:returntype", Promise)
], MyCog.prototype, "recall", null);
class CogBrain {
    constructor(myCog) {
        this.myCog = myCog;
    }
    printCogMemory() {
        console.log(this.myCog.memory);
    }
}
const myCog = new MyCog();
const cogBrain = new CogBrain(myCog);
client.addCog(myCog);
client.syncCommands(config_json_1.token, config_json_1.appId, config_json_1.guildId);
client.login(config_json_1.token);
