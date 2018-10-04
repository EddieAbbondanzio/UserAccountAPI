
/**
 * Utility methods related to generating random
 * based values.
 */
export class RandomUtils {
    /**
     * Generate a random string that uses alphanumeric characters.
     * @param length The lenght of the random string.
     * @returns The generated string.
     */
    public static generateRandomString(length: number):string {
        let text = '';
        let possibleChars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789'

        for(let i  = 0; i < length; i++){
            text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }

        return text;
    }
}