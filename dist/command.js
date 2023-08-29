"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CogSlashCommand = exports.SlashCommand = exports.SlashCommandMetadata = exports.Routes = exports.REST = exports.Collection = exports.Client = exports.CommandInteraction = exports.ApplicationCommandOptionBase = exports.SlashCommandAttachmentOption = exports.SlashCommandMentionableOption = exports.SlashCommandRoleOption = exports.SlashCommandChannelOption = exports.SlashCommandUserOption = exports.SlashCommandBooleanOption = exports.SlashCommandNumberOption = exports.SlashCommandIntegerOption = exports.SlashCommandStringOption = exports.SlashCommandBuilder = void 0;
const discord_js_1 = require("discord.js");
Object.defineProperty(exports, "SlashCommandAttachmentOption", { enumerable: true, get: function () { return discord_js_1.SlashCommandAttachmentOption; } });
const discord_js_2 = require("discord.js");
Object.defineProperty(exports, "SlashCommandBooleanOption", { enumerable: true, get: function () { return discord_js_2.SlashCommandBooleanOption; } });
const discord_js_3 = require("discord.js");
Object.defineProperty(exports, "SlashCommandBuilder", { enumerable: true, get: function () { return discord_js_3.SlashCommandBuilder; } });
const discord_js_4 = require("discord.js");
Object.defineProperty(exports, "SlashCommandChannelOption", { enumerable: true, get: function () { return discord_js_4.SlashCommandChannelOption; } });
const discord_js_5 = require("discord.js");
Object.defineProperty(exports, "SlashCommandIntegerOption", { enumerable: true, get: function () { return discord_js_5.SlashCommandIntegerOption; } });
const discord_js_6 = require("discord.js");
Object.defineProperty(exports, "SlashCommandMentionableOption", { enumerable: true, get: function () { return discord_js_6.SlashCommandMentionableOption; } });
const discord_js_7 = require("discord.js");
Object.defineProperty(exports, "SlashCommandNumberOption", { enumerable: true, get: function () { return discord_js_7.SlashCommandNumberOption; } });
const discord_js_8 = require("discord.js");
Object.defineProperty(exports, "SlashCommandRoleOption", { enumerable: true, get: function () { return discord_js_8.SlashCommandRoleOption; } });
const discord_js_9 = require("discord.js");
Object.defineProperty(exports, "SlashCommandStringOption", { enumerable: true, get: function () { return discord_js_9.SlashCommandStringOption; } });
const discord_js_10 = require("discord.js");
Object.defineProperty(exports, "SlashCommandUserOption", { enumerable: true, get: function () { return discord_js_10.SlashCommandUserOption; } });
const discord_js_11 = require("discord.js");
Object.defineProperty(exports, "ApplicationCommandOptionBase", { enumerable: true, get: function () { return discord_js_11.ApplicationCommandOptionBase; } });
const discord_js_12 = require("discord.js");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return discord_js_12.Client; } });
const discord_js_13 = require("discord.js");
Object.defineProperty(exports, "Collection", { enumerable: true, get: function () { return discord_js_13.Collection; } });
const discord_js_14 = require("discord.js");
Object.defineProperty(exports, "CommandInteraction", { enumerable: true, get: function () { return discord_js_14.CommandInteraction; } });
const discord_js_15 = require("discord.js");
Object.defineProperty(exports, "REST", { enumerable: true, get: function () { return discord_js_15.REST; } });
const discord_js_16 = require("discord.js");
Object.defineProperty(exports, "Routes", { enumerable: true, get: function () { return discord_js_16.Routes; } });
require("reflect-metadata");
const argument_1 = require("./argument");
const errors_1 = require("./errors");
class SlashCommandMetadata {
    constructor(commandName, description) {
        this._commandName = commandName;
        this._description = description ? description : "...";
        this._args = new Set();
    }
    get commandName() {
        return this._commandName;
    }
    get description() {
        return this._description;
    }
    addArg(arg) {
        let hasName = false;
        for (const a of this._args) {
            if (a.name == arg.name) {
                hasName = true;
                break;
            }
        }
        if (this._args.has(arg) || hasName)
            throw new errors_1.CommandArgumentException(`Argument ${arg.name} already exists!`);
        this._args.add(arg);
    }
    getArgs() {
        return Array.from(this._args);
    }
}
exports.SlashCommandMetadata = SlashCommandMetadata;
SlashCommandMetadata.COMMAND_METADATA_KEY = "commandMetadata";
class SlashCommand {
    constructor(metadata) {
        this._metadata = metadata;
    }
    get metadata() {
        return this._metadata;
    }
    build() {
        const builder = new discord_js_3.SlashCommandBuilder();
        builder.setName(this.metadata.commandName);
        builder.setDescription(this.metadata.description);
        const args = this.metadata.getArgs();
        for (const arg of args) {
            let option;
            switch (arg.type) {
                case argument_1.ArgumentType.String:
                    option = new discord_js_9.SlashCommandStringOption();
                    this.setupOption(option, arg);
                    builder.addStringOption(option);
                    break;
                case argument_1.ArgumentType.Integer:
                    option = new discord_js_5.SlashCommandIntegerOption();
                    this.setupOption(option, arg);
                    builder.addIntegerOption(option);
                    break;
                case argument_1.ArgumentType.Number:
                    option = new discord_js_7.SlashCommandNumberOption();
                    this.setupOption(option, arg);
                    builder.addNumberOption(option);
                    break;
                case argument_1.ArgumentType.Boolean:
                    option = new discord_js_2.SlashCommandBooleanOption();
                    this.setupOption(option, arg);
                    builder.addBooleanOption(option);
                    break;
                case argument_1.ArgumentType.User:
                    option = new discord_js_10.SlashCommandUserOption();
                    this.setupOption(option, arg);
                    builder.addUserOption(option);
                    break;
                case argument_1.ArgumentType.Channel:
                    option = new discord_js_4.SlashCommandChannelOption();
                    this.setupOption(option, arg);
                    builder.addChannelOption(option);
                    break;
                case argument_1.ArgumentType.Role:
                    option = new discord_js_8.SlashCommandRoleOption();
                    this.setupOption(option, arg);
                    builder.addRoleOption(option);
                    break;
                case argument_1.ArgumentType.Mentionable:
                    option = new discord_js_6.SlashCommandMentionableOption();
                    this.setupOption(option, arg);
                    builder.addMentionableOption(option);
                    break;
                case argument_1.ArgumentType.Attachment:
                    option = new discord_js_1.SlashCommandAttachmentOption();
                    this.setupOption(option, arg);
                    builder.addAttachmentOption(option);
                    break;
            }
        }
        return builder;
    }
    setupOption(option, arg) {
        option.setName(arg.name);
        option.setDescription(arg.description);
        option.setRequired(arg.required);
        return option;
    }
}
exports.SlashCommand = SlashCommand;
class CogSlashCommand extends SlashCommand {
    constructor(metadata, cog, functionName) {
        super(metadata);
        this._cog = cog;
        this._functionName = functionName;
    }
    get functionName() {
        return this._functionName;
    }
    async call(interaction) {
        this._cog[this._functionName](interaction);
    }
}
exports.CogSlashCommand = CogSlashCommand;
