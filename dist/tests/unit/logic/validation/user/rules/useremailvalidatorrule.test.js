"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../../../../../logic/models/user");
const chai_1 = require("chai");
require("mocha");
const useremailvalidatorrule_1 = require("../../../../../../logic/validation/user/rules/useremailvalidatorrule");
/**
 * Test module for UserEmailValidatorRule
 */
describe('UserEmailValidatorRule', () => {
    let validatorRule = new useremailvalidatorrule_1.UserEmailValidatorRule();
    describe('validate()', () => {
        it('throws an error if no user', () => {
            chai_1.expect(() => { validatorRule.validate(undefined); }).to.throw();
        });
        it('returns false for no email', () => {
            let user = new user_1.User();
            chai_1.expect(validatorRule.validate(user).isValid).to.be.false;
        });
        it('returns false for a email too long', () => {
            let user = new user_1.User();
            user.email = 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij';
            chai_1.expect(validatorRule.validate(user).isValid).to.be.false;
        });
        it('returns false for an invalid form email', () => {
            let user = new user_1.User();
            user.email = 'toast';
            chai_1.expect(validatorRule.validate(user).isValid).to.be.false;
        });
        it('returns true for a valid email', () => {
            let user = new user_1.User();
            user.email = 'validemail@domain.com';
            chai_1.expect(validatorRule.validate(user).isValid).to.be.true;
        });
    });
});
//# sourceMappingURL=useremailvalidatorrule.test.js.map