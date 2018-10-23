"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const verificationtoken_1 = require("../../../../logic/models/verificationtoken");
const user_1 = require("../../../../logic/models/user");
describe('VerificationToken', () => {
    describe('constructor()', () => {
        it('no params leaves it empty', () => {
            let vToken = new verificationtoken_1.VerificationToken();
            chai_1.expect(vToken).to.be.an('object').that.is.empty;
        });
        it('user is defined when passed', () => {
            let user = new user_1.User();
            let vToken = new verificationtoken_1.VerificationToken(user);
            chai_1.expect(vToken.user).to.equal(user);
        });
        it('code is generated when user is passed', () => {
            let user = new user_1.User();
            let vToken = new verificationtoken_1.VerificationToken(user);
            chai_1.expect(vToken.code).to.be.a('string').that.has.length(verificationtoken_1.VerificationToken.CODE_LENGTH);
        });
    });
});
//# sourceMappingURL=verificationtoken.test.js.map