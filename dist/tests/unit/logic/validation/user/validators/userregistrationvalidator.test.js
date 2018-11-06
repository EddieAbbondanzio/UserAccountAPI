"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const userregistrationvalidator_1 = require("../../../../../../logic/validation/user/validators/userregistrationvalidator");
const userregistration_1 = require("../../../../../../logic/common/userregistration");
/**
 * Test module for the UserRegistrationValidator.
 */
describe('UserRegistrationValidator', () => {
    let validator = new userregistrationvalidator_1.UserRegistrationValidator();
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
            let reg = new userregistration_1.UserRegistration();
            reg.name = 'Bert';
            reg.email = 'Bert@domain.com';
            reg.password = 'applesauce';
            chai_1.expect(validator.validate(reg).isValid).to.be.false;
        });
        it('is false if too long of a username', () => {
            let reg = new userregistration_1.UserRegistration();
            reg.username = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz';
            reg.name = 'Bert';
            reg.email = 'Bert@domain.com';
            reg.password = 'applesauce';
            chai_1.expect(validator.validate(reg).isValid).to.be.false;
        });
        it('is false if no password', () => {
            let reg = new userregistration_1.UserRegistration();
            reg.username = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz';
            reg.name = 'Bert';
            reg.email = 'Bert@domain.com';
            chai_1.expect(validator.validate(reg).isValid).to.be.false;
        });
        it('is false if no email', () => {
            let reg = new userregistration_1.UserRegistration();
            reg.username = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz';
            reg.name = 'Bert';
            reg.password = 'hashasdad';
            chai_1.expect(validator.validate(reg).isValid).to.be.false;
        });
        it('is false if too long of an email', () => {
            let reg = new userregistration_1.UserRegistration();
            reg.email = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz';
            reg.name = 'Bert';
            reg.password = 'hashahsha';
            reg.username = 'Bertman';
            chai_1.expect(validator.validate(reg).isValid).to.be.false;
        });
        it('is false if invalid email', () => {
            let reg = new userregistration_1.UserRegistration();
            reg.email = 'LOLWUT';
            reg.name = 'Bert';
            reg.password = 'hashasdadad';
            reg.username = 'Bertman';
            chai_1.expect(validator.validate(reg).isValid).to.be.false;
        });
        it('is false if no name', () => {
            let user = new userregistration_1.UserRegistration();
            user.email = 'LOLWUT';
            user.password = 'hashhash';
            user.username = 'Bertman';
            chai_1.expect(validator.validate(user).isValid).to.be.false;
        });
        it('is false if too long of a name', () => {
            let reg = new userregistration_1.UserRegistration();
            reg.email = 'LOLWUT';
            reg.password = 'hashadadadadd';
            reg.username = 'Bertman';
            reg.name = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz';
            chai_1.expect(validator.validate(reg).isValid).to.be.false;
        });
        it('is true if valid user', () => {
            let reg = new userregistration_1.UserRegistration();
            reg.email = 'mail@domain.com';
            reg.password = '123123131313';
            reg.username = 'Bertman';
            reg.name = 'Bert';
            chai_1.expect(validator.validate(reg).isValid).to.be.true;
        });
    });
});
//# sourceMappingURL=userregistrationvalidator.test.js.map