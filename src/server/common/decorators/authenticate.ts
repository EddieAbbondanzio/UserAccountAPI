import * as Express from 'express';
import * as HttpStatusCode from 'http-status-codes';
import { ServerErrorInfo } from '../servererrorinfo';
import { User } from '../../../logic/models/user';
import { ServiceType } from '../../../logic/common/servicetype';
import { IUserService } from '../../../logic/contract/services/iuserservice';
import { ServerErrorCode } from '../servererrorcode';
import { IAccessTokenService } from '../../../logic/contract/services/iaccesstokenservice';
import { InvalidOperationError } from '../../../common/error/types/invalidoperation';
import { AccessToken } from '../../../logic/common/accesstoken';
import { ErrorHandler } from '../../../common/error/errorhandler';
import { AuthenticationError } from '../../../common/error/types/authenticationerror';
import { ExpressUtils } from '../../../util/expressutils';
import { IocContainer } from '../../ioccontainer';
import { IOC_TYPES } from '../../../common/ioc/ioctypes';


/**
 * Decorator to restrict access to a API endpoint. If no JWT is
 * found on the incoming request then it is rejected with a status of 401.
 * @param target The instance or static class.
 * @param propertyKey The name of the method.
 * @param descriptor The method being decorated.
 */
export function authenticate() {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let method: Function = descriptor.value;

        //We wrap the existing method so we can call express-jwt first.
        descriptor.value = async function (req: Express.Request, res: Express.Response) {
            let bearerToken: string = ExpressUtils.getBearerToken(req);

            //Is there any headers?
            if(bearerToken == null){
                sendUnauthorizedResponse(res, ServerErrorCode.NoAuthentication, 'No authentication token.');
                return;
            }
    
            //Is the token even valid?
            try {
                let tokenService: IAccessTokenService = IocContainer.instance.get(IOC_TYPES.TokenService);

                if(tokenService == null){
                    throw new InvalidOperationError('Cannot authenticate a user with no token service');
                }

                let accessToken: AccessToken = await tokenService.authenticateToken(bearerToken);

                //Catch will take over if the payload was bad.
                let user: User = await IocContainer.instance.get<IUserService>(IOC_TYPES.UserService).findById(accessToken.userId);
    
                //Attach the user to the request then call the regular method.
                req.user = user;
                return method.call(this, req, res);
            }
            catch (error) {
                new ErrorHandler(error)
                .catch(AuthenticationError, (error: AuthenticationError) => {
                    sendUnauthorizedResponse(res, ServerErrorCode.InvalidAuthentication, 'Invalid authentication token.'); 
                })
                .otherwiseRaise();
            }
        };
    
        /**
         * Send a response back with HTTP status 401.
         * @param errorCode The error code (not the HTTP status code) to send.
         * @param errorMessage The message of the error.
         */
        function sendUnauthorizedResponse(res: Express.Response, errorCode: ServerErrorCode, errorMessage: string): void {
            res.status(HttpStatusCode.UNAUTHORIZED)
            .json(new ServerErrorInfo(errorCode, errorMessage));
        }
    }
}