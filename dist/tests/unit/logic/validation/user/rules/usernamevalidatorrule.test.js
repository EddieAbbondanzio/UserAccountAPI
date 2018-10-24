"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const usernamevalidatorrule_1 = require("../../../../../../logic/validation/user/rules/usernamevalidatorrule");
const user_1 = require("../../../../../../logic/models/user");
/**
 * Test module for UserNameValidatorRule.
 */
describe('UserNameValidatorRule', () => {
    let validatorRule = new usernamevalidatorrule_1.UserNameValidatorRule();
    describe('validate()', () => {
        let user = new user_1.User();
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