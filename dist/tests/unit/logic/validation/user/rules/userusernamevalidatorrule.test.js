"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const usernamevalidatorrule_1 = require("../../../../../../logic/validation/user/rules/usernamevalidatorrule");
const nullargumenterror_1 = require("../../../../../../common/error/types/nullargumenterror");
const user_1 = require("../../../../../../logic/models/user");
/**
 * Test module for UserUsernameValidatorRule.
 */
describe('UserUsernameValidatorRule', () => {
    let validatorRule = new usernamevalidatorrule_1.UsernameValidatorRule();
    describe('validate()', () => {
        it('throws an error if no user', () => {
            chai_1.expect(() => { validatorRule.validate(undefined); }).to.throw(nullargumenterror_1.NullArgumentError);
        });
        it('rejects a username too short', () => {
            chai_1.expect(validatorRule.validate('B').isValid).to.be.false;
        });
        it('rejects a username too long', () => {
            chai_1.expect(validatorRule.validate('abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz').isValid).to.be.false;
        });
        it('accepts a valid username', () => {
            chai_1.expect(validatorRule.validate('BertRules').isValid).to.be.true;
        });
        it('rejects a user with too short of a username', () => {
            let user = new user_1.User();
            user.username = 'A';
            chai_1.expect(validatorRule.validate(user).isValid).to.be.false;
        });
        it('rejects a user with too long of a username', () => {
            let user = new user_1.User();
            user.username = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
            chai_1.expect(validatorRule.validate(user).isValid).to.be.false;
        });
        it('accepts a user with a valid username', () => {
            let user = new user_1.User();
            user.username = 'username';
            chai_1.expect(validatorRule.validate(user).isValid).to.be.true;
        });
    });
});
//# sourceMappingURL=userusernamevalidatorrule.test.js.map