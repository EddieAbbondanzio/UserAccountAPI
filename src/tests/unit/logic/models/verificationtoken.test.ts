import { expect } from 'chai';
import 'mocha';
import { VerificationToken } from '../../../../logic/models/verificationtoken';
import { User } from '../../../../logic/models/user';

describe('VerificationToken', () => {
    describe('constructor()', () => {
        it('no params leaves it empty', () => {
            let vToken: VerificationToken = new VerificationToken();
            expect(vToken).to.be.an('object').that.is.empty;
        });

        it('user is defined when passed', () => {
            let user: User = new User();
            let vToken: VerificationToken = new VerificationToken(user);

            expect(vToken.user).to.equal(user);
        });

        it('code is generated when user is passed', () => {
            let user: User = new User();
            let vToken: VerificationToken = new VerificationToken(user);

            expect(vToken.code).to.be.a('string').that.has.length(VerificationToken.CODE_LENGTH);
        });
    });
});