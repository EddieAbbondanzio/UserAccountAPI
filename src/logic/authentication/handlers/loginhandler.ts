import { LogicHandler } from "../../common/logichandler";
import { Connection } from "typeorm";
import { IServiceLocator } from "../../common/iservicelocator";
import { User, UserLoginRepository, UserLogin, IUserRepository } from "../../../data/models";
import { AuthenticationError } from "../common/authenticationerror";
import { TokenManager } from "../common/tokenmanager";
import { TokenPayload } from "../common/tokenpayload";
import { StringUtils } from "../../../util/stringutils";
import { DataAccessLayer } from "../../../data/dataaccesslayer";

/**
 * Business logic for the login portion of the
 * authentication component.
 */
export class LoginHandler extends LogicHandler {
    /**
     * The JWT manager.
     */
    private tokenManager: TokenManager;

    /**
     * The user repository for managing CRUD
     * operations with the database for users.
     */
    private userRepo: IUserRepository;

    /**
     * The login repository for managing CRUD
     * operations with the database for user logins.
     */
    private loginRepo: UserLoginRepository;

    /**
     * Create a new login handler.
     * @param serviceLocator The dependency locator.
     */
    constructor(serviceLocator: IServiceLocator) {
        super(serviceLocator);

        this.tokenManager = serviceLocator.tokenManager;
        this.userRepo = DataAccessLayer.current.userRepo;
    }

    /**
     * Login a user via their credentials.
     * @param username The user's username.
     * @param password The user's password.
     * @returns The user if successful. Otherwise null.
     */
    public async loginUserViaCredentials(username: string, password: string): Promise<User> {
        if(StringUtils.isEmpty(username) || StringUtils.isEmpty(password)){
            throw new Error('No username or password passed in!');
        }

        let user = await this.userRepo.findByUsername(username);

        if(!user){
            return null;
        }

        //Are they authentic?
        if(!(await user.validatePassword(password))){
            throw new AuthenticationError('User is not authorized.');
        }

        //Issue them a login
        let login: UserLogin = new UserLogin(user);
        login.token = await this.tokenManager.issueToken(user);

        //Save it
        await this.loginRepo.add(login);
        user.login = login;

        return user;
    }

    /**
     * Login a user using a JWT they have.
     * @param token The JWT from a previous login.
     * @returns The user if successful. Otherwise null.
     */
    public async loginUserViaToken(token: string): Promise<User> {
        let payLoad: TokenPayload = await this.tokenManager.verifyToken(token);
        let user: User = await this.userRepo.findById(payLoad.userId);

        //Issue them a login
        let login: UserLogin = new UserLogin(user);
        login.token = await this.tokenManager.issueToken(user);

        //Save it
        await this.loginRepo.add(login);
        user.login = login;

        return user;
    }

    /**
     * Log out a user that is currently logged in.
     * @param user The username to log out.
     * @returns True if logged out.
     */
    public async logoutUser(user: User): Promise<boolean> {
        if(!user.login){
            throw new Error('User is not logged in!');
        }

        //Delete it from the db
        let success = await this.loginRepo.delete(user.login);
        user.login = null;

        return success;
    }
}