import { LogicComponent } from "../common/logiccomponent";
import { RegistrationHandler } from "./handlers/registrationhandler";
import { Connection } from "typeorm";
import { IServiceLocator } from "../common/iservicelocator";
import { LoginHandler } from "./handlers/loginhandler";
import { PasswordHandler } from "./handlers/passwordhandler";
import { ValidationHander } from "./handlers/validationhandler";

/**
 * The business logic component managing
 * all things authentication related.
 */
export class AuthenticationComponent extends LogicComponent {
    /**
     * The logic for registering new users with
     *  the system.
     */
    public registrationHandler: RegistrationHandler;

    /**
     * The logic for loginning in existing users.
     */
    public loginHandler: LoginHandler;

    /**
     * The logic for updatting / resetting passwords.
     */
    public passwordHandler: PasswordHandler;

    /**
     * The user identity validator.
     */
    public validationHandler: ValidationHander;

    /**
     * Create a new authentication module.
     * @param connection The database connection.
     * @param serviceLocator The service locator.
     */
    constructor(connection: Connection, serviceLocator: IServiceLocator){
        super(connection, serviceLocator);

        this.registrationHandler = new RegistrationHandler(connection, serviceLocator);
        this.loginHandler        = new LoginHandler(connection, serviceLocator);
        this.passwordHandler     = new PasswordHandler(connection, serviceLocator);
        this.validationHandler   = new ValidationHander(connection, serviceLocator);
    }
}