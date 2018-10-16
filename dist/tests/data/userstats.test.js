"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const userstats_1 = require("../../data/user/userstats");
describe('UserStats', () => {
    /**
     * The test object to work with.
     */
    let userStats;
    beforeEach(() => {
        userStats = new userstats_1.UserStats();
    });
    /**
     * Typeorm doesn't like defaults.
     */
    test('Initialized with a user value of undefined.', () => {
        expect(userStats.user).toBeUndefined();
    });
    /**
     * Typeorm doesn't like defaults.
     */
    test('Initialized with a joined date of undefined.', () => {
        expect(userStats.joinedDate).toBeUndefined();
    });
});

//# sourceMappingURL=userstats.test.js.map
