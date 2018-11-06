"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const namevalidatorrule_1 = require("../../../../../../logic/validation/user/rules/namevalidatorrule");
const user_1 = require("../../../../../../logic/models/user");
/**
 * Test module for UserNameValidatorRule.
 */
describe('UserNameValidatorRule', () => {
    let validatorRule = new namevalidatorrule_1.NameValidatorRule();
    describe('validate()', () => {
        let user = new user_1.User();
        it('throws an error if no user', () => {
            chai_1.expect(() => { validatorRule.validate(undefined); }).to.throw();
        });
        it('returns false for no name', () => {
            chai_1.expect(validatorRule.validate(user).isValid).to.be.false;
        });
        it('returns false for a name too long', () => {
            user.name = 'UserPasswordValidatorRuleUserPasswordValidatorRuleUserPasswordValidatorRuleUserPasswordValidatorRule';
            chai_1.expect(validatorRule.validate(user).isValid).to.be.false;
        });
        it('returns true for a valid name', () => {
            user.name = 'Bert';
            chai_1.expect(validatorRule.validate(user).isValid).to.be.true;
        });
    });
});
//# sourceMappingURL=usernamevalidatorrule.test.js.map