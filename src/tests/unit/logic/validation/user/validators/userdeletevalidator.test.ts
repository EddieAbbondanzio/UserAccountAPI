import { expect } from 'chai';
import 'mocha';
import { UserDeleteValidator } from '../../../../../../logic/validation/user/validators/userdeletevalidator';
import { User } from '../../../../../../logic/models/user';

/**
 * Test module for the UserDeleteValidator.
 */
describe('UserDeleteValidator', () => {
    let validator: UserDeleteValidator = new UserDeleteValidator();

    describe('constructor()', () => {
        it('has validation rules', () => {
            expect(validator.rules).to.be.an('array');
        });
    });
    
    describe('validate()', () => {
        it('throws an error if no user', () => {
            expect(() => { validator.validate(undefined)}).to.throw();
        });

        it('returns false if the user is already deleted', () => {
            let user: User = new User();
            user.isDeleted = true;

            expect(validator.validate(user).isValid).to.be.false;
        });
    });
});