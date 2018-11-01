import * as ExpressJWT from 'express-jwt';
import * as Express from 'express';
import { Config } from '../../config/config';

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
        //Is the user authenticated, if not this will throw an error.
        ExpressJWT({secret: Config.current.tokenSignature });
        
        //Now call the method if we made it this far.
        method.call(this, req, res);
    };
}