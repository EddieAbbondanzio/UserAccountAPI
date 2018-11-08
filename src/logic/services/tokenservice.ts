import * as JsonWebToken from 'jsonwebtoken';
import { ServiceType } from "../common/servicetype";
import { IService } from "../common/iservice";
import { Database } from "../common/database";
import { StringUtils } from "../../util/stringutils";
import { NullArgumentError } from "../../common/error/types/nullargumenterror";
import { NotImplementedError } from "../../common/error/types/notimplementederror";
import { AuthenticationError } from '../../common/error/types/authenticationerror';
import { ErrorHandler } from '../../common/error/errorhandler';
import { UserLogin } from '../models/userlogin';
import { AccessToken } from '../common/accesstoken';
import { injectable, inject } from 'inversify';
import { IOC_TYPES } from '../../common/ioc/ioctypes';
import { Config } from '../../config/config';

/**
 * Service to encode and validate payloads through the use
 * of Json Web Tokens.
 */
@injectable()
export class AccessTokenService implements IService {
    /**
     * Tokens are good for 6 months.
     */
    public static TOKEN_LIFESPAN: number = 15780000;

    /**
     * The type of service it is.
     */
    readonly serviceType: ServiceType = ServiceType.Token;

    /**
     * The options used to sign tokens
     * for users.
     */
    private signOptions: JsonWebToken.SignOptions;

    /**
     * The options used to verify tokens
     * from users.
     */
    private verifyOptions: JsonWebToken.VerifyOptions;

    /**
     * The secret key to use to sign the tokens with.
     */
    private readonly signature: string;

    /**
     * Create a new token service.
     * @param signature The signature to use to sign tokens with.
     */
    constructor(@inject(IOC_TYPES.Config) config: Config) {
        if (config.tokenSignature == null) {
            throw new NullArgumentError('signature');
        }

        this.signOptions = {
            algorithm: 'HS256',
            expiresIn: AccessTokenService.TOKEN_LIFESPAN
        };

        this.verifyOptions = {
            algorithms: ['HS256']
        }

        this.signature = config.tokenSignature;
    }

    /**
     * Issue a new access token using the user login provided.
     * @param userLogin The user login to create a token for.
     * @returns The generated token.
     */
    public async issueToken(userLogin: UserLogin): Promise<AccessToken> {
        //Check for a payload
        if (userLogin == null) {
            throw new NullArgumentError('userLogin');
        }

        return new Promise<AccessToken>((resolve, reject) => {
            //JsonWebToken only allows POJOs as payloads.
            let payload: object = {
                userId: userLogin.user.id,
                loginCode: userLogin.code
            }

            JsonWebToken.sign(payload, this.signature, this.signOptions, (err, token) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(new AccessToken(userLogin.user.id, userLogin.code, token));
                }
            });
        });
    }

    /**
     * Authenticate a token to check if it is actually valid,
     * and extract the payload from it.
     * @param bearerToken The string of the jwt to authenticate.
     * @param constructor The constructor of the object to extract
     * from the payload.
     * @returns The decoded payload.
     */
    public async authenticateToken(bearerToken: string): Promise<AccessToken> {
        if (bearerToken == null) {
            throw new NullArgumentError('token');
        }

        return new Promise<AccessToken>((resolve, reject) => {
            JsonWebToken.verify(bearerToken, this.signature, this.verifyOptions, (error: Error, decoded: any) => {
                if (error) {
                    new ErrorHandler(error)
                        .catch(JsonWebToken.JsonWebTokenError, (err: JsonWebToken.JsonWebTokenError) => {
                            reject(new AuthenticationError(err.message));
                        })
                        .otherwiseRaise();
                }
                else {
                    if(decoded.userId == null || decoded.loginCode == null) {
                        throw new TypeError('Invalid token');
                    }

                    resolve(new AccessToken(decoded.userId, decoded.loginCode, bearerToken));
                }
            });
        });
    }
}