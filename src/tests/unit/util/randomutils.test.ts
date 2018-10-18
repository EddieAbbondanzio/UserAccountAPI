import { RandomUtils } from "../../../util/randomutils";
import { StringUtils } from "../../../util/stringutils";

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
                RandomUtils.generateRandomString(-1);
            }).toThrow();
        });

        /*
         * Check that the generated string is of proper length.
         */
        it('to generate a random string with the correct length.', () => {
            expect(RandomUtils.generateRandomString(4)).toHaveLength(4);
        });

        /*
         * Check that only alphanumeric characters are used
         * when generating a random string.
         */
        it('it\'s result is alphanumeric.', () => {
            let random: string = RandomUtils.generateRandomString(4);
            expect(StringUtils.isAlphanumeric(random)).toBe(true);
        });
    });
});