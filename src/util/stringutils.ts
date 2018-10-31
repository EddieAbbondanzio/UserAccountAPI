
/**
 * Utility methods for working with strings.
 */
export module StringUtils {
    /**
     * Checks if the string is null, undefined, or empty ('')
     * @param str The string to test
     * @returns True if the string is empty.
     */
    export function isEmpty(str: string):boolean {
        return (!str || 0 === str.length);
    }

    /**
     * Checks if a string is null, undefined, or blank.
     * @param str The string to test.
     * @returns True if the string is only whitespace.
     */
    export function isBlank(str: string):boolean {
        return (!str || /^\s*$/.test(str));
    }

    /**
     * Checks if a string is alphanumeric(A-Z, 0-9)
     * @param str The string to test.
     * @returns True if the string is only integers or letters.
     */
    export function isAlphanumeric(str: string):boolean {
        if(str){
            return /^[a-z0-9]+$/i.test(str);
        }

        return false;
    }

    /**
     * Checks if a string is numeric (0-9)
     * @param str The string to test.
     * @returns True if the string is only integers.
     */
    export function isNumeric(str: string):boolean {
        if(str){
            return /^[0-9]+$/i.test(str);
        }

        return false;
    }

    /**
     * Check if a string is a valid email.
     * @param str The string to test.
     * @returns True if the string is an email.
     */
    export function isEmail(str: string): boolean {
        var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(str);
    }
}