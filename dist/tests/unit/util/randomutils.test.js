"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const randomutils_1 = require("../../../util/randomutils");
const stringutils_1 = require("../../../util/stringutils");
/*
 * Test module for the RandomUtils helper module.
 */
describe('RandomUtils', () => {
    /*
     * Test module for the generateRandomString
     * method.
     */
    describe('generateRandomString()', () => {
        /*
         * Check to ensure that the method throws an error when
         * an invalid length of 0 or less is passed in.
         */
        it('throws an error when length < 1.', () => {
            expect(() => {
                randomutils_1.RandomUtils.generateRandomString(-1);
            }).toThrow();
        });
        /*
         * Check that the generated string is of proper length.
         */
        it('to generate a random string with the correct length.', () => {
            expect(randomutils_1.RandomUtils.generateRandomString(4)).toHaveLength(4);
        });
        /*
         * Check that only alphanumeric characters are used
         * when generating a random string.
         */
        it('it\'s result is alphanumeric.', () => {
            let random = randomutils_1.RandomUtils.generateRandomString(4);
            expect(stringutils_1.StringUtils.isAlphanumeric(random)).toBe(true);
        });
    });
});
//# sourceMappingURL=randomutils.test.js.map