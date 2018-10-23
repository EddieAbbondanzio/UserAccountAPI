import { expect } from 'chai';
import 'mocha';
import { HtmlEmail } from '../../../../../logic/email/types/htmlemail';
import { EmailOptions } from '../../../../../logic/email/emailoptions';

/**
 * Test module for HtmlEmails
 */
describe('HTMLEmail', () => {
    let email: HtmlEmail;

    beforeEach(() => {
        email = new HtmlEmail('reciever', 'subject', 'body');
    });

    describe('constructor()', () => {
        it('reciever is defined.', () => {
            expect(email.reciever).to.equal('reciever');
        });

        it('subject is defined.', () => {
            expect(email.subject).to.equal('subject');
        });

        it('body is defined.', () => {
            expect(email.body).to.equal('body');
        });

        it('sender is undefined', () => {
            expect(email.sender).to.be.undefined;
        });
    });

    describe('getSendOptions()', () => {
        let emailOpts: EmailOptions;

        beforeEach(() => {
            email.sender = 'sender';
            emailOpts = email.getSendOptions();
        });

        it('reciever matches.', () => {
            expect(emailOpts.to).to.equal(email.reciever); 
        });

        it('sender matches.', () => {
            expect(emailOpts.from).to.equal(email.sender);
        });

        it('subject matches.', () => {
            expect(emailOpts.subject).to.equal(email.subject);
        });

        it('html matches.', () => {
            expect(emailOpts.html).to.equal(email.body);
        });

        it('text is not defined.', () => {
            expect(emailOpts.text).to.be.undefined;
        });
    });
});