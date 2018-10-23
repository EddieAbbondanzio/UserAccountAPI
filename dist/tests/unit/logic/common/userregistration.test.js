"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const userregistration_1 = require("../../../../logic/common/userregistration");
describe('UserRegistration', () => {
    let userReg = new userregistration_1.UserRegistration('username', 'password', 'name', 'email');
    describe('constructor()', () => {
        it('username is defined', () => {
            chai_1.expect(userReg.username).to.equal('username');
        });
        it('password is defined', () => {
            chai_1.expect(userReg.password).to.equal('password');
        });
        it('name is defined', () => {
            chai_1.expect(userReg.name).to.equal('name');
        });
        it('email is defined', () => {
            chai_1.expect(userReg.email).to.equal('email');
        });
    });
});
//# sourceMappingURL=userregistration.test.js.map