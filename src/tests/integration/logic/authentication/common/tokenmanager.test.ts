import { TokenManager } from "../../../../../logic/authentication/common/tokenmanager";
import { User } from "../../../../../data/user/user";
import { TokenPayload } from "../../../../../logic/authentication/common/tokenpayload";

/**
 * Test module for the Token Manager utility used by the 
 * Authentication handler for issuing out JWTs
 */
describe('TokenManager', () => {
    /**
     * Ensure that the token manager throws an error when
     * no secret key to use to sign tokens is passed in.
     */
    it('crashes and burns when no secret key passed in.', () => {
        expect(() => {
            let manager: TokenManager = new TokenManager(undefined);
        }).toThrow();
    });

    /**
     * The token manager should act perfectly normal when a
     * valid secret key is provided.
     */
    it('creates a new token manager when a key is passed.', () => {
        expect(() => { 
            let manager: TokenManager = new TokenManager('CorrecHorseBatteryStaple'); 
        }).not.toThrow();
    });

    /**
     * An error should be thrown when no user is passed in 
     * to the issue token method.
     */
    it('issueToken() throws an error when no user.', async () => {
        let manager: TokenManager = new TokenManager('CorrecHorseBatteryStaple'); 
        expect(manager.issueToken(null)).rejects.toThrow();
    });

    /**
     * An error should be thrown when the user has no id, as this
     * means they aren't in the database, and the payload will be useless.
     */
    it('issueToken() throws an error when no user id.', async () => {
        let manager: TokenManager = new TokenManager('CorrecHorseBatteryStaple'); 
        let user: User = new User();
        expect(manager.issueToken(user)).rejects.toThrow();
    });

    /**
     * A user can be issued a token as long as the user
     * has a user id.
     */
    it('issues tokens to users.', async () => {
        let manager: TokenManager = new TokenManager('CorrecHorseBatteryStaple'); 
        let user: User = new User();
        user.id = 1;

        let token: string = await manager.issueToken(user);
        expect(token).toBeDefined();
    });

    /**
     * Tokens that were signed by the token manager should be
     * accepted.
     */
    it('validates legit tokens correctly', async () => {
        let manager: TokenManager = new TokenManager('CorrecHorseBatteryStaple'); 
        let user: User = new User();
        user.id = 1;

        let token: string = await manager.issueToken(user);
        let payload: TokenPayload = await manager.verifyToken(token);

        expect(payload.userId).toBe(user.id);
    });

    /**
     * Tokens that weren't created by the token manager should
     * throw an error.
     */
    it('rejects illegal tokens', async () => {
        let manager: TokenManager = new TokenManager('CorrecHorseBatteryStaple'); 
        expect(manager.verifyToken('NOT A TOKEN')).rejects.toThrow();
    });
});