import { User } from "../../../../../../logic/models/user";
import { expect } from 'chai';
import 'mocha';
import { EmailValidatorRule } from "../../../../../../logic/validation/user/rules/emailvalidatorrule";

/**
 * Test module for UserEmailValidatorRule
 */
describe('UserEmailValidatorRule', () => {
    let validatorRule: EmailValidatorRule = new EmailValidatorRule();
    
    describe('validate()', () => {
        it('throws an error if no user', () => {
            expect(() => { validatorRule.validate(undefined)}).to.throw();
        });

        it('returns false for no email', () => {
            let user: User = new User();
            expect(validatorRule.validate(user).isValid).to.be.false;
        });

        it('returns false for a email too long', () => {
            let user: User = new User();
            user.email = 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij';

            expect(validatorRule.validate(user).isValid).to.be.false;
        });

        it('returns false for an invalid form email', () => {
            let user: User = new User();
            user.email = 'toast';

            expect(validatorRule.validate(user).isValid).to.be.false;
        });

        it('returns true for a valid email', () => {
            let user: User = new User();
            user.email = 'validemail@domain.com';

            expect(validatorRule.validate(user).isValid).to.be.true;
        });
    });
});