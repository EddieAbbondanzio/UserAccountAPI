"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const passwordvalidatorrule_1 = require("../../../../../../logic/validation/user/rules/passwordvalidatorrule");
const user_1 = require("../../../../../../logic/models/user");
/**
 * Test module for UserPasswordValidatorRule.
 */
describe('UserPasswordValidatorRule', () => {
    let validatorRule = new passwordvalidatorrule_1.PasswordValidatorRule();
    describe('validate()', () => {
        it('throws an error if no user', () => {
            chai_1.expect(() => { validatorRule.validate(undefined); }).to.throw();
        });
        it('returns false if no password hash', () => {
            let user = new user_1.User();
            chai_1.expect(validatorRule.validate(user).isValid).to.be.false;
        });
        it('returns true if a password hash exists', () => {
            let user = new user_1.User();
            user.passwordHash = 'hash';
            chai_1.expect(validatorRule.validate(user).isValid).to.be.true;
        });
    });
});
//# sourceMappingURL=userpasswordvalidatorrule.test.js.map