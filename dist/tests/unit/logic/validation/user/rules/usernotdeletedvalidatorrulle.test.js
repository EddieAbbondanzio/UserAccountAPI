"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const usernotdeletedvalidatorrule_1 = require("../../../../../../logic/validation/user/rules/usernotdeletedvalidatorrule");
const user_1 = require("../../../../../../logic/models/user");
/**
 * Test module for UserNotDeletedValidatorRule.
 */
describe('UserNotDeletedValidatorRule', () => {
    let validatorRule = new usernotdeletedvalidatorrule_1.UserNotDeletedValidatorRule();
    describe('validate()', () => {
        it('throws an error if no user', () => {
            chai_1.expect(() => { validatorRule.validate(undefined); }).to.throw();
        });
        it('returns false for a deleted user', () => {
            let user = new user_1.User();
            user.isDeleted = true;
            chai_1.expect(validatorRule.validate(user).isValid).to.be.false;
        });
        it('returns true for a non-deleted user', () => {
            let user = new user_1.User();
            chai_1.expect(validatorRule.validate(user).isValid).to.be.true;
        });
    });
});
//# sourceMappingURL=usernotdeletedvalidatorrulle.test.js.map