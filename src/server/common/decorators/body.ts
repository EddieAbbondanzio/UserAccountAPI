import * as Express from 'express';
import * as HttpStatusCode from 'http-status-codes';
import { ServerErrorInfo } from '../servererrorinfo';
import { ServerErrorCode } from '../servererrorcode';
import { BodyOptions } from './bodyoptions';

/**
 * Decorator to require a specific format for the body of the
 * incoming request. If the body is incorrectly formatted, then
 * a HTTP status of 400 is returned.
 * @param constructor The constructor of the object expected to
 * be in the body.
 * @param options The options to use.
 */
export function body<T>(constructor: IConstructor<T>, options?: BodyOptions) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        let instance: T = new constructor();
        let method: Function = descriptor.value;

        descriptor.value = function(req: Express.Request, res: Express.Response) {
            let isBodyValid: boolean = true;

            //Is the body structurally identical to our type? TODO: Make this recursive.
            for (var prop in instance) {
                if (!req.body.hasOwnProperty(prop)) {
                    isBodyValid = false;
                    break;
                }
            }

            //Do we need to reject it?
            if(!isBodyValid && (options == null || (options != null && !options.optional))){
                res.status(HttpStatusCode.BAD_REQUEST)
                .json(new ServerErrorInfo(ServerErrorCode.MissingBodyParameter, 'Request body is missing property: ' + prop));
                return;
            }

            //Pull the ole switcheroo
            Object.assign(instance, req.body);
            req.body = instance;

            method.call(this, req, res);
        }
    }
}