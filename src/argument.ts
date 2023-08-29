export enum ArgumentType
{
    String = 0,
    Integer = 1,
    Number = 2,
    Boolean = 3,
    User = 4,
    Channel = 5,
    Role = 6,
    Mentionable = 7,
    Attachment = 8
}


export class CommandArgument
{
    private _name: string;
    private _description: string;
    private _type: ArgumentType;
    private _required: boolean;

    constructor(name: string, type?: ArgumentType, descritprion?: string, required?: boolean)
    {
        this._name = name;
        this._type = type? type : ArgumentType.String;
        this._description = descritprion? descritprion : "...";
        this._required = required? required : true;
    }

    get name() : string
    {
        return this._name;
    }

    get description() : string
    {
        return this._description;
    }

    get type() : ArgumentType
    {
        return this._type;
    }

    get required() : boolean
    {
        return this._required;
    }
}