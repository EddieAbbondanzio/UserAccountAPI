import { expect } from 'chai';
import 'mocha';
import { NameValidatorRule } from '../../../../../../logic/validation/user/rules/namevalidatorrule';
import { User } from '../../../../../../logic/models/user';

/**
 * Test module for UserNameValidatorRule.
 */
describe('UserNameValidatorRule', () => {
    let validatorRule: NameValidatorRule = new NameValidatorRule();

    describe('validate()', () => {
        let user: User = new User();

        it('throws an error if no user', () => {
            expect(() => { validatorRule.validate(undefined)}).to.throw();
        });
        
        it('returns false for no name', () => {
            expect(validatorRule.validate(user).isValid).to.be.false;
        });

        it('returns false for a name too long', () => {
            user.name = 'UserPasswordValidatorRuleUserPasswordValidatorRuleUserPasswordValidatorRuleUserPasswordValidatorRule';
            expect(validatorRule.validate(user).isValid).to.be.false;
        });

        it('returns true for a valid name', () => {
            user.name = 'Bert';
            expect(validatorRule.validate(user).isValid).to.be.true;
        });
    });
});