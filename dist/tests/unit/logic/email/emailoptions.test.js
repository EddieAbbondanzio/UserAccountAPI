"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emailoptions_1 = require("../../../../logic/email/emailoptions");
const chai_1 = require("chai");
require("mocha");
/**
 * Test module for the EmailOptions
 */
describe('EmailOptions', () => {
    describe('constructor()', () => {
        let emailOpts;
        it('to is defined.', () => {
            emailOpts = new emailoptions_1.EmailOptions('to', 'from', 'subject', 'body', false);
            chai_1.expect(emailOpts.to).to.equal('to');
        });
        it('from is defined.', () => {
            emailOpts = new emailoptions_1.EmailOptions('to', 'from', 'subject', 'body', false);
            chai_1.expect(emailOpts.from).to.equal('from');
        });
        it('subject is defined.', () => {
            emailOpts = new emailoptions_1.EmailOptions('to', 'from', 'subject', 'body', false);
            chai_1.expect(emailOpts.subject).to.equal('subject');
        });
        it('body is defined for text options.', () => {
            emailOpts = new emailoptions_1.EmailOptions('to', 'from', 'subject', 'body', false);
            chai_1.expect(emailOpts.text).to.equal('body');
        });
        it('html is undefined for text options', () => {
            emailOpts = new emailoptions_1.EmailOptions('to', 'from', 'subject', 'body', false);
            chai_1.expect(emailOpts.html).to.be.undefined;
        });
        it('html is defined for html options.', () => {
            emailOpts = new emailoptions_1.EmailOptions('to', 'from', 'subject', 'body', true);
            chai_1.expect(emailOpts.html).to.equal('body');
        });
        it('text is undefined for html options', () => {
            emailOpts = new emailoptions_1.EmailOptions('to', 'from', 'subject', 'body', true);
            chai_1.expect(emailOpts.text).to.be.undefined;
        });
    });
});
//# sourceMappingURL=emailoptions.test.js.map