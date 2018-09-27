import * as JWT from 'jsonwebtoken';
import { UserLogin, User } from '../../data/datamodule';
import { Secrets } from '../../secret';
import { TokenPayload } from './tokenpayload';

/**
 * Handles issuing and verifying jwt tokens to users. Use
 * this with the loginservice, and registerservice for authentication.
 */
export class TokenManager {
    /**
     * Tokens are good for 3 days.
     */
    private static TOKEN_LIFESPAN: number = 7776000;

    /**
     * The options used to sign tokens
     * for users.
     */
    private signOptions: JWT.SignOptions;

    /**
     * The options used to verify tokens
     * from users.
     */
    private verifyOptions: JWT.VerifyOptions;

    /**
     * Create a new token manager for handing
     * out and verifying tokens.
     */
    constructor() {
        this.signOptions = {
            algorithm: 'HS256',
            expiresIn: TokenManager.TOKEN_LIFESPAN
        };

        this.verifyOptions = {
            algorithms: ['HS256']
        }
    }

    /**
     * Issue a new token for a specific user. This
     * puts their user id in the token for later
     * retrieval.
     * @param User The user to issue a token for.
     */
    public async issueToken(user: User):Promise<string> {
        if(!user){
            throw new Error('AuthenticationService.issueToken(): No user passed in!');
        }

        //The payload we want to pack in the JWT.
        let payload: object = {
            userId: user.id
        };

        return new Promise<string>((resolve, reject) => {
            JWT.sign(payload, Secrets.TOKEN_SECRET_KEY, this.signOptions, (error, token) => {
                if(error){
                    reject(error);
                }
                else {
                    resolve(token);
                }
            });
        });
    }

    /**
     * Verify a JWT to see if the sender is authorized
     * or not. If the token is successfully verified the user's
     * id is returned.
     * @param token The JWT to verify.
     */
    public async verifyToken(token: string):Promise<TokenPayload> {
        if(!token){
            throw new Error('AuthenticationService.issueToken(): No token passed in!');
        }

        return new Promise<any>((resolve, reject) => {
            JWT.verify(token, Secrets.TOKEN_SECRET_KEY, this.verifyOptions, (error, decoded) => {
                if(error){
                    reject(error);
                }
                else {
                    let payload: TokenPayload = new TokenPayload(parseInt((decoded as any).userId, 10));
                    resolve(payload);
                }
            });
        });
    }
}