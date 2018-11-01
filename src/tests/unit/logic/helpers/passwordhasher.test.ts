import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised';
import { PasswordHasher } from '../../../../logic/helpers/passwordhasher';
import { NullArgumentError } from '../../../../common/error/types/nullargumenterror';

describe('PasswordHasher', () => {
    /**
     * Need to register middleware
     */
    before(() => {
        chai.use(chaiAsPromised);
    });

    describe('generateHash()', async () => {
        it('throws an error when no password passed', async () => {
            expect(PasswordHasher.generateHash(undefined)).to.be.rejectedWith(NullArgumentError, 'password');
        });

        it('generates a hash when a password is given', async () => {
            expect(PasswordHasher.generateHash('password')).to.eventually.be.fulfilled;
        });
    });

    describe('validateHash()', async () => {
        it('throws an error when no password', async () => {
            expect(PasswordHasher.validateHash(undefined, 'hash')).to.be.rejectedWith(NullArgumentError, 'password');
        });

        it('throws an error when no hash is given', async () => {
            expect(PasswordHasher.validateHash('pass', undefined)).to.be.rejectedWith(NullArgumentError, 'hash');
        });

        it('returns true for a valid password', async () => {
            let hash = await PasswordHasher.generateHash('password');
            expect(PasswordHasher.validateHash('password', hash)).to.eventually.be.fulfilled.and.be.true;
        });

        it('rejects a bad password', async () => {
            let hash = await PasswordHasher.generateHash('password');
            expect(PasswordHasher.validateHash('notit', hash)).to.eventually.be.fulfilled.and.be.false;
        });
    });
});