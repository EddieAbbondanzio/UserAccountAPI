import {UserService, AuthenticationService} from './servicemodule';

/**
 * A service locator is responsible for providing
 * the various services needed by the server. This
 * allows us to perform dependency inversion.
 */
export interface IServiceLocator {
    /**
     * The service to handle retrieving users based
     * off information such as their id, or username.
     */
    userService: UserService;

    /**
     * The service for authenticating credentials
     * and handling JWTs being sent in.
     */
    authService: AuthenticationService;
}