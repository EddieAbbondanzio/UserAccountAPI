import * as Express from 'express';
import * as HttpStatusCode from 'http-status-codes';
import { Config } from '../../config/config';
import { ServerErrorInfo } from './servererrorinfo';
import { TokenPayload } from '../../logic/common/tokenpayload';
import { TokenManager } from '../../logic/helpers/tokenmanager';
import { User } from '../../logic/models/user';
import { ServiceLocator } from '../../logic/common/servicelocator';
import { ServiceType } from '../../logic/common/servicetype';
import { IUserService } from '../../logic/services/iuserservice';
import { ServerErrorCode } from './servererrorcode';

/**
 * Decorator to restrict access to a API endpoint. If no JWT is
 * found on the incoming request then it is rejected.
 * @param target The instance or static class.
 * @param propertyKey The name of the method.
 * @param descriptor The method being decorated.
 */
export function authenticated(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let method: Function = descriptor.value;

    //We wrap the existing method so we can call express-jwt first.
    descriptor.value = async function (req: Express.Request, res: Express.Response) {
        //Is there any headers?
        if(req.headers == null || req.headers.authorization == null){
            sendUnauthorizedResponse(res, ServerErrorCode.NoAuthentication, 'No authentication header.');
            return;
        }
        
        //Is the header valid?
        let header: string[] = req.headers.authorization.split(' ');

        if(header.length != 2){
            sendUnauthorizedResponse(res, ServerErrorCode.PoorlyFormedAuthentication, 'Invalid format authentication header.');
            return;
        }

        //Is the token even valid?
        try {
            let token: string = header[1];
            let payload: TokenPayload = await TokenManager.instance.authenticateToken(token);

            //Catch will take ovver if the payload was bad.
            let user: User = await ServiceLocator.get<IUserService>(ServiceType.User).findById(payload.userId);

            //Attach the user to the request then call the regular method.
            req.user = user;
            return method.call(this, req, res);
        }
        catch{
            sendUnauthorizedResponse(res, ServerErrorCode.InvalidAuthentication, 'Invalid authentication token.'); 
            return;
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