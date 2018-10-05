import { IEmailService } from '../services/email/iemailservice';
import { TokenManager } from '../authentication/common/tokenmanager';

/**
 * A service locator is responsible for providing
 * the various services needed by the server. This
 * allows us to perform dependency inversion.
 */
export interface IServiceLocator {
    /**
     * The service for sending out emails.
     */
    emailService: IEmailService;

    /**
     * The JWT manager.
     */
    tokenManager: TokenManager;
}