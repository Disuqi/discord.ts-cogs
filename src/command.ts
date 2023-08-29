import { SlashCommandAttachmentOption,  } from "discord.js";
import { SlashCommandBooleanOption,  } from "discord.js";
import { SlashCommandBuilder,  } from "discord.js";
import { SlashCommandChannelOption,  } from "discord.js";
import { SlashCommandIntegerOption,  } from "discord.js";
import { SlashCommandMentionableOption,  } from "discord.js";
import { SlashCommandNumberOption,  } from "discord.js";
import { SlashCommandRoleOption,  } from "discord.js";
import { SlashCommandStringOption,  } from "discord.js";
import { SlashCommandUserOption,  } from "discord.js";
import { ApplicationCommandOptionBase,  } from "discord.js";
import { Client,  } from "discord.js";
import { Collection,  } from "discord.js";
import { CommandInteraction } from "discord.js";
import { REST,  } from "discord.js";
import { RESTPostAPIChatInputApplicationCommandsJSONBody,  } from "discord.js";
import { Routes,  } from "discord.js";
import "reflect-metadata";

export { SlashCommandBuilder, SlashCommandStringOption, SlashCommandIntegerOption, SlashCommandNumberOption, SlashCommandBooleanOption, SlashCommandUserOption, SlashCommandChannelOption, SlashCommandRoleOption, SlashCommandMentionableOption, SlashCommandAttachmentOption, ApplicationCommandOptionBase, CommandInteraction, Client, Collection, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes, };

import { Cog } from "./cog";
import { ArgumentType, CommandArgument } from "./argument";
import { CommandArgumentException } from "./errors";


export class SlashCommandMetadata
{
    static COMMAND_METADATA_KEY = "commandMetadata";
    protected _commandName : string;
    protected _description: string;
    protected _args: Set<CommandArgument>;

    constructor(commandName : string, description? : string)
    {
        this._commandName = commandName;
        this._description = description? description : "...";
        this._args = new Set();
    }

    get commandName() : string
    {
        return this._commandName;
    }

    get description() : string
    {
        return this._description;
    }

    addArg(arg: CommandArgument)
    {
        let hasName = false;
        for (const a of this._args)
        {
            if (a.name == arg.name)
            {
                hasName = true;
                break;
            }
        }

        if (this._args.has(arg) || hasName)
            throw new CommandArgumentException(`Argument ${arg.name} already exists!`);

        this._args.add(arg);
    }

    getArgs() : CommandArgument[]
    {
        return Array.from(this._args);
    }
}

export abstract class SlashCommand
{
    private _metadata : SlashCommandMetadata;
    constructor(metadata: SlashCommandMetadata)
    {
        this._metadata = metadata;
    }

    get metadata() : SlashCommandMetadata
    {
        return this._metadata;
    }

    build() : SlashCommandBuilder
    {
        const builder = new SlashCommandBuilder();
        builder.setName(this.metadata.commandName);
        builder.setDescription(this.metadata.description);
        const args = this.metadata.getArgs();
        for (const arg of args)
        {
            let option : ApplicationCommandOptionBase;
            switch (arg.type)
            {
                case ArgumentType.String:
                    option = new SlashCommandStringOption();
                    this.setupOption(option, arg);
                    builder.addStringOption(option as SlashCommandStringOption);
                    break;
                case ArgumentType.Integer:
                    option = new SlashCommandIntegerOption();
                    this.setupOption(option, arg);
                    builder.addIntegerOption(option as SlashCommandIntegerOption);
                    break;
                case ArgumentType.Number:
                    option = new SlashCommandNumberOption();
                    this.setupOption(option, arg);
                    builder.addNumberOption(option as SlashCommandNumberOption);
                    break;
                case ArgumentType.Boolean:
                    option = new SlashCommandBooleanOption();
                    this.setupOption(option, arg);
                    builder.addBooleanOption(option as SlashCommandBooleanOption);
                    break;
                case ArgumentType.User:
                    option = new SlashCommandUserOption();
                    this.setupOption(option, arg);
                    builder.addUserOption(option as SlashCommandUserOption);
                    break;
                case ArgumentType.Channel:
                    option = new SlashCommandChannelOption();
                    this.setupOption(option, arg);
                    builder.addChannelOption(option as SlashCommandChannelOption);
                    break;
                case ArgumentType.Role:
                    option = new SlashCommandRoleOption();
                    this.setupOption(option, arg);
                    builder.addRoleOption(option as SlashCommandRoleOption);
                    break;
                case ArgumentType.Mentionable:
                    option = new SlashCommandMentionableOption();
                    this.setupOption(option, arg);
                    builder.addMentionableOption(option as SlashCommandMentionableOption);
                    break;
                case ArgumentType.Attachment:
                    option = new SlashCommandAttachmentOption();
                    this.setupOption(option, arg);
                    builder.addAttachmentOption(option as SlashCommandAttachmentOption);
                    break;
            }
        }
        return builder;
    }

    private setupOption(option: ApplicationCommandOptionBase, arg: CommandArgument)
    {
        option.setName(arg.name);
        option.setDescription(arg.description);
        option.setRequired(true);
        return option;
    }

    abstract call(interaction: CommandInteraction) : Promise<void>;
}


export class IndependentSlashCommand extends SlashCommand
{
	private _function : (interaction: CommandInteraction) => Promise<void>;

	constructor(metadata: SlashCommandMetadata, func: (interaction: CommandInteraction) => Promise<void>)
	{
		super(metadata);
		this._function = func;
	}

	async call(interaction: CommandInteraction)
	{
		await this._function(interaction);
	}
}


export class CogSlashCommand extends SlashCommand
{
    private _cog : Cog;
    private _functionName : string;

    constructor( metadata: SlashCommandMetadata, cog: Cog, functionName: string)
    {
        super(metadata);
        this._cog = cog;
        this._functionName = functionName;
    }

    get functionName() : string
    {
        return this._functionName;
    }

    async call(interaction : CommandInteraction)
    {
        this._cog[this._functionName](interaction);
    }
}
