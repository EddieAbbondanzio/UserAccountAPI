import { expect } from 'chai';
import 'mocha';
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised';
import { TokenManager } from '../../../../logic/helpers/tokenmanager';
import { User } from '../../../../logic/models/user';
import { TokenPayload } from '../../../../logic/common/tokenpayload';
import { NullArgumentError } from '../../../../common/error/types/nullargumenterror';
import { ArgumentError } from '../../../../common/error/types/argumenterror';
import { AuthenticationError } from '../../../../logic/common/authenticationerror';

describe('TokenManager', () => {
    let tokenManager: TokenManager;

    before(() => {
        tokenManager = new TokenManager('supersecretpasswordthatisnothunter2');
    });

    describe('issueToken()', async () => {
        it('should throw an error if no user', async () => {
            expect(tokenManager.issueToken(undefined)).to.eventually.be.rejectedWith(NullArgumentError);
        });

        it('should throw an error if no id on the user', async () => {
            let user: User = new User();
            expect(tokenManager.issueToken(user)).to.eventually.be.rejectedWith(ArgumentError);
        });

        it('should issue a token for a user', async () => {
            let user: User = new User();
            user.id = 117;

            expect(tokenManager.issueToken(user)).to.eventually.be.fulfilled;
        });
    });

    describe('verifyToken()', async () => {
        it('throws an error for bad tokens', async () => {
            let token: string = 'notatoken'
            expect(tokenManager.authenticateToken(token)).to.eventually.be.rejectedWith(AuthenticationError);
        });

        it('returns a payload for valid tokens', async () => {
            let user: User = new User();
            user.id = 117;

            let token: string = await tokenManager.issueToken(user);
            return expect(tokenManager.authenticateToken(token)).to.eventually.be.fulfilled;
        });
    });
});