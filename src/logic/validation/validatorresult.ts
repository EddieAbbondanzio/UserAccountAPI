/**
 * The results of a validator performing a 
 * validation on an object.
 */
export class ValidatorResult {
    /**
     * If the object was valid.
     */
    public isValid: boolean;

    /**
     * The errors of the object.
     */
    public errors: string[];

    /**
     * Create a new validation result.
     * @param isValid If the object was valid.
     * @param errors The errors of it (if any).
     */
    constructor(isValid?: boolean, ...errors: string[]) {
        if(typeof isValid === 'boolean') {
            this.isValid = isValid;
        }
        else {
            this.isValid = false;
        }

        this.errors  = errors ? errors : [];
    }
}