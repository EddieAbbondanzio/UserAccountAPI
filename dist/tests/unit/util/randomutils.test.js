"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const randomutils_1 = require("../../../util/randomutils");
/**
 * Test module for the RandomUtils helper module.
 */
describe('RandomUtils', () => {
    it('generateRandomString() should throw error  when length < 1', () => {
        expect(() => {
            randomutils_1.RandomUtils.generateRandomString(-1);
        }).toThrow();
    });
    it('generateRandomString() to generate a random', () => {
        expect(randomutils_1.RandomUtils.generateRandomString(4)).toHaveLength(4);
    });
});

//# sourceMappingURL=randomutils.test.js.map
