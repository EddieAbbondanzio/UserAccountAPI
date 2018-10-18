import { IServiceLocator } from "./common/iservicelocator";
import { Connection } from "typeorm";
import { IEmailService } from "./services/email/iemailservice";
import { ZohoEmailService } from "./services/email/zohoemailservice";
import { EmailCredentials } from "./services/email/emailcredentials";
import { TokenManager } from "./authentication/common/tokenmanager";

/**
 * Service locator for providing the dependencies
 * that the server relies on. This is dependecy
 * inversion in action.
 */
export class ServiceLocator implements IServiceLocator {
    /**
     * Service for sending out emails.
     */
    public emailService: IEmailService;

    /**
     * The JWT manager.
     */
    public tokenManager: TokenManager;

    /**
     * Create a new service locator.
     */
    constructor() {
        console.log(process.env);
        this.emailService = new ZohoEmailService(process.env.EMAIL_USERNAME, process.env.EMAIL_PASSWORD);
        this.tokenManager = new TokenManager(process.env.TOKEN_SECRET_KEY);
    }
}