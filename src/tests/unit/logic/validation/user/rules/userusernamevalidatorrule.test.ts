import { expect } from 'chai';
import 'mocha';
import { UserUsernameValidatorRule } from '../../../../../../logic/validation/user/rules/userusernamevalidatorrule';

/**
 * Test module for UserUsernameValidatorRule.
 */
describe('UserUsernameValidatorRule', () => {
    let validatorRule: UserUsernameValidatorRule = new UserUsernameValidatorRule();
    
    describe('validate()', () => {
        it('throws an error if no user', () => {
            expect(() => { validatorRule.validate(undefined)}).to.throw();
        });
        
    });
});