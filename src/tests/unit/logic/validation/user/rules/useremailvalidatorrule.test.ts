import { User } from "../../../../../../logic/models/user";
import { expect } from 'chai';
import 'mocha';
import { UserEmailValidatorRule } from "../../../../../../logic/validation/user/rules/useremailvalidatorrule";

/**
 * Test module for UserEmailValidatorRule
 */
describe('UserEmailValidatorRule', () => {
    let validatorRule: UserEmailValidatorRule = new UserEmailValidatorRule();
    
    describe('validate()', () => {
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