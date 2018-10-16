import 'jest';
import { UserStats } from '../../../../data/user/userstats'

/**
 * Test module for the userstats data model.
 */
describe('UserStats', () => {
    /**
     * The test object to work with.
     */
    let userStats: UserStats;

    beforeEach(() => {
        userStats = new UserStats();
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
    })
});