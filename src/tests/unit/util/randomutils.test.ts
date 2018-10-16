import { RandomUtils } from "../../../util/randomutils";

/**
 * Test module for the RandomUtils helper module.
 */
describe('RandomUtils', () => {
    it('generateRandomString() should throw error  when length < 1', () => { 
        expect(() => {
            RandomUtils.generateRandomString(-1);
        }).toThrow();
    });

    it('generateRandomString() to generate a random', () => {
        expect(RandomUtils.generateRandomString(4)).toHaveLength(4);
    });
});