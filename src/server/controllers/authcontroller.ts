import { BaseController } from "../common/baserouter";
import { IServiceLocator } from "../../logic/iservicelocator";
import { Response, Request } from "express";

/**
 * Controller for handling login requests, along with validating
 *  users to see if they are who they claim
 * to be.
 */
export class AuthController extends BaseController {
    /**
     * Create a new instance of the authentication controller.
     * @param serviceLocator The service locator for 
     * dependency inversion.
     */
    constructor(serviceLocator: IServiceLocator) {
        super();
    }

    /**
     * Process a request for a user login. This will look for
     * a JWT or username + password in the body of the request.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    public async loginUser(request: Request, response: Response):Promise<void> {
        console.log('logging in!');
    }

    /**
     * Process a request to log out a user that is logged in.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    public async logoutUser(request: Request, response: Response):Promise<void> {
        console.log('logging out!');
    }

    /**
     * Validate the login id (guid) and username passed in. If
     * the login is valid then the player id is returned. Otherwise
     * -1 is returned.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    public async validateUser(request: Request, response: Response):Promise<void> {
        console.log('validating user');
    }

    /**
     * Reset a users password. This expects a verification token
     * to be passed along with their new password. The verification
     * token was sent to them via their email.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    public async resetPassword(request: Request, response: Response):Promise<void> {
        //This should be rate limited.
    }

    /**
     * Update a users password. This expects a username, along with
     * their current password. This is rate limited.
     * @param request The incoming web request.
     * @param response The outgoing web response being built.
     */
    public async updatePassword(request: Request, response: Response):Promise<void> {
        //This should be rate limited.
    }

    /**
     * Initialize the router and any services that it
     * may need.
     */
    protected init():void {
        this.router.post('/login', this.loginUser);
        this.router.post('/logout', this.logoutUser);
        this.router.put('/resetpassword', this.resetPassword);
        this.router.put('/updatepassword', this.updatePassword);
    }
}