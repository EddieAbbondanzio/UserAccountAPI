import { expect } from 'chai';
import 'mocha';
import { UserPasswordValidatorRule } from '../../../../../../logic/validation/user/rules/userpasswordvalidatorrule';
import { User } from '../../../../../../logic/models/user';

/**
 * Test module for UserPasswordValidatorRule.
 */
describe('UserPasswordValidatorRule', () => {
    let validatorRule: UserPasswordValidatorRule = new UserPasswordValidatorRule();

    describe('validate()', () => {
        it('throws an error if no user', () => {
            expect(() => { validatorRule.validate(undefined)}).to.throw();
        });

        it('returns false if no password hash', () => {
            let user: User = new User();
            expect(validatorRule.validate(user).isValid).to.be.false;
        });

        it('returns true if a password hash exists', () => {
            let user: User = new User();
            user.passwordHash = 'hash';
            expect(validatorRule.validate(user).isValid).to.be.true;
        });
    });
});