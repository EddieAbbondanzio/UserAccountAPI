import * as JsonWebToken from 'jsonwebtoken';
import { ServiceType } from "../common/servicetype";
import { IService } from "../common/iservice";
import { Database } from "../common/database";
import { StringUtils } from "../../util/stringutils";
import { NullArgumentError } from "../../common/error/types/nullargumenterror";
import { NotImplementedError } from "../../common/error/types/notimplementederror";
import { AuthenticationError } from '../../common/error/types/authenticationerror';
import { ErrorHandler } from '../../common/error/errorhandler';

/**
 * Service to encode and validate payloads through the use
 * of Json Web Tokens.
 */
export class TokenService<T extends object> implements IService {
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
    constructor(signature: string) {
        if (signature == null) {
            throw new NullArgumentError('signature');
        }

        this.signOptions = {
            algorithm: 'HS256',
            expiresIn: TokenService.TOKEN_LIFESPAN
        };

        this.verifyOptions = {
            algorithms: ['HS256']
        }

        this.signature = signature;
    }

    /**
     * Issue a token that contains the provided payload within it.
     * Don't send out anything secret as the contents can be
     * viewed by the token bearer.
     * @param payload The payload to encode into the JWT.
     * @returns The issued token.
     */
    public async issueToken<T>(payload: T): Promise<string> {
        //Check for a payload
        if (payload == null) {
            throw new NullArgumentError('payload');
        }

        return new Promise<string>((resolve, reject) => {
            //JsonWebToken only allows POJOs as payloads.
            let p: object = Object.assign({}, payload);

            JsonWebToken.sign(p, this.signature, this.signOptions, (err, token) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(token);
                }
            });
        });
    }

    /**
     * Authenticate a token to check if it is actually valid,
     * and extract the payload from it.
     * @param token The string of the jwt to authenticate.
     * @param constructor The constructor of the object to extract
     * from the payload.
     * @returns The decoded payload.
     */
    public async authenticateToken<T>(token: string, constructor: IConstructor<T>): Promise<T> {
        if (token == null) {
            throw new NullArgumentError('token');
        }

        return new Promise<T>((resolve, reject) => {
            JsonWebToken.verify(token, this.signature, this.verifyOptions, (error: Error, decoded: object) => {
                if (error) {
                    new ErrorHandler(error)
                        .catch(JsonWebToken.JsonWebTokenError, (err: JsonWebToken.JsonWebTokenError) => {
                            reject(new AuthenticationError(err.message));
                        })
                        .otherwiseRaise();
                }
                else {
                    let payload: T = new constructor();

                    for (let p in payload) {
                        if (payload.hasOwnProperty(p)) {
                            if (decoded.hasOwnProperty(p)) {
                                (<any>payload)[p] = (<any>decoded)[p];
                            }
                            else {
                                reject(new TypeError('Payload is missing property: ' + p));
                            }
                        }
                    }

                    resolve(payload as T);
                }
            });
        });
    }
}