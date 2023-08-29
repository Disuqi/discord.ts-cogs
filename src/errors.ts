class BaseCogException extends Error
{
    constructor(message?: string)
    {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class CogDecoratorException extends BaseCogException{}
export class CommandException extends BaseCogException{}
export class CommandArgumentException extends BaseCogException{}