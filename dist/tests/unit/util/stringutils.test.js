"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringutils_1 = require("../../../util/stringutils");
/**
 * Test module for the String Utils helper module.
 */
describe('StringUtils', () => {
    test('isEmpty() returns true for null', () => {
        expect(stringutils_1.StringUtils.isEmpty(null)).toBe(true);
    });
    test('isEmpty() returns true for undefined', () => {
        expect(stringutils_1.StringUtils.isEmpty(undefined)).toBe(true);
    });
    test('isEmpty() returns true for empty string', () => {
        expect(stringutils_1.StringUtils.isEmpty('')).toBe(true);
    });
    test('isEmpty() returns false for a non empty', () => {
        expect(stringutils_1.StringUtils.isEmpty('Bert')).toBe(false);
    });
    test('isBlank() returns true for null', () => {
        expect(stringutils_1.StringUtils.isBlank(null)).toBe(true);
    });
    test('isBlank() returns true for undefined', () => {
        expect(stringutils_1.StringUtils.isBlank(undefined)).toBe(true);
    });
    test('isBlank() returns true for empty string', () => {
        expect(stringutils_1.StringUtils.isBlank('')).toBe(true);
    });
    test('isBlank() returns true for a whitespace string', () => {
        expect(stringutils_1.StringUtils.isBlank('    ')).toBe(true);
    });
    test('isBlank() returns false for a non empty', () => {
        expect(stringutils_1.StringUtils.isBlank('Bert')).toBe(false);
    });
    test('isAlphanumeric() returns false for a null string', () => {
        expect(stringutils_1.StringUtils.isAlphanumeric(null)).toBe(false);
    });
    test('isAlphanumeric() returns false for an undefined string', () => {
        expect(stringutils_1.StringUtils.isAlphanumeric(undefined)).toBe(false);
    });
    test('isAlphanumeric() to return false for an empty string', () => {
        expect(stringutils_1.StringUtils.isAlphanumeric('')).toBe(false);
    });
    test('isAlphanumeric() returns false for a non alphanumeric string', () => {
        expect(stringutils_1.StringUtils.isAlphanumeric('$(#')).toBe(false);
    });
    test('isAlphanumeric returns true for a alphanumeric string', () => {
        expect(stringutils_1.StringUtils.isAlphanumeric('ABC123')).toBe(true);
    });
});

//# sourceMappingURL=stringutils.test.js.map
