"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandArgument = exports.ArgumentType = void 0;
var ArgumentType;
(function (ArgumentType) {
    ArgumentType[ArgumentType["String"] = 0] = "String";
    ArgumentType[ArgumentType["Integer"] = 1] = "Integer";
    ArgumentType[ArgumentType["Number"] = 2] = "Number";
    ArgumentType[ArgumentType["Boolean"] = 3] = "Boolean";
    ArgumentType[ArgumentType["User"] = 4] = "User";
    ArgumentType[ArgumentType["Channel"] = 5] = "Channel";
    ArgumentType[ArgumentType["Role"] = 6] = "Role";
    ArgumentType[ArgumentType["Mentionable"] = 7] = "Mentionable";
    ArgumentType[ArgumentType["Attachment"] = 8] = "Attachment";
})(ArgumentType || (exports.ArgumentType = ArgumentType = {}));
class CommandArgument {
    constructor(name, type, descritprion, required) {
        this._name = name;
        this._type = type ? type : ArgumentType.String;
        this._description = descritprion ? descritprion : "...";
        this._required = required ? required : true;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get type() {
        return this._type;
    }
    get required() {
        return this._required;
    }
}
exports.CommandArgument = CommandArgument;
