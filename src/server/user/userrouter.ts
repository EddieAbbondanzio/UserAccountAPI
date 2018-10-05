import {Router, Request, Response } from 'express';
import { UserService } from '../../logic/user/userservice';
import { User } from '../../data/datamodule';
import { Server } from '../server'
import { BaseController } from '../common/baserouter';
import { IServiceLocator } from '../../logic/common/iservicelocator';

/**
 * Router for locating user's via their name in the url.
 * This provides functionality for /user/username for user
 * retrieval. Usernames are case insensitive to
 * prevent URL collisions.
 */
export class UserRouter extends BaseController {
    /**
     * The underlying connection to the database 
     * for user objects.
     */
    private userService: UserService;

    /**
     * Create a new user router to handle requests related
     * to getting user info.
     * @param serviceLocator The dependency locator.
     */
    constructor(serviceLocator: IServiceLocator) {
        super();
        this.userService = serviceLocator.userService;
    }

    /**
     * Process a request searching for a user via their username.
     * @param request The request of the caller.
     * @param response The response to send back to the caller.
     */
    public async getUser(request: Request, response: Response):Promise<void> {
        let username:string = request.params.username;

        try {
            let user:User = await this.userService.findByUsername(username);

            if(user){
                //We only want to send SOME data back. For safety purposes
                //we'll create a new object and return that.
                let userInfo = {
                    username:       user.username,
                    joinedDate:     user.stats.joinedDate
                };

                response.send(userInfo);
            }
            else {
                response.sendStatus(404);
            }
        }
        catch(error) {
            console.log('UserRouter.getUser(): Error: ', error);
            response.sendStatus(503);
        }
    }

    /**
     * Initialize the methods that can
     * be accessed in this router.
     */
    protected init():void {
        this.router.get('/:username', async (req, res) => this.getUser(req, res));
    }
}