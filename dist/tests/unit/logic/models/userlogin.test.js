"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const userlogin_1 = require("../../../../logic/models/userlogin");
const user_1 = require("../../../../logic/models/user");
const verificationtoken_1 = require("../../../../logic/models/verificationtoken");
describe('UserLogin', () => {
    describe('constructor()', () => {
        it('no params leaves it empty', () => {
            let userLogin = new userlogin_1.UserLogin();
            chai_1.expect(userLogin).to.be.an('object').that.is.empty;
        });
        it('user is defined when passed', () => {
            let user = new user_1.User();
            let vToken = new verificationtoken_1.VerificationToken(user);
            chai_1.expect(vToken.user).to.equal(user);
        });
        it('a code is generated when user is passed', () => {
            let user = new user_1.User();
            let vToken = new verificationtoken_1.VerificationToken(user);
            chai_1.expect(vToken.code).to.be.an('string').that.has.length(verificationtoken_1.VerificationToken.CODE_LENGTH);
        });
    });
});
//# sourceMappingURL=userlogin.test.js.map