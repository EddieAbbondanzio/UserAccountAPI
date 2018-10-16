import { StringUtils } from "../../../util/stringutils";

/**
 * Test module for the String Utils helper module.
 */
describe('StringUtils', () => {
    test('isEmpty() returns true for null', () => {
        expect(StringUtils.isEmpty(null)).toBe(true); 
    });

    test('isEmpty() returns true for undefined', () => {
        expect(StringUtils.isEmpty(undefined)).toBe(true);
    });

    test('isEmpty() returns true for empty string', () => {
        expect(StringUtils.isEmpty('')).toBe(true);
    });

    test('isEmpty() returns false for a non empty', () => {
        expect(StringUtils.isEmpty('Bert')).toBe(false);
    });

    test('isBlank() returns true for null', () => {
        expect(StringUtils.isBlank(null)).toBe(true); 
    });

    test('isBlank() returns true for undefined', () => {
        expect(StringUtils.isBlank(undefined)).toBe(true);
    });

    test('isBlank() returns true for empty string', () => {
        expect(StringUtils.isBlank('')).toBe(true);
    });

    test('isBlank() returns true for a whitespace string', () => {
        expect(StringUtils.isBlank('    ')).toBe(true); 
    });

    test('isBlank() returns false for a non empty', () => {
        expect(StringUtils.isBlank('Bert')).toBe(false);
    });

    test('isAlphanumeric() returns false for a null string', () => {
        expect(StringUtils.isAlphanumeric(null)).toBe(false);
    });

    test('isAlphanumeric() returns false for an undefined string', () => {
        expect(StringUtils.isAlphanumeric(undefined)).toBe(false);
    });

    test('isAlphanumeric() to return false for an empty string', () => {
        expect(StringUtils.isAlphanumeric('')).toBe(false);
    });

    test('isAlphanumeric() returns false for a non alphanumeric string', () => {
        expect(StringUtils.isAlphanumeric('$(#')).toBe(false);
    });

    test('isAlphanumeric returns true for a alphanumeric string', () => {
        expect(StringUtils.isAlphanumeric('ABC123')).toBe(true);
    });
});

