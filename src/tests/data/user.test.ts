import 'jest';
import { User } from '../../data/user/user'

/**
 * Test module for the user data model.
 */
describe('Users', () => {
    /**
     * The user test object to work with.
     */
    let user: User;

    /**
     * Reset the user before each test.
     */
    beforeEach(() => {
        user = new User();
    });

    /**
     * Check that the isVerified is always false when creating
     * a new user.
     */
    test('Initialized with an isVerified of false.', () => {
        expect(user.isVerified).toBe(false);
    });

    /**
     * Verify that the isDeleted status is always false
     * when creating a new user.
     */
    test('Initialized with an isDeleted of false.', () => {
        expect(user.isDeleted).toBe(false);
    });

    /**
     * Ensure a password is properly set on the suer.
     */
    test('Can set a password.', async () => {
        await user.setPassword('testpass');
        expect(user.passwordHash).toBeDefined();
    });

    /**
     * Ensure that a password is matched up after
     * hashing.
     */
    test('Can verify matching password.', async () => {
        await user.setPassword('testpass');
        expect(await user.validatePassword('testpass')).toBe(true);
    });

    /**
     * Make sure non-matching passwords are rejected.
     */
    test('Can reject an invalid password', async () => {
        await user.setPassword('testpass');
        expect(await user.validatePassword('hunter2')).toBe(false);
    });
});