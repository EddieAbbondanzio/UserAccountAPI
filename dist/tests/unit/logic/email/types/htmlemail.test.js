"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const textemail_1 = require("../../../../../logic/email/types/textemail");
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
            let email = new textemail_1.TextEmail('testemail@fake.com');
            chai_1.expect(email.reciever).to.equal('testemail@fake.com');
        });
    });
});
//# sourceMappingURL=htmlemail.test.js.map