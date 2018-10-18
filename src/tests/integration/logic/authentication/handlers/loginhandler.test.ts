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
     * Test module for every test related to the loginUserViaCredentials()
     * method of the Login Handler.
     */
    describe('loginUserViaCredentials()', () => {
        /**
         * When no username is passed in the method should throw 
         * an error.
         */
        it('should throw an error is no username.', async () => {
            await expect(loginHandler.loginUserViaCredentials(undefined, 'PASS')).rejects.toThrow();
        });

        /**
         * When no password is passed in the method should throw
         * an error.
         */
        it('should throw an error if no password.', async () => {
            await expect(loginHandler.loginUserViaCredentials('USER', undefined)).rejects.toThrow();
        });

        /**
         * If no user with the username passed in was found, it should
         * return null.
         */
        it('returns null if no user found.', async () => {
            await expect(loginHandler.loginUserViaCredentials('USER', 'PASS')).toBeNull();
        });

        /**
         * If the password passed in does not match the current password,
         * an error should be thrown.
         */
        it('should return null when bad password.', async () => {
            await expect(loginHandler.loginUserViaCredentials('USER', 'PASS')).toBeNull();
        });

        /**
         * If the username and password match a user in the database, the
         * user should be returned.
         */
        it('should return a user if valid credentials passed.', async () => {

        });

        /**
         * If the user is properly logged in they should have a new user
         * login tied to them with a JWT.
         */
        it('should return a user with a login that has a JWT', async () => {

        });
    });

    /**
     * Test module for the loginUserViaToken method of the LoginHandler.
     */
    describe('loginUserViaToken()', () => {
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
    });

    /**
     * Test module for the logoutUser method of the LoginHandler.
     */
    describe('logoutUser()', () => {
        //logout user no user

        //logout user no logged in user

        //logout user valid
    });
});