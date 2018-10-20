import { LogicHandler } from "../../common/logichandler";
import { Connection } from "typeorm";
import { IServiceLocator } from "../../common/iservicelocator";
import { User } from "../../../data/user/user";
import { UserRepository, ResetToken, ResetTokenRespository } from "../../../data/models";
import { IEmailService } from "../../services/email/iemailservice";
import { TextEmail } from "../../services/email/types/textemail";

/**
 * Handler for recovering forgotten accounts.
 */
export class RecoveryHandler extends LogicHandler {
    /**
     * Service for sending out emails.
     */
    private emailService: IEmailService;

    /**
     * Create a new recovery handler.
     * @param connection The database connection.
     * @param serviceLocator The service locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator){
        super(connection, serviceLocator);

        this.emailService = serviceLocator.emailService;
    }
    
    /**
     * User forgot their username and wants it emailed to them.
     * @param email The user's email to send it to.
     */
    public async emailUserTheirUsername(email: string): Promise<void> {
        let userRepo = this.connection.getCustomRepository(UserRepository);
        let user: User = await userRepo.findByEmail(email);

        //Only proceed if a user was found.
        if(user){
            let resetEmail: TextEmail = new TextEmail(user.email, 
                'No Mans Blocks Username',
                'Hi, your username is: ' + user.username    
            );

            await this.emailService.sendEmail(resetEmail);
        }
    }

    /**
     * User forgot their email and wants a temporary access password
     * emailed to them. This will not remove their existing password.
     * @param username The username of the user to email.
     */
    public async emailUserResetToken(username: string): Promise<void> {
        let userRepo = this.connection.getCustomRepository(UserRepository);
        let user: User = await userRepo.findByUsername(username);

        //Only send an email if a user was found.
        if(user){
            //Generate them a reset token.
            let tokenRepo: ResetTokenRespository = this.connection.getCustomRepository(ResetTokenRespository);
            let rToken: ResetToken = new ResetToken(user);
            await tokenRepo.add(rToken);

            let resetEmail: TextEmail = new TextEmail(user.email,
                'No Mans Blocks Password Reset',
                'Hi, your password reset code is: ' + rToken.code
            );

            await this.emailService.sendEmail(resetEmail);
        }
    }
}