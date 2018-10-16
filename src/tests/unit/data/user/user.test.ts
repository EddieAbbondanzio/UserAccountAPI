import 'jest';
import { User } from '../../../../data/user/user'

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
     * Typeorm doesn't want any values defaulted
     * when creating a new instance.
     */
    test('Initialized with an id of undefined.', () => {
        expect(user.id).toBeUndefined();
    });

    /**
     * Typeorm doesn't want any values defaulted.
     */
    test('Initialized with a username of undefined.', () => {
        expect(user.username).toBeUndefined();
    });

    /**
     * Typeorm doesn't want any values defaulted.
     */
    test('Initialized with a password hash of undefined.', () => {
        expect(user.passwordHash).toBeUndefined();
    });
    
    /**
     * Typeorm doesn't want any values defaulted.
     */
    test('Initialized with a name of undefined.', () => {
        expect(user.name).toBeUndefined();
    });

    /**
     * Typeorm doesn't want any values defaulted.
     */
    test('Initialized with an email of undefined.', () => {
        expect(user.email).toBeUndefined();
    });

    /**
     * Check that the isVerified is always false when creating
     * a new user.
     */
    test('Initialized with an isVerified of undefined.', () => {
        expect(user.isVerified).toBeUndefined();
    });

    /**
     * Verify that the isDeleted status is always false
     * when creating a new user.
     */
    test('Initialized with an isDeleted of undefined.', () => {
        expect(user.isDeleted).toBeUndefined();
});

    /**
     * Passwords shorter than the min length will throw an
     * error.
     */
    test('Can not set a password shorter than the min.', async () => {
        await expect(user.setPassword('a')).rejects.toThrow();
    });

    /**
     * Ensure a password is properly set on the suer.
     */
    test('Can set a valid password.', async () => {
        await user.setPassword('testpass');
        expect(user.passwordHash).toBeDefined();
    });

    /**
     * Ensure that a password is matched up after
     * hashing.
     */
    test('Can verify matching password.', async () => {
        await user.setPassword('testpass');
        await expect(await user.validatePassword('testpass')).toBe(true);
    });

    /**
     * Make sure non-matching passwords are rejected.
     */
    test('Can reject an invalid password', async () => {
        await user.setPassword('testpass');
        await expect(await user.validatePassword('hunter2')).toBe(false);
    });
});