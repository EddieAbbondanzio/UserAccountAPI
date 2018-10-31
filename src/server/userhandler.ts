import * as Express from 'express';
import { IUserService } from '../logic/services/iuserservice';

/**
 * Router responsible for handling all incoming
 * requests related to users.
 */
export class UserHandler {
    /**
     * The user service from the BLL.
     */
    private userService: IUserService;

    /**
     * The underlying express router.
     */
    private expressRouter: Express.Router;

    /**
     * Create a new user router.
     * @param userService The userservice to use.
     */
    constructor(userService: IUserService) {
        this.userService = userService;
    }
}