import { LogicHandler } from "../../common/logichandler";
import { Connection } from "typeorm";
import { IServiceLocator } from "../../common/iservicelocator";
import { User } from "../../../data/user/user";
import { UserLoginRepository, UserLogin } from "../../../data/models";
import { AuthenticationError } from "../common/authenticationerror";

/**
 * Business logic for validating users are who they
 * claim they are.
 */
export class ValidationHander extends LogicHandler {
    /**
     * The login repository for CRUD operations with 
     * the database.
     */
    private loginRepo: UserLoginRepository;

    /**
     * Create a new validation handler.
     * @param connection The database connection.
     * @param serviceLocator The service locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator) {
        super(connection, serviceLocator);
        this.loginRepo = connection.getCustomRepository(UserLoginRepository);
    }

    /**
     * Validate that a user is who they claim to be. This will check their username
     * against the login provided in the database.
     * @param user The user to validate.
     * @param loginCode Their login guid.
     * @returns True if the user is who they claim to be.
     */
    public async validateUser(user: User, loginCode: string): Promise<boolean> {
        if(!user){
            throw new Error('No user passed in');
        }

        //Try to find the login.
        let userLogin: UserLogin = await this.loginRepo.findByUser(user);

        if(userLogin && userLogin.code == loginCode){
            return true;
        }
        else {
            return false;
        }
    }
}