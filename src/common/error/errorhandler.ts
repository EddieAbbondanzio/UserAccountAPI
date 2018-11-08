
/**
 * An error handler offers some extra functionality for
 * only catching errors of specific types, etc..
 */
export class ErrorHandler<T extends Error> {
    /**
     * The error being handled.
     */
    public error: T;

    /**
     * If the error has been caught or not.
     */
    private wasCaught: boolean;

    /**
     * Create a new error handler for dealing
     * with an error in a try catch.
     * @param error The error to work with.
     */
    constructor(error?: T){
        this.error = error;
        this.wasCaught = false;
    }

    /**
     * Catch the error only if it matches the constructor
     * passed in.
     * @param constructor The constructor of the error
     * we should be trying to catch.
     * @param handler The handler to call if the error is of
     * the type.
     */
    public catch<U>(constructor: IConstructor<U>, handler: (err: T) => void): ErrorHandler<T> {
        if(this.wasCaught){
            return this;
        }

        if(this.error instanceof constructor) {
            this.wasCaught = true;
            handler(this.error);
        }

        return this;
    } 

    /**
     * Catch the error if nothing else caught it.
     * @param handler The handler to call if nothing else caught it.
     */
    public otherwise(handler: (err: Error) => void): void {
        if(!this.wasCaught){
            handler(this.error);
        }
    }

    /**
     * If the error has not been caught yet, throw it
     * again so we can pass it to a higher up.
     */
    public otherwiseRaise(): void {
        if(!this.wasCaught){
            throw this.error;
        }
    }
}