"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const textemail_1 = require("../../../../../logic/email/types/textemail");
const chai_1 = require("chai");
require("mocha");
/**
 * Test module for TextEmails
 */
describe('TextEmail', () => {
    let email;
    beforeEach(() => {
        email = new textemail_1.TextEmail('reciever', 'subject', 'body');
    });
    describe('constructor()', () => {
    });
    describe('getSendOptions()', () => {
        let emailOpts;
        beforeEach(() => {
            email.sender = 'sender';
            emailOpts = email.getSendOptions();
        });
        it('reciever matches.', () => {
            chai_1.expect(emailOpts.to).to.equal(email.reciever);
        });
        it('sender matches.', () => {
            chai_1.expect(emailOpts.from).to.equal(email.sender);
        });
        it('subject matches.', () => {
            chai_1.expect(emailOpts.subject).to.equal(email.subject);
        });
        it('text matches.', () => {
            chai_1.expect(emailOpts.text).to.equal(email.body);
        });
        it('html is not defined.', () => {
            chai_1.expect(emailOpts.html).to.be.undefined;
        });
    });
});
//# sourceMappingURL=textemail.test.js.map