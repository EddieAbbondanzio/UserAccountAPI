"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const userdeletevalidator_1 = require("../../../../../../logic/validation/user/validators/userdeletevalidator");
const user_1 = require("../../../../../../logic/models/user");
/**
 * Test module for the UserDeleteValidator.
 */
describe('UserDeleteValidator', () => {
    let validator = new userdeletevalidator_1.UserDeleteValidator();
    describe('constructor()', () => {
        it('has validation rules', () => {
            chai_1.expect(validator.rules).to.be.an('array');
        });
    });
    describe('validate()', () => {
        it('throws an error if no user', () => {
            chai_1.expect(() => { validator.validate(undefined); }).to.throw();
        });
        it('returns false if the user is already deleted', () => {
            let user = new user_1.User();
            user.isDeleted = true;
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
    });
});
//# sourceMappingURL=userdeletevalidator.test.js.map