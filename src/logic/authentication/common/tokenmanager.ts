import * as JWT from 'jsonwebtoken';
import { UserLogin, User } from '../../../data/datamodule';
import { TokenPayload } from './tokenpayload';

/**
 * Handles issuing and verifying jwt tokens to users. Use
 * this with the loginservice, and registerservice for authentication.
 */
export class TokenManager {
    /**
     * Tokens are good for 6 months.
     */
    private static TOKEN_LIFESPAN: number = 15780000;

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
     * The private key for encryption.
     */
    private secretKey: string;

    /**
     * Create a new token manager for handing
     * out and verifying tokens.
     * @param secretKey The secret encryption key.
     */
    constructor(secretKey: string) {
        this.signOptions = {
            algorithm: 'HS256',
            expiresIn: TokenManager.TOKEN_LIFESPAN
        };

        this.verifyOptions = {
            algorithms: ['HS256']
        }

        this.secretKey = secretKey;
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
            JWT.sign(payload, this.secretKey, this.signOptions, (error, token) => {
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
            JWT.verify(token, process.env.TOKEN_SECRET_KEY, this.verifyOptions, (error, decoded) => {
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