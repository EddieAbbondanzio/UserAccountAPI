import { Connection, createConnection } from "typeorm";
import { IServiceLocator } from "../../../../../logic/common/iservicelocator";
import { ServiceLocator } from "../../../../../logic/servicelocator";
import { LoginHandler } from "../../../../../logic/authentication/handlers/loginhandler";

/**
 * Test module for the Login Handler.
 */
describe('LoginHandler', () => {
    /**
     * The test login handler to work with.
     */
    let loginHandler: LoginHandler;

    /**
     * Prepare the dependencies for use.
     */
    beforeAll(async () => {
        let connection: Connection = await createConnection();
        let serviceLocator: IServiceLocator = new ServiceLocator();

        loginHandler = new LoginHandler(connection, serviceLocator);
    });

    /**
     * When no username is passed in the method should throw 
     * an error.
     */
    it('loginUserViaCredentials() should throw an error is no username.', async () => {

    });

    /**
     * When no password is passed in the method should throw
     * an error.
     */
    it('loginUserViaCredentials() should throw an error if no password.', async () => {

    });

    /**
     * If no user with the username passed in was found, it should
     * return null.
     */
    it('loginUserViaCredentials() should throw an error if no user found.', async () => {

    });

    /**
     * If the password passed in does not match the current password,
     * an error should be thrown.
     */
    it('loginUserViaCredentials() should throw an Auth Error when bad password', async () => {

    });

    /**
     * If the username and password match a user in the database, the
     * user should be returned.
     */
    it('loginUserViaCredentials() should return a user if valid credentials passed.', async () => {

    });

    /**
     * If the user is properly logged in they should have a new user
     * login tied to them with a JWT.
     */
    it('loginUserViaCredentials() should return a user with a login that has a JWT', async () => {

    });

    /**
     * When no token is passed, null should be returned.
     */
    it('', async () => {

    });

    /**
     * When an invalid token is passed, null should be returned.
     */
    it('', async () => {

    });

    /**
     * When a valid token is passed a user should be returned.
     */
    it('', async () => {

    });

    /**
    * When a valid token is passed a user should be returned with
    * a user login that has a new JWT with it.
    */
    it('', async () => {

    });

    //logout user no user

    //logout user no logged in user

    //logout user valid
});