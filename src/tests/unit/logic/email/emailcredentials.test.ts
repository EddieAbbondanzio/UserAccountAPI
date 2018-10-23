import { expect } from 'chai';
import 'mocha';
import { EmailCredentials } from '../../../../logic/email/emailcredentials';

describe('EmailCredentials', () => {
    let credentials: EmailCredentials;

    before(() => {
        credentials = new EmailCredentials('username', 'password');
    });
    
    describe('constructor()', () => {
        it('username is defined', () => {
            expect(credentials.user).to.equal('username');
        });

        it('password is defined', () => { 
            expect(credentials.pass).to.equal('password');
        });
    });
});