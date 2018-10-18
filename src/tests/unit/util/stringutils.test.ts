import { StringUtils } from "../../../util/stringutils";

/*
 * Test module for the String Utils helper module.
 */
describe('StringUtils', () => {
    /*
    * Tests for the isEmpty method.
    */
    describe('isEmpty()', () => {
        test('returns true for null.', () => {
            expect(StringUtils.isEmpty(null)).toBe(true); 
        });
    
        test('returns true for undefined.', () => {
            expect(StringUtils.isEmpty(undefined)).toBe(true);
        });
    
        test('returns true for empty string.', () => {
            expect(StringUtils.isEmpty('')).toBe(true);
        });
    
        test('returns false for a non empty.', () => {
            expect(StringUtils.isEmpty('Bert')).toBe(false);
        });
    });

    /*
    * Tests for the isBlank method.
    */
    describe('isBlank()', () => {
        test('returns true for null.', () => {
            expect(StringUtils.isBlank(null)).toBe(true); 
        });
    
        test('returns true for undefined.', () => {
            expect(StringUtils.isBlank(undefined)).toBe(true);
        });
    
        test('returns true for empty string.', () => {
            expect(StringUtils.isBlank('')).toBe(true);
        });
    
        test('returns true for a whitespace string.', () => {
            expect(StringUtils.isBlank('    ')).toBe(true); 
        });

        test('returns false for a non empty.', () => {
            expect(StringUtils.isBlank('Bert')).toBe(false);
        });
    });

    /*
    * Tests for the isAlphanumeric method.
    */
    describe('isAlphanumeric()', () => {
        test('returns false for a null string.', () => {
            expect(StringUtils.isAlphanumeric(null)).toBe(false);
        });
    
        test('returns false for an undefined string.', () => {
            expect(StringUtils.isAlphanumeric(undefined)).toBe(false);
        });
    
        test('to return false for an empty string.', () => {
            expect(StringUtils.isAlphanumeric('')).toBe(false);
        });
    
        test('returns false for a non alphanumeric string.', () => {
            expect(StringUtils.isAlphanumeric('$(#')).toBe(false);
        });
    
        test('returns true for a alphanumeric string.', () => {
            expect(StringUtils.isAlphanumeric('ABC123')).toBe(true);
        });
    });
});