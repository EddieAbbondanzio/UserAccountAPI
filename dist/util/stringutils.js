"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Utility methods for working with strings.
 */
var StringUtils;
(function (StringUtils) {
    /**
     * Checks if the string is null, undefined, or empty ('')
     * @param str The string to test
     * @returns True if the string is empty.
     */
    function isEmpty(str) {
        return (!str || 0 === str.length);
    }
    StringUtils.isEmpty = isEmpty;
    /**
     * Checks if a string is null, undefined, or blank.
     * @param str The string to test.
     * @returns True if the string is only whitespace.
     */
    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }
    StringUtils.isBlank = isBlank;
    /**
     * Checks if a string is alphanumeric(A-Z, 0-9)
     * @param str The string to test.
     */
    function isAlphanumeric(str) {
        if (str) {
            return /^[a-z0-9]+$/i.test(str);
        }
        return false;
    }
    StringUtils.isAlphanumeric = isAlphanumeric;
})(StringUtils = exports.StringUtils || (exports.StringUtils = {}));

//# sourceMappingURL=stringutils.js.map
