import * as JWT from 'jsonwebtoken';
import { StringUtils } from '../../util/stringutils';
import { User } from '../models/user';
import { TokenPayload } from '../common/tokenpayload';
import { NullArgumentError } from '../../common/error/types/nullargumenterror';
import { ArgumentError } from '../../common/error/types/argumenterror';
import { ErrorHandler } from '../../common/error/errorhandler';
import { AuthenticationError } from '../common/authenticationerror';

/**
 * Handles issuing and verifying jwt tokens to users. Use
 * this with the loginservice, and registerservice for authentication.
 */
export class TokenManager {
    /**
     * The singleton instance.
     */
    public static instance: TokenManager;

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
        if(StringUtils.isEmpty(secretKey)){
            throw new ArgumentError('secretKey');
        }

        this.signOptions = {
            algorithm: 'HS256',
            expiresIn: TokenManager.TOKEN_LIFESPAN
        };

        this.verifyOptions = {
            algorithms: ['HS256']
        }

        this.secretKey = secretKey;
        TokenManager.instance = this;
    }

    /**
     * Issue a new token for a specific user. This
     * puts their user id in the token for later
     * retrieval.
     * @param User The user to issue a token for.
     */
    public async issueToken(user: User):Promise<string> {
        if(user == null){
            throw new NullArgumentError('user');
        }
        else if(isNaN(user.id)) {
            throw new ArgumentError('user', 'has no id');
        }

        /*
        * DO NOT CHANGE THIS TO A TOKENPAYLOAD.
        * You'll throw errors and waste time hunting
        * them down....
        */
        let payload: any = { id: user.id };

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
    public async authenticateToken(token: string):Promise<TokenPayload> {
        if(!token){
            throw new NullArgumentError('token');
        }

        return new Promise<TokenPayload>((resolve, reject) => {
            JWT.verify(token, this.secretKey, this.verifyOptions, (error, decoded) => {
                if(error){
                    new ErrorHandler(error)
                    .catch(JWT.JsonWebTokenError, (err: JWT.JsonWebTokenError) => {
                        reject(new AuthenticationError(err.message));
                    })
                    .otherwiseRaise();
                }
                else {
                    let payload: TokenPayload = new TokenPayload(parseInt((decoded as any).userId, 10));
                    resolve(payload);
                }
            });
        });
    }
}