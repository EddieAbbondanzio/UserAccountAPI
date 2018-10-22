import { expect } from 'chai';
import 'mocha';
import { TextEmail } from '../../../../../logic/email/types/textemail';

/**
 * Test module for HtmlEmails
 */
describe('HTML based emails', () => {
    /**
     * Initialization based tests
     */
    describe('are initialized with values from their constructor', () => {
        /**
         * The reciever address is properly assigned.
         */
        it('reciever is properly assigned', () => {
            let email: TextEmail = new TextEmail('testemail@fake.com');
            expect(email.reciever).to.equal('testemail@fake.com');
        });
    });
});