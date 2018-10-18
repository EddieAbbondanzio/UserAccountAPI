"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stringutils_1 = require("../../../util/stringutils");
/*
 * Test module for the String Utils helper module.
 */
describe('StringUtils', () => {
    /*
    * Tests for the isEmpty method.
    */
    describe('isEmpty()', () => {
        test('returns true for null.', () => {
            expect(stringutils_1.StringUtils.isEmpty(null)).toBe(true);
        });
        test('returns true for undefined.', () => {
            expect(stringutils_1.StringUtils.isEmpty(undefined)).toBe(true);
        });
        test('returns true for empty string.', () => {
            expect(stringutils_1.StringUtils.isEmpty('')).toBe(true);
        });
        test('returns false for a non empty.', () => {
            expect(stringutils_1.StringUtils.isEmpty('Bert')).toBe(false);
        });
    });
    /*
    * Tests for the isBlank method.
    */
    describe('isBlank()', () => {
        test('returns true for null.', () => {
            expect(stringutils_1.StringUtils.isBlank(null)).toBe(true);
        });
        test('returns true for undefined.', () => {
            expect(stringutils_1.StringUtils.isBlank(undefined)).toBe(true);
        });
        test('returns true for empty string.', () => {
            expect(stringutils_1.StringUtils.isBlank('')).toBe(true);
        });
        test('returns true for a whitespace string.', () => {
            expect(stringutils_1.StringUtils.isBlank('    ')).toBe(true);
        });
        test('returns false for a non empty.', () => {
            expect(stringutils_1.StringUtils.isBlank('Bert')).toBe(false);
        });
    });
    /*
    * Tests for the isAlphanumeric method.
    */
    describe('isAlphanumeric()', () => {
        test('returns false for a null string.', () => {
            expect(stringutils_1.StringUtils.isAlphanumeric(null)).toBe(false);
        });
        test('returns false for an undefined string.', () => {
            expect(stringutils_1.StringUtils.isAlphanumeric(undefined)).toBe(false);
        });
        test('to return false for an empty string.', () => {
            expect(stringutils_1.StringUtils.isAlphanumeric('')).toBe(false);
        });
        test('returns false for a non alphanumeric string.', () => {
            expect(stringutils_1.StringUtils.isAlphanumeric('$(#')).toBe(false);
        });
        test('returns true for a alphanumeric string.', () => {
            expect(stringutils_1.StringUtils.isAlphanumeric('ABC123')).toBe(true);
        });
    });
});
//# sourceMappingURL=stringutils.test.js.map