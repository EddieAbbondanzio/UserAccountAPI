import { expect } from 'chai';
import 'mocha';
import { ResetToken } from '../../../../logic/models/resettoken';
import { User } from '../../../../logic/models/user';

describe('ResetToken', () => {
    describe('constructor()', () => {
        it('no params leaves it empty', () => {
            let resetToken: ResetToken = new ResetToken();
            expect(resetToken).to.be.an('object').that.is.empty;
        });

        it('user is defined when passed', () => {
            let user: User = new User();
            let resetToken: ResetToken = new ResetToken(user);

            expect(resetToken.user).to.equal(user);
        });

        it('with a user, a code is generated', () => {
            let user: User = new User();
            let resetToken: ResetToken = new ResetToken(user);

            expect(resetToken.code).to.be.a('string').of.length(ResetToken.CODE_LENGTH);
        });
    });
});