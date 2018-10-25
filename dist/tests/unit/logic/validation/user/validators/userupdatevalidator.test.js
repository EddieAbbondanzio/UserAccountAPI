"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const userupdatevalidator_1 = require("../../../../../../logic/validation/user/validators/userupdatevalidator");
const user_1 = require("../../../../../../logic/models/user");
/**
 * Test module for the UserUpdateValidator.
 */
describe('UserUpdateValidator', () => {
    let validator = new userupdatevalidator_1.UserUpdateValidator();
    describe('constructor()', () => {
        it('has validation rules', () => {
            chai_1.expect(validator.rules).to.be.an('array');
        });
    });
    describe('validate()', () => {
        it('throws an error if no user', () => {
            chai_1.expect(() => { validator.validate(undefined); }).to.throw();
        });
        it('is false if no name', () => {
            let user = new user_1.User();
            user.email = 'bert@domain.com';
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
        it('is false if name is too long', () => {
            let user = new user_1.User();
            user.name = 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij';
            user.email = 'bert@domain.com';
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
        it('is false if no email', () => {
            let user = new user_1.User();
            user.name = 'Bert';
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
        it('is false if the email is invalid', () => {
            let user = new user_1.User();
            user.name = 'Bert';
            user.email = 'LOLWUT';
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
        it('is true if both email, and name are valid', () => {
            let user = new user_1.User();
            user.name = 'Bert';
            user.email = 'Bert@yahoo.com';
            chai_1.expect(validator.validate(user).isValid).to.be.true;
        });
    });
});
//# sourceMappingURL=userupdatevalidator.test.js.map