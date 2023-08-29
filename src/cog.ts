import { CommandInteraction } from "discord.js";
import { CogSlashCommand, SlashCommand, SlashCommandMetadata } from "./command";
import { ArgumentType, CommandArgument } from "./argument";
import { CogDecoratorException } from "./errors";

export abstract class Cog
{
    [key: string]: any;

    static command(name? : string, description? : string)
    {
        return function (target: Cog, propertyKey : string, descriptor: PropertyDescriptor)
        {
            Cog.checkFunction(target, propertyKey, descriptor);

            if (!name || name === "")
                name = propertyKey;

            const metadata = new SlashCommandMetadata(name, description);
            if (descriptor.value.args != undefined)
            {
                for (const arg of descriptor.value.args)
                {
                    metadata.addArg(arg);
                }
            }
            Reflect.defineMetadata(SlashCommandMetadata.COMMAND_METADATA_KEY, metadata, target, propertyKey);
        }
    }

    static argument(name: string, type?: ArgumentType, description?: string, required?: boolean)
    {
        return function(target: Cog, propertyKey: string, descriptor: PropertyDescriptor)
        {
            Cog.checkFunction(target, propertyKey, descriptor);
            if(!name || name === "")
                throw new CogDecoratorException("Argument name cannot be empty");

            descriptor.value.args = descriptor.value.args? descriptor.value.args : [];
            descriptor.value.args.push(new CommandArgument(name, type, description, required));
        }
    }

    private static checkFunction(target: Cog, propertyKey: string, descriptor: PropertyDescriptor)
    {
        if (typeof descriptor.value !== "function")
            throw new CogDecoratorException("@Cog.command decorator can only be applied to functions");

        const types = Reflect.getMetadata("design:paramtypes", target, propertyKey);
        if (types.length != 1 || types[0] != CommandInteraction)
            throw new CogDecoratorException("The decorated function must have exactly one parameter of type CommandInteraction");
    }

    getCommands() : SlashCommand[]
    {
        const commands : SlashCommand[] = [];
        const classPrototype = Object.getPrototypeOf(this);
        const properties = Object.getOwnPropertyNames(classPrototype);
        for (const name of properties)
        {
            if (Reflect.hasMetadata(SlashCommandMetadata.COMMAND_METADATA_KEY, classPrototype, name))
            {
                const metadata = Reflect.getMetadata(SlashCommandMetadata.COMMAND_METADATA_KEY, this, name) as SlashCommandMetadata;
                const command = new CogSlashCommand(metadata, this, name, );
                commands.push(command);
            }
        }
        return commands;
    }
}