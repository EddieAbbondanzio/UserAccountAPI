import { expect } from 'chai';
import 'mocha';
import { UserUsernameValidatorRule } from '../../../../../../logic/validation/user/rules/userusernamevalidatorrule';
import { NullArgumentError } from '../../../../../../common/error/types/nullargumenterror';
import { User } from '../../../../../../logic/models/user';

/**
 * Test module for UserUsernameValidatorRule.
 */
describe('UserUsernameValidatorRule', () => {
    let validatorRule: UserUsernameValidatorRule = new UserUsernameValidatorRule();
    
    describe('validate()', () => {
        it('throws an error if no user', () => {
            expect(() => { validatorRule.validate(undefined)}).to.throw(NullArgumentError);
        });
        
        it('rejects a username too short', () => {
                expect(validatorRule.validate('B').isValid).to.be.false;
        });

        it('rejects a username too long', () => {
            expect(validatorRule.validate('abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz').isValid).to.be.false;
        });

        it('accepts a valid username', () => {
            expect(validatorRule.validate('BertRules').isValid).to.be.true;
        });

        it('rejects a user with too short of a username', () => {
            let user: User = new User();
            user.username = 'A';
            expect(validatorRule.validate(user).isValid).to.be.false;
        });

        it('rejects a user with too long of a username', () => {
            let user: User = new User();
            user.username = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz';
            expect(validatorRule.validate(user).isValid).to.be.false;
        });

        it('accepts a user with a valid username', () => {
            let user: User = new User();
            user.username = 'username';
            expect(validatorRule.validate(user).isValid).to.be.true;
        });
    });
});