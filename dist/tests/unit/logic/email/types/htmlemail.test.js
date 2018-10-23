"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const htmlemail_1 = require("../../../../../logic/email/types/htmlemail");
/**
 * Test module for HtmlEmails
 */
describe('HTMLEmail', () => {
    let email;
    beforeEach(() => {
        email = new htmlemail_1.HtmlEmail('reciever', 'subject', 'body');
    });
    describe('constructor()', () => {
        it('reciever is defined.', () => {
            chai_1.expect(email.reciever).to.equal('reciever');
        });
        it('subject is defined.', () => {
            chai_1.expect(email.subject).to.equal('subject');
        });
        it('body is defined.', () => {
            chai_1.expect(email.body).to.equal('body');
        });
        it('sender is undefined', () => {
            chai_1.expect(email.sender).to.be.undefined;
        });
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
        it('html matches.', () => {
            chai_1.expect(emailOpts.html).to.equal(email.body);
        });
        it('text is not defined.', () => {
            chai_1.expect(emailOpts.text).to.be.undefined;
        });
    });
});
//# sourceMappingURL=htmlemail.test.js.map