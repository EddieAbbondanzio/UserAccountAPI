"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const userusernamevalidatorrule_1 = require("../../../../../../logic/validation/user/rules/userusernamevalidatorrule");
/**
 * Test module for UserUsernameValidatorRule.
 */
describe('UserUsernameValidatorRule', () => {
    let validatorRule = new userusernamevalidatorrule_1.UserUsernameValidatorRule();
    describe('validate()', () => {
        it('throws an error if no user', () => {
            chai_1.expect(() => { validatorRule.validate(undefined); }).to.throw();
        });
    });
});
//# sourceMappingURL=userusernamevalidatorrule.test.js.map