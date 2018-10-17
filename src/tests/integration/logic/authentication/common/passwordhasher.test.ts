import { PasswordHasher } from "../../../../../logic/authentication/common/passwordhasher";

/**
 * Test module for the PasswordHasher
 */
describe('PasswordHasher', () => {
    /**
     * No password passed should result in an error.
     */
    it('Should throw an error when no password is passed.', async () => {
        await expect(PasswordHasher.generateHash(undefined)).rejects.toThrow();
    });

    /**
     * Null passwords should never be hashed.
     */
    it('Should throw an error when null is passed.', async () => {
        await expect(PasswordHasher.generateHash(null)).rejects.toThrow();
    });

    /**
     * Blank passwords should be forbidden, and an error should
     * always be thrown.
     */
    it('Should throw an error when a blank password is passed', async () => {
        await expect(PasswordHasher.generateHash('   ')).rejects.toThrow();
    });

    /**
     * Check to ensure that it can successfully hash passwords.
     */
    it('Should properly hash a password.', async () => {
        let hash: string = await PasswordHasher.generateHash('Hunter2');
        expect(hash).toBeDefined();        
    });

    /**
     * When no password is passed into the validate method an
     * error should be thrown.
     */
    it('An error is thrown when no password to validate', async () => {
        await expect(PasswordHasher.validateHash(undefined, 'HASH')).rejects.toThrow();
    });

    /**
     * When no hash is passed into the validate method an error
     * should be thrown.
     */
    it('An error is thrown when no hash is passed in to validate.', async () => {
        await expect(PasswordHasher.validateHash('PASS', undefined)).rejects.toThrow();
    });

    /**
     * A password that is hashed should be able to be validated 
     * later on.
     */
    it('A password hash generated, can be verified later on.', async () => {
        let hash: string     = await PasswordHasher.generateHash('Hunter2');
        let isValid: boolean = await PasswordHasher.validateHash('Hunter2', hash);

        expect(isValid).toBe(true);
    });

    /**
     * An incorrect password should return false when it doesn't
     * match a hash.
     */
    it('An incorrect password does not match a hash', async () => {
        let hash: string     = await PasswordHasher.generateHash('Hunter2');
        let isValid: boolean = await PasswordHasher.validateHash('Password', hash);

        expect(isValid).toBe(false);
    });
});