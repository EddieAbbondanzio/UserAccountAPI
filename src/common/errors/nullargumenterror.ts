/**
 * An error for when a method argument is null,
 * and is not an allowed value.
 */
export class NullArgumentError extends Error {
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
        super(argument + ' ' + (message ? message : 'is null.'));
        this.argument = argument;
    }
}