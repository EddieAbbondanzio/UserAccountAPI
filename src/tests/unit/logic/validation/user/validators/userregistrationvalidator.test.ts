import { expect } from 'chai';
import 'mocha';
import { UserRegistrationValidator } from '../../../../../../logic/validation/user/validators/userregistrationvalidator';
import { User } from '../../../../../../logic/models/user';
import { UserRegistration } from '../../../../../../logic/common/userregistration';

/**
 * Test module for the UserRegistrationValidator.
 */
describe('UserRegistrationValidator', () => {
    let validator: UserRegistrationValidator = new UserRegistrationValidator();

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
            let reg: UserRegistration = new UserRegistration();
            reg.name = 'Bert';
            reg.email = 'Bert@domain.com';
            reg.password = 'applesauce';

            expect(validator.validate(reg).isValid).to.be.false;
        });

        it('is false if too long of a username', () => {
            let reg: UserRegistration = new UserRegistration();
            reg.username = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz'
            reg.name = 'Bert';
            reg.email = 'Bert@domain.com';
            reg.password = 'applesauce';

            expect(validator.validate(reg).isValid).to.be.false;
        });

        it('is false if no password', () => {
            let reg: UserRegistration = new UserRegistration();
            reg.username = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz'
            reg.name = 'Bert';
            reg.email = 'Bert@domain.com';
            
            expect(validator.validate(reg).isValid).to.be.false;
        });

        it('is false if no email', () => {
            let reg: UserRegistration = new UserRegistration();
            reg.username = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz'
            reg.name = 'Bert';
            reg.password = 'hashasdad';
            
            expect(validator.validate(reg).isValid).to.be.false;
        });

        it('is false if too long of an email', () => {
            let reg: UserRegistration = new UserRegistration();
            reg.email = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz'
            reg.name = 'Bert';
            reg.password = 'hashahsha';
            reg.username = 'Bertman';

            expect(validator.validate(reg).isValid).to.be.false;
        });

        it('is false if invalid email', () => {
            let reg: UserRegistration = new UserRegistration();
            reg.email = 'LOLWUT'
            reg.name = 'Bert';
            reg.password = 'hashasdadad';
            reg.username = 'Bertman';

            expect(validator.validate(reg).isValid).to.be.false;
        });

        it('is false if no name', () => {
            let user: UserRegistration = new UserRegistration();
            user.email = 'LOLWUT'
            user.password = 'hashhash';
            user.username = 'Bertman';

            expect(validator.validate(user).isValid).to.be.false;
        });

        it('is false if too long of a name', () => {
            let reg: UserRegistration = new UserRegistration();
            reg.email = 'LOLWUT'
            reg.password = 'hashadadadadd';
            reg.username = 'Bertman';
            reg.name = 'abcdefghijklmnoplqrstuvqxyzabdefghijklmnopqrstuvqxyz';

            expect(validator.validate(reg).isValid).to.be.false;
        });

        it('is true if valid user', () => {
            let reg: UserRegistration = new UserRegistration();
            reg.email = 'mail@domain.com'
            reg.password = '123123131313';
            reg.username = 'Bertman';
            reg.name = 'Bert';

            expect(validator.validate(reg).isValid).to.be.true;
        });
    });
});