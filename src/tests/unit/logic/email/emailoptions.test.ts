import { EmailOptions } from "../../../../logic/email/emailoptions";
import { expect } from 'chai';
import 'mocha';

/**
 * Test module for the EmailOptions
 */
describe('EmailOptions', () => {
    describe('constructor()', () => {
        let emailOpts: EmailOptions;

        it('to is defined.', () => {
            emailOpts = new EmailOptions('to', 'from', 'subject', 'body', false);
            expect(emailOpts.to).to.equal('to');
        });

        it('from is defined.', () => {
            emailOpts = new EmailOptions('to', 'from', 'subject', 'body', false);
            expect(emailOpts.from).to.equal('from');
        });

        it('subject is defined.', () => {
            emailOpts = new EmailOptions('to', 'from', 'subject', 'body', false);
            expect(emailOpts.subject).to.equal('subject');
        });

        it('body is defined for text options.', () => {
            emailOpts = new EmailOptions('to', 'from', 'subject', 'body', false);
            expect(emailOpts.text).to.equal('body');
        });

        it('html is undefined for text options', () => {
            emailOpts = new EmailOptions('to', 'from', 'subject', 'body', false);
            expect(emailOpts.html).to.be.undefined;
        });

        it('html is defined for html options.', () => {
            emailOpts = new EmailOptions('to', 'from', 'subject', 'body', true);
            expect(emailOpts.html).to.equal('body');
        });

        it('text is undefined for html options', () => {
            emailOpts = new EmailOptions('to', 'from', 'subject', 'body', true);
            expect(emailOpts.text).to.be.undefined;
        });
    });
});