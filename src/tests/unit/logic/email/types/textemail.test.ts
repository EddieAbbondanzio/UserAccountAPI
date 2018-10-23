import { TextEmail } from "../../../../../logic/email/types/textemail";
import { EmailOptions } from "../../../../../logic/email/emailoptions";
import { expect } from 'chai';
import 'mocha';

/**
 * Test module for TextEmails
 */
describe('TextEmail', () => {
    let email: TextEmail;

    beforeEach(() => {
        email = new TextEmail('reciever', 'subject', 'body');
    });

    describe('constructor()', () => {

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

        it('text matches.', () => {
            expect(emailOpts.text).to.equal(email.body);
        });

        it('html is not defined.', () => {
            expect(emailOpts.html).to.be.undefined;
        });
    });
});