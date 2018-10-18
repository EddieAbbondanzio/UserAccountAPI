"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datamodule_1 = require("../../../../data/datamodule");
/**
 * Test module for the Verification Token data model.
 */
describe('VerificationToken', () => {
    /**
     * The test token to work with.
     */
    let token;
    /**
     * Prepare the token for use.
     */
    beforeEach(() => {
        token = new datamodule_1.VerificationToken();
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
        let user = new datamodule_1.User();
        token = new datamodule_1.VerificationToken(user);
        expect(token.user).toBe(user);
    });
    /**
     * Check that the code is generated when passing
     * in a user to the constructor.
     */
    it('Ensure code is properly defined', () => {
        let user = new datamodule_1.User();
        token = new datamodule_1.VerificationToken(user);
        expect(token.code).toHaveLength(datamodule_1.VerificationToken.CODE_LENGTH);
    });
});
//# sourceMappingURL=verificationtoken.test.js.map