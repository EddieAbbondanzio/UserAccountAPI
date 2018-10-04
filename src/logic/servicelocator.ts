import { IServiceLocator } from "./iservicelocator";
import { UserService } from "./user/userservice";
import { AuthService } from "./security/authservice";
import { Connection } from "typeorm";
import { IEmailService } from "./email/iemailservice";
import { ZohoEmailService } from "./email/zohoemailservice";
import { EmailCredentials } from "./email/emailcredentials";
import { Secret } from "../secret";

/**
 * Service locator for providing the dependencies
 * that the server relies on. This is dependecy
 * inversion in action.
 */
export class ServiceLocator implements IServiceLocator {
    /**
     * The service for looking up users via their
     * username or password.
     */
    public userService: UserService;

    /**
     * The service for handling credentials and JWTs.
     */
    public authService: AuthService;

    /**
     * Service for sending out emails.
     */
    public emailService: IEmailService;

    /**
     * Create a new service locator.
     * @param dbConnection The connection to the database.
     */
    constructor(dbConnection: Connection) {
        this.userService  = new UserService(dbConnection);
        this.authService  = new AuthService(dbConnection, Secret.TOKEN_SECRET_KEY);
        this.emailService = new ZohoEmailService(Secret.EMAIL_CREDENTIALS);
    }
}