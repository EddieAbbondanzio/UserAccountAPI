import { Request } from 'express';
import { User } from "../../data/user/user";
import { userInfo } from 'os';

declare global {
    namespace Express {
        /**
         * Extension to expand upon the existing request. This
         * allows us to add a .user property so we can easily check
         * if there is an active user.
         */
        interface Request {
            /**
             * Shortcut to get the user from the user
             * login tied to the request.
             */
            user: User;
        }
    }
}