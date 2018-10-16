"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utility methods related to generating random
 * based values.
 */
var RandomUtils;
(function (RandomUtils) {
    /**
     * Generate a random string that uses alphanumeric characters.
     * @param length The lenght of the random string.
     * @returns The generated string.
     */
    function generateRandomString(length) {
        if (length < 1) {
            throw new Error('Length must be greater than 1!');
        }
        let text = '';
        let possibleChars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ0123456789';
        for (let i = 0; i < length; i++) {
            text += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
        }
        return text;
    }
    RandomUtils.generateRandomString = generateRandomString;
})(RandomUtils = exports.RandomUtils || (exports.RandomUtils = {}));

//# sourceMappingURL=randomutils.js.map
