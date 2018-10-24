import { expect } from 'chai';
import 'mocha';
import { UserCreateValidator } from '../../../../../../logic/validation/user/validators/usercreatevalidator';
import { User } from '../../../../../../logic/models/user';

/**
 * Test module for the UserCreateValidator.
 */
describe('UserCreateValidator', () => {
    let validator: UserCreateValidator = new UserCreateValidator();

    describe('constructor()', () => {
        it('has validation rules', () => {
            expect(validator.rules).to.be.an('array');
        });
    });
    
    describe('validate()', () => {
        it('throws an error if no user', () => {
            expect(() => { validator.validate(undefined)}).to.throw();
        });

        it('is false if no username', () => {
            let user: User = new User();
            user.name = 'Bert';
            user.email = 'Bert@domain.com';
            user.passwordHash = 'hash';

            expect(validator.validate(user).isValid).to.be.false;
        });

        it('is false if too long of a username', () => {
            let user: User = new User();
            user.username = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz'
            user.name = 'Bert';
            user.email = 'Bert@domain.com';
            user.passwordHash = 'hash';

            expect(validator.validate(user).isValid).to.be.false;
        });

        it('is false if no password', () => {
            let user: User = new User();
            user.username = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz'
            user.name = 'Bert';
            user.email = 'Bert@domain.com';
            
            expect(validator.validate(user).isValid).to.be.false;
        });

        it('is false if no email', () => {
            let user: User = new User();
            user.username = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz'
            user.name = 'Bert';
            user.passwordHash = 'hash';
            
            expect(validator.validate(user).isValid).to.be.false;
        });

        it('is false if too long of an email', () => {
            let user: User = new User();
            user.email = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz'
            user.name = 'Bert';
            user.passwordHash = 'hash';
            user.username = 'Bertman';

            expect(validator.validate(user).isValid).to.be.false;
        });

        it('is false if invalid email', () => {
            let user: User = new User();
            user.email = 'LOLWUT'
            user.name = 'Bert';
            user.passwordHash = 'hash';
            user.username = 'Bertman';

            expect(validator.validate(user).isValid).to.be.false;
        });

        it('is false if no name', () => {
            let user: User = new User();
            user.email = 'LOLWUT'
            user.passwordHash = 'hash';
            user.username = 'Bertman';

            expect(validator.validate(user).isValid).to.be.false;
        });

        it('is false if too long of a name', () => {
            let user: User = new User();
            user.email = 'LOLWUT'
            user.passwordHash = 'hash';
            user.username = 'Bertman';
            user.name = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz';

            expect(validator.validate(user).isValid).to.be.false;
        });

        it('is true if valid user', () => {
            let user: User = new User();
            user.email = 'mail@domain.com'
            user.passwordHash = 'hash';
            user.username = 'Bertman';
            user.name = 'Bert';

            expect(validator.validate(user).isValid).to.be.true;
        });
    });
});