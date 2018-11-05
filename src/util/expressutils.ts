import * as Express from 'express';
import { NullArgumentError } from '../common/error/types/nullargumenterror';

export module ExpressUtils {
    /**
     * Get the bearer token from the authentication header
     * of the incoming request.
     * @param request The request to extract the bearer
     * token from.
     * @returns The token, or null if none found.
     */
    export function getBearerToken(request: Express.Request): string {
        if(request == null){
            throw new NullArgumentError('request');
        }

        //Any headers?
        if(request.headers == null || request.headers.authorization == null) {
            return null;
        }

        //It always starts with 'Bearer '
        let headerContent: string[] = request.headers.authorization.split(' ');

        if(headerContent.length != 2){
            return null;
        }

        return headerContent[1];
    }
}