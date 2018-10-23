import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised';
import { PasswordHasher } from '../../../../logic/helpers/passwordhasher';

describe('PasswordHasher', () => {
    /**
     * Need to register middleware
     */
    before(() => {
        chai.use(chaiAsPromised);
    })

    describe('generateHash()', () => {
        it('throws an error when no password passed', async () => {
            expect(PasswordHasher.generateHash(undefined)).to.eventually.be.rejected;
        });

        it('generates a hash when a password is given', async () => {
            expect(PasswordHasher.generateHash('password')).to.eventually.be.fulfilled;
        });
    });

    describe('validateHash()', () => {
        it('throws an error when no password, or hash is given', async () => {
            expect(PasswordHasher.validateHash(undefined, undefined)).to.eventually.be.rejected;
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