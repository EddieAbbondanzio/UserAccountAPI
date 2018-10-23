import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised';
import { TokenManager } from '../../../../logic/helpers/tokenmanager';
import { User } from '../../../../logic/models/user';
import { TokenPayload } from '../../../../logic/common/tokenpayload';

describe('TokenManager', () => {
    let tokenManager: TokenManager;

    before(() => {
        tokenManager = new TokenManager('supersecretpasswordthatisnothunter2');
    });

    describe('issueToken()', () => {
        it('should throw an error if no user', async () => {
            expect(tokenManager.issueToken(undefined)).to.eventually.be.rejected;
        });

        it('should throw an error if no id on the user', async () => {
            let user: User = new User();
            expect(tokenManager.issueToken(user)).to.eventually.be.rejected;
        });

        it('should issue a token for a user', async () => {
            let user: User = new User();
            user.id = 117;

            expect(tokenManager.issueToken(user)).to.eventually.be.fulfilled;
        });
    });

    describe('verifyToken()', () => {
        it('should return null for bad tokens', async () => {
            let token: string = 'notatoken'
            expect(tokenManager.verifyToken(token)).to.eventually.be.null;
        });

        it('should return a payload for valid tokens', async () => {
            let user: User = new User();
            user.id = 117;

            let token: string = await tokenManager.issueToken(user);
            expect(tokenManager.verifyToken(token)).to.eventually.be.a('object').with.property('userId', 117);
        });
    });
});