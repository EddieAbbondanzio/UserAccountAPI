import { expect } from 'chai';
import 'mocha';
import { UserLogin } from '../../../../logic/models/userlogin';
import { User } from '../../../../logic/models/user';
import { VerificationToken } from '../../../../logic/models/verificationtoken';

describe('UserLogin', () => {
    describe('constructor()', () => {
        it('no params leaves it empty', () => {
            let userLogin: UserLogin = new UserLogin();
            expect(userLogin).to.be.an('object').that.is.empty;
        });

        it('user is defined when passed', () => {
            let user: User = new User();
            let vToken: VerificationToken = new VerificationToken(user);

            expect(vToken.user).to.equal(user);
        });

        it('a code is generated when user is passed', () => {
            let user: User = new User();
            let vToken: VerificationToken = new VerificationToken(user);
            
            expect(vToken.code).to.be.an('string').that.has.length(VerificationToken.CODE_LENGTH);
        });
    });
});