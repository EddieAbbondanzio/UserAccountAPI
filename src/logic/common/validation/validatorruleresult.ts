
/**
 * The result of a single validation rule.
 * Contains an indicator if the rule was valid,
 * and if invalid, an error message.
 */
export class ValidatorRuleResult {
    /**
     * If the rule was met.
     */
    public isValid: boolean;

    /**
     * The error message if any.
     */
    public error: string;

    /**
     * Create a new validation rule result set.
     * @param isValid If the rule was valid.
     * @param error The error message.
     */
    constructor(isValid?: boolean, error?: string) {
        if(typeof isValid === 'boolean') {
            this.isValid = isValid;
        }
        else {
            this.isValid = false;
        }

        this.error = error;
    }
}