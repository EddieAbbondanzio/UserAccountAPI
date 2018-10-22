import { ValidatorResult } from "../validation/validatorresult";
import { User } from "../models/user";
import { TextEmail } from "../email/types/textemail";
import { IEmailService } from "../email/iemailservice";
import { ResetToken } from "../models/resettoken";
import { ValidationError } from "../validation/validationerror";
import { UserUpdateValidator } from "../validation/user/validators/userupdatevalidator";
import { UserDeleteValidator } from "../validation/user/validators/userdeletevalidator";
import { Service } from "../common/service";
import { IDatabase } from "../common/idatabase";
import { ServiceType } from "../common/servicetype";

/**
 * The user service for retrieving users from the system.
 */
export class UserService extends Service {
    /**
     * The type of service it is.
     */
    readonly serviceType: ServiceType = ServiceType.User;

    /**
     * The service for sending out emails.
     */
    private emailService: IEmailService;

    /**
     * The validator to validate a user being updated.
     */
    private userUpdateValidator: UserUpdateValidator;

    /**
     * The validator to validate a user being deleted.
     */
    private userDeleteValidator: UserDeleteValidator;

    /**
     * Create a new user service.
     * @param emailService: The service for sending emails.
     */
    constructor(database: IDatabase, emailService: IEmailService) {
        super(database);
        this.emailService = emailService;
        
        this.userUpdateValidator = new UserUpdateValidator();
        this.userDeleteValidator = new UserDeleteValidator();
    }

    /**
     * User forgot their username and wants it emailed to them.
     * @param email The user's email to send it to.
     */
    public async emailUserTheirUsername(email: string): Promise<void> {
        let user: User = await this.database.userRepo.findByEmail(email);

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
        let user: User = await this.database.userRepo.findByUsername(username);

        //Only send an email if a user was found.
        if(user){
            //Generate them a reset token.
            let rToken: ResetToken = new ResetToken(user);
            await this.database.resetTokenRepo.add(rToken);

            let resetEmail: TextEmail = new TextEmail(user.email,
                'No Mans Blocks Password Reset',
                'Hi, your password reset code is: ' + rToken.code
            );

            await this.emailService.sendEmail(resetEmail);
        }
    }

    
    /**
     * Checks if a username is available for taking.s
     * @param username The username to check for.
     * @returns True if the username is available.
     */
    public async isUsernameAvailable(username: string):Promise<boolean> {
        if(!username){
            throw new Error('No username was passed in.');
        }
        
        return this.database.userRepo.isUsernameAvailable(username);
    }

    /**
     * Check if an email is already in use by a non-deleted
     * user.
     * @param email The email to check.
     * @returns True if the email is being used.
     */
    public async isEmailInUser(email: string): Promise<boolean> {
        if(!email){
            throw new Error('No email was passed in.');
        }

        return this.database.userRepo.isEmailInUse(email);
    }

    /**
     * Search for a user by their username.
     * @param username The username to look for
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    public async findByUsername(username: string, includeDeleted?: boolean):Promise<User> {
        if(!username){
            throw new Error('No username was passed in');
        }

        return this.database.userRepo.findByUsername(username, includeDeleted);
    }

    /**
     * Search for a user by their unique id. This is primarily for
     * API calls.
     * @param id The numeric id of the user to look for.
     * @param includeDeleted If we should include deleted users in the results.
     * @returns The user if found.
     */
    public async findById(id: number, includeDeleted: boolean = false):Promise<User> {
        if(isNaN(id)){
            throw new Error('No user id passed in.');
        }
        
        return this.database.userRepo.findById(id, includeDeleted);
    }

    /**
     * Update an existing user in the database.
     * @param user The user to update
     * @returns True if no errors occured.
     */
    public async update(user: User): Promise<boolean> {
        if(!user || isNaN(user.id)){
            throw new Error('No user passed in, or user has no id.');
        }
        
        let validatorResult: ValidatorResult = this.userUpdateValidator.validate(user);

        if(!validatorResult.isValid){
            throw new ValidationError('Failed to update user.', validatorResult);
        }
        
        return this.database.userRepo.update(user);
    }

    /**
     * Delete a user from the database
     * @param user The user to delete
     * @returns True if no errors occured.
     */
    public async delete(user: User): Promise<boolean> {
        if(!user || isNaN(user.id)){
            throw new Error('No user passed in, or user has no id.');
        }

        let validatorResult: ValidatorResult = this.userDeleteValidator.validate(user);

        if(!validatorResult.isValid){
            throw new ValidationError('Failed to delete user.', validatorResult);
        }

        return this.database.userRepo.delete(user);
    }
}