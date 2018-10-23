"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const emailcredentials_1 = require("../../../../logic/email/emailcredentials");
describe('EmailCredentials', () => {
    let credentials;
    before(() => {
        credentials = new emailcredentials_1.EmailCredentials('username', 'password');
    });
    describe('constructor()', () => {
        it('username is defined', () => {
            chai_1.expect(credentials.user).to.equal('username');
        });
        it('password is defined', () => {
            chai_1.expect(credentials.pass).to.equal('password');
        });
    });
});
//# sourceMappingURL=emailcredentials.test.js.map