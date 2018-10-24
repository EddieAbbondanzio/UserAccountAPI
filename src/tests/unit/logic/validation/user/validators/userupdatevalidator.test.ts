import { expect } from 'chai';
import 'mocha';
import { UserUpdateValidator } from '../../../../../../logic/validation/user/validators/userupdatevalidator';
import { User } from '../../../../../../logic/models/user';

/**
 * Test module for the UserUpdateValidator.
 */
describe('UserUpdateValidator', () => {
    let validator: UserUpdateValidator = new UserUpdateValidator();

    describe('constructor()', () => {
        it('has validation rules', () => {
            expect(validator.rules).to.be.an('array');
        });
    });
    
    describe('validate()', () => {
        it('throws an error if no user', () => {
            expect(() => { validator.validate(undefined)}).to.throw();
        });

        it('is false if no name', () => {
            let user: User = new User();
            user.email = 'bert@domain.com';

            expect(validator.validate(user).isValid).to.be.false;
        });

        it('is false if name is too long', () => {
            let user: User = new User();
            user.name = 'abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij';
            user.email = 'bert@domain.com';

            expect(validator.validate(user).isValid).to.be.false;
        });

        it('is false if no email', () => {
            let user: User = new User();
            user.name = 'Bert';

            expect(validator.validate(user).isValid).to.be.false;
        });

        it('is false if the email is invalid', () => {
            let user: User = new User();
            user.name = 'Bert';
            user.email ='LOLWUT';

            expect(validator.validate(user).isValid).to.be.false;
        });

        it('is true if both email, and name are valid', () => {
            let user: User = new User();
            user.name = 'Bert';
            user.email = 'Bert@yahoo.com';

            expect(validator.validate(user).isValid).to.be.true;
        });
    });
});