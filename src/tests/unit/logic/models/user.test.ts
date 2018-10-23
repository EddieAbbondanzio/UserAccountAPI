import { expect } from 'chai';
import 'mocha';
import { User } from '../../../../logic/models/user';
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised';
import { AuthenticationError } from '../../../../logic/common/authenticationerror';
import { UserRegistration } from '../../../../logic/common/userregistration';

describe('User', () => {
    let user: User;

    /**
     * Need to register middleware
     */
    before(() => {
        chai.use(chaiAsPromised);
    })

    /**
     * Reset the user each test
     */
    beforeEach(() => {
        user = new User();
    });

    describe('constructor()', () => {
        it('no params leaves it empty', () => {
            expect(user).to.be.an('object').that.is.empty;
        });
    });

    describe('setPassword()', () => {
        it('should reject short passwords', async () => {
            expect(user.setPassword('cat')).to.be.rejected;
        });

        it('a password can be set', async () => {
            expect(user.setPassword('password')).to.be.fulfilled;
        });
    });

    describe('validatePassword()', () => {
        beforeEach(async () => {
            await user.setPassword('password');
        });

        it('should reject bad passwords', async () => {
            expect(user.validatePassword('notvalid')).to.be.eventually.false;
        });

        it('should accept valid passwords', async () => {
            expect(user.validatePassword('password')).to.be.eventually.true;
        });
    });

    describe('fromRegistration()', async () => {
        user = await User.fromRegistration(new UserRegistration('username', 'password', 'name', 'email'));

        it('username should match', () => {
            expect(user.username).to.equal('username');
        });

        it('password should be defined', () => {
            expect(user.passwordHash).to.be.a('string');
        });

        it('name is a match', () => {
            expect(user.name).to.equal('name');
        });

        it('email is a match', () => {
            expect(user.email).to.equal('email');
        });
    });
});