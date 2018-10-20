import { VerificationToken, User } from "../../../../data/models";

/**
 * Test module for the Verification Token data model.
 */
describe('VerificationToken', () => {
    /**
     * The test token to work with.
     */
    let token: VerificationToken;

    /**
     * Prepare the token for use.
     */
    beforeEach(() => {
        token = new VerificationToken();
    });
    
    /**
     * Typeorm doesn't like predefined values.
     */
    it('Initialize user as undefined.', () => {
        expect(token.user).toBeUndefined();
    });

    /**
     * Typeorm doesn't like predefined values.
     */
    it('Initialize code with a value of undefined.', () => {
        expect(token.code).toBeUndefined();
    });

    /**
     * Check that the user that was passed into the
     * constructor is applied to the token.
     */
    it('Ensure user is properly defined.', () => {
        let user: User = new User();
        token = new VerificationToken(user);

        expect(token.user).toBe(user);
    });

    /**
     * Check that the code is generated when passing
     * in a user to the constructor.
     */
    it('Ensure code is properly defined', () => {
        let user: User = new User();
        token = new VerificationToken(user);

        expect(token.code).toHaveLength(VerificationToken.CODE_LENGTH);
    });
});