"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandArgumentException = exports.CommandException = exports.CogDecoratorException = void 0;
class BaseCogException extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
class CogDecoratorException extends BaseCogException {
}
exports.CogDecoratorException = CogDecoratorException;
class CommandException extends BaseCogException {
}
exports.CommandException = CommandException;
class CommandArgumentException extends BaseCogException {
}
exports.CommandArgumentException = CommandArgumentException;
