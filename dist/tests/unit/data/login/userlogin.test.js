"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../../../data/user/user");
const datamodule_1 = require("../../../../data/datamodule");
/**
 * Test module for the UserLogin data model.
 */
describe('UserLogin', () => {
    /**
     * The test login to work with.
     */
    let login;
    /**
     * Reset the login back to default before each use.
     */
    beforeEach(() => {
        login = new datamodule_1.UserLogin();
    });
    /**
     * Typeorm doesn't like defaulted values.
     */
    it('Initialize id as undefined.', () => {
        expect(login.id).toBeUndefined();
    });
    /**
     * Typeorm doesn't like defaulted values.
     */
    it('Initialize user as undefined.', () => {
        expect(login.user).toBeUndefined();
    });
    /**
     * Typeorm doesn't like defaulted values.
     */
    it('Initialize code as undefined.', () => {
        expect(login.code).toBeUndefined();
    });
    /**
     * Typeorm doesn't like defaulted values.
     */
    it('Initialize token as undefined.', () => {
        expect(login.token).toBeUndefined();
    });
    /**
     * Typeorm doesn't like defaulted values.
     */
    it('Initialize date as undefined.', () => {
        expect(login.loginDate).toBeUndefined();
    });
    /**
     * Check to ensure that the user property matches
     * the user that was passed in.
     */
    it('Generated logins should have the user passed in as .user.', () => {
        let user = new user_1.User();
        login = new datamodule_1.UserLogin(user);
        expect(login.user).toBe(user);
    });
    /**
     * Ensure logins that are generated have a properly
     * sized unique code.
     */
    it('Generated logins should have a unique code', () => {
        let user = new user_1.User();
        login = new datamodule_1.UserLogin(user);
        expect(login.code).toHaveLength(datamodule_1.UserLogin.CODE_LENGTH);
    });
});

//# sourceMappingURL=userlogin.test.js.map
