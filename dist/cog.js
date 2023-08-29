"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cog = void 0;
const command_1 = require("./command");
const argument_1 = require("./argument");
const errors_1 = require("./errors");
class Cog {
    static command(name, description) {
        return function (target, propertyKey, descriptor) {
            if (typeof descriptor.value !== "function")
                throw new errors_1.CogDecoratorException("@Cog.command decorator can only be applied to functions");
            if (!name || name === "")
                name = propertyKey;
            const metadata = new command_1.SlashCommandMetadata(name, description);
            if (descriptor.value.args != undefined) {
                for (const arg of descriptor.value.args) {
                    metadata.addArg(arg);
                }
            }
            Reflect.defineMetadata(command_1.SlashCommandMetadata.COMMAND_METADATA_KEY, metadata, target, propertyKey);
        };
    }
    static argument(name, type, description, required) {
        return function (target, propertyKey, descriptor) {
            if (typeof descriptor.value !== "function")
                throw new errors_1.CogDecoratorException("@Cog.argument decorator can only be applied to functions");
            if (!name || name === "")
                throw new errors_1.CogDecoratorException("Argument name cannot be empty");
            descriptor.value.args = descriptor.value.args ? descriptor.value.args : [];
            descriptor.value.args.push(new argument_1.CommandArgument(name, type, description, required));
        };
    }
    getCommands() {
        const commands = [];
        const classPrototype = Object.getPrototypeOf(this);
        const properties = Object.getOwnPropertyNames(classPrototype);
        for (const name of properties) {
            if (Reflect.hasMetadata(command_1.SlashCommandMetadata.COMMAND_METADATA_KEY, classPrototype, name)) {
                const metadata = Reflect.getMetadata(command_1.SlashCommandMetadata.COMMAND_METADATA_KEY, this, name);
                const command = new command_1.CogSlashCommand(metadata, this, name);
                commands.push(command);
            }
        }
        return commands;
    }
}
exports.Cog = Cog;
