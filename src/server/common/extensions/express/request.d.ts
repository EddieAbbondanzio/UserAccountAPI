import { Request } from 'express';
import { User } from '../../../../logic/models/user';
import { NotImplementedError } from '../../../../common/error/types/notimplementederror';

/*
 * Extension for adding a user property to the
 * request of Express.
 */

declare global {
     namespace Express {
        export interface Request {
            user?: User;
        }
    }
}
