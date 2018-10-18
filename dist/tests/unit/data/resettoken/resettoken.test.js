"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const datamodule_1 = require("../../../../data/datamodule");
/**
 * Test module for the Reset Token data model.
 */
describe('ResetToken', () => {
    /**
     * The test token to work with.
     */
    let token;
    /**
     * Initialize the token for use before
     * each test occurs.
     */
    beforeEach(() => {
        token = new datamodule_1.ResetToken();
    });
    /**
     * Typeorm doesn't like default values.
     */
    it('Initalizes id as undefined', () => {
        expect(token.id).toBeUndefined();
    });
    /**
     * Typeorm doesn't like default values.
     */
    it('Initialized user as undefined.', () => {
        expect(token.user).toBeUndefined();
    });
    /**
     * Typeorm doesn't like default values.
     */
    it('Initializes code as undefined.', () => {
        expect(token.code).toBeUndefined();
    });
    /**
     * Check that the user is assigned correctly when
     * passed into the constructor.
     */
    it('Properly assigns the user when passed.', () => {
        let user = new datamodule_1.User();
        token = new datamodule_1.ResetToken(user);
        expect(token.user).toBe(user);
    });
    /**
     * Check that a randomc code is generated when the user
     * is passed into the constructor.
     */
    it('Properly assigns a code when a user is passed in.', () => {
        let user = new datamodule_1.User();
        token = new datamodule_1.ResetToken(user);
        expect(token.code).toHaveLength(datamodule_1.ResetToken.CODE_LENGTH);
    });
});
//# sourceMappingURL=resettoken.test.js.map