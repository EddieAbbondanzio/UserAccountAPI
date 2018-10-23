import { expect } from 'chai';
import 'mocha';
import { UserRegistration } from '../../../../logic/common/userregistration';

describe('UserRegistration', () => {
    let userReg: UserRegistration = new UserRegistration('username', 'password', 'name', 'email');

    describe('constructor()', () => {
        it('username is defined', () => {
            expect(userReg.username).to.equal('username');
        });

        it('password is defined', () => {
            expect(userReg.password).to.equal('password');
        });

        it('name is defined', () => {
            expect(userReg.name).to.equal('name');
        });

        it('email is defined', () => {
            expect(userReg.email).to.equal('email');
        });
    });
});