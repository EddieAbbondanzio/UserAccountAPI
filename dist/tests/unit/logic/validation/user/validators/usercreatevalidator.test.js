"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const usercreatevalidator_1 = require("../../../../../../logic/validation/user/validators/usercreatevalidator");
const user_1 = require("../../../../../../logic/models/user");
/**
 * Test module for the UserCreateValidator.
 */
describe('UserCreateValidator', () => {
    let validator = new usercreatevalidator_1.UserCreateValidator();
    describe('constructor()', () => {
        it('has validation rules', () => {
            chai_1.expect(validator.rules).to.be.an('array');
        });
    });
    describe('validate()', () => {
        it('throws an error if no user', () => {
            chai_1.expect(() => { validator.validate(undefined); }).to.throw();
        });
        it('is false if no username', () => {
            let user = new user_1.User();
            user.name = 'Bert';
            user.email = 'Bert@domain.com';
            user.passwordHash = 'hash';
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
        it('is false if too long of a username', () => {
            let user = new user_1.User();
            user.username = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz';
            user.name = 'Bert';
            user.email = 'Bert@domain.com';
            user.passwordHash = 'hash';
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
        it('is false if no password', () => {
            let user = new user_1.User();
            user.username = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz';
            user.name = 'Bert';
            user.email = 'Bert@domain.com';
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
        it('is false if no email', () => {
            let user = new user_1.User();
            user.username = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz';
            user.name = 'Bert';
            user.passwordHash = 'hash';
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
        it('is false if too long of an email', () => {
            let user = new user_1.User();
            user.email = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz';
            user.name = 'Bert';
            user.passwordHash = 'hash';
            user.username = 'Bertman';
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
        it('is false if invalid email', () => {
            let user = new user_1.User();
            user.email = 'LOLWUT';
            user.name = 'Bert';
            user.passwordHash = 'hash';
            user.username = 'Bertman';
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
        it('is false if no name', () => {
            let user = new user_1.User();
            user.email = 'LOLWUT';
            user.passwordHash = 'hash';
            user.username = 'Bertman';
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
        it('is false if too long of a name', () => {
            let user = new user_1.User();
            user.email = 'LOLWUT';
            user.passwordHash = 'hash';
            user.username = 'Bertman';
            user.name = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz';
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
        it('is true if valid user', () => {
            let user = new user_1.User();
            user.email = 'mail@domain.com';
            user.passwordHash = 'hash';
            user.username = 'Bertman';
            user.name = 'Bert';
            chai_1.expect(validator.validate(user).isValid).to.be.true;
        });
    });
});
//# sourceMappingURL=usercreatevalidator.test.js.map