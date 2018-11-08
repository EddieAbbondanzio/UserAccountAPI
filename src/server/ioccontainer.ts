import 'reflect-metadata';
import { Container, interfaces } from "inversify";
import { Config } from "../config/config";
import { Database } from "../logic/common/database";
import { IOC_TYPES } from "../common/ioc/ioctypes";
import { MySqlDatabase } from "../data/mysqldatabase";
import { IEmailSender } from "../logic/email/iemailsender";
import { ZohoEmailService } from "../logic/email/zohoemailsender";
import { IAccountService } from "../logic/contract/services/iaccountservice";
import { AccountService } from "../logic/services/accountservice";
import { IAuthService } from "../logic/contract/services/iauthservice";
import { AuthService } from "../logic/services/authservice";
import { IAccessTokenService } from "../logic/contract/services/iaccesstokenservice";
import { AccessTokenService } from "../logic/services/tokenservice";
import { IAccountHandler } from "./contract/iaccounthandler";
import { AccountHandler } from "./handlers/account/accounthandler";
import { IAuthHandler } from "./contract/iauthhandler";
import { AuthHandler } from "./handlers/auth/authhandler";
import { IUserHandler } from "./contract/iuserhandler";
import { UserHandler } from "./handlers/user/userhandler";
import { Server } from './server';
import { IUserService } from '../logic/contract/services/iuserservice';
import { UserService } from '../logic/services/userservice';

/**
 * Inversion of Control container to work within.
 */
export class IocContainer {
    /**
     * The singleton instance.
     */
    public static instance: IocContainer;

    /**
     * The underlying inversifyJS container.
     */
    private container: Container;

    /**
     * The server config.
     */
    private config: Config;

    /**
     * Create a new Inversion of Control container.
     * @param config The configuration to run with.
     */
    constructor(config: Config) {
        if(IocContainer.instance != null){
            throw new Error('IoC Container has already been defined.');
        }
        else {
            IocContainer.instance = this;
        }

        this.config = config;
        this.container = new Container();

        //Bind the dependencies
        this.container.bind<Config>(IOC_TYPES.Config).toConstantValue(config);
        this.container.bind<Database>(IOC_TYPES.Database).to(MySqlDatabase).inSingletonScope();
        this.container.bind<IEmailSender>(IOC_TYPES.EmailSender).to(ZohoEmailService);

        //Bind the services
        this.container.bind<IAccountService>(IOC_TYPES.AccountService).to(AccountService);
        this.container.bind<IAuthService>(IOC_TYPES.AuthService).to(AuthService);
        this.container.bind<IAccessTokenService>(IOC_TYPES.TokenService).to(AccessTokenService);
        this.container.bind<IUserService>(IOC_TYPES.UserService).to(UserService);

        //Bind the server routers
        this.container.bind<IAccountHandler>(IOC_TYPES.AccountHandler).to(AccountHandler);
        this.container.bind<IAuthHandler>(IOC_TYPES.AuthHandler).to(AuthHandler);
        this.container.bind<IUserHandler>(IOC_TYPES.UserHandler).to(UserHandler);

        this.container.bind<Server>(IOC_TYPES.Server).to(Server);
    }

    /**
     * Resolve a dependency from the IOC container.
     * @param serviceIdentifier The identifier of the dependency to resolve.
     * @returns The dependency.
     */
    public get<T>(serviceIdentifier: string | symbol | interfaces.Newable<T> | interfaces.Abstract<T>) {
        return this.container.get<T>(serviceIdentifier);
    }
}