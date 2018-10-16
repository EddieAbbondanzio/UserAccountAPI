
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
     */
    export function isAlphanumeric(str: string):boolean {
        if(str){
            return /^[a-z0-9]+$/i.test(str);
        }

        return false;
    }
}