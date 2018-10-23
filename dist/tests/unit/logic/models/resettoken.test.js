"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const resettoken_1 = require("../../../../logic/models/resettoken");
const user_1 = require("../../../../logic/models/user");
describe('ResetToken', () => {
    describe('constructor()', () => {
        it('no params leaves it empty', () => {
            let resetToken = new resettoken_1.ResetToken();
            chai_1.expect(resetToken).to.be.an('object').that.is.empty;
        });
        it('user is defined when passed', () => {
            let user = new user_1.User();
            let resetToken = new resettoken_1.ResetToken(user);
            chai_1.expect(resetToken.user).to.equal(user);
        });
        it('with a user, a code is generated', () => {
            let user = new user_1.User();
            let resetToken = new resettoken_1.ResetToken(user);
            chai_1.expect(resetToken.code).to.be.a('string').of.length(resettoken_1.ResetToken.CODE_LENGTH);
        });
    });
});
//# sourceMappingURL=resettoken.test.js.map