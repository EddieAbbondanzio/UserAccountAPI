
/**
 * An argument error is for when a function
 * argument is invalid such as being null or
 * undefined.
 */
export class ArgumentError extends Error {
    /**
     * The name of the invalid argument.
     */
    public argument: string;

    /**
     * Create a new invalid argument error.
     * @param argument The name of the argument.
     * @param message The error message.
     */
    constructor(argument: string, message?: string){
        super(argument + ' ' + (message ? message : 'is invalid.'));
        this.argument = argument;
    }
}