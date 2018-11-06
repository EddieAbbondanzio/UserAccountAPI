import { expect } from 'chai';
import 'mocha';
import { NotDeletedValidatorRule } from '../../../../../../logic/validation/user/rules/notdeletedvalidatorrule';
import { User } from '../../../../../../logic/models/user';

/**
 * Test module for UserNotDeletedValidatorRule.
 */
describe('UserNotDeletedValidatorRule', () => {
    let validatorRule: NotDeletedValidatorRule = new NotDeletedValidatorRule();

    describe('validate()', () => {
        it('throws an error if no user', () => {
            expect(() => { validatorRule.validate(undefined)}).to.throw();
        });

        it('returns false for a deleted user', () => {
            let user: User = new User();
            user.isDeleted = true;

            expect(validatorRule.validate(user).isValid).to.be.false;
        });

        it('returns true for a non-deleted user', () => {
            let user: User = new User();
            expect(validatorRule.validate(user).isValid).to.be.true;
        });
    });
});