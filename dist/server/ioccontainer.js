"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const ioctypes_1 = require("../common/ioc/ioctypes");
const mysqldatabase_1 = require("../data/mysqldatabase");
const zohoemailsender_1 = require("../logic/email/zohoemailsender");
const accountservice_1 = require("../logic/services/accountservice");
const authservice_1 = require("../logic/services/authservice");
const tokenservice_1 = require("../logic/services/tokenservice");
const accounthandler_1 = require("./handlers/account/accounthandler");
const authhandler_1 = require("./handlers/auth/authhandler");
const userhandler_1 = require("./handlers/user/userhandler");
const server_1 = require("./server");
const userservice_1 = require("../logic/services/userservice");
/**
 * Inversion of Control container to work within.
 */
class IocContainer {
    /**
     * Create a new Inversion of Control container.
     * @param config The configuration to run with.
     */
    constructor(config) {
        if (IocContainer.instance != null) {
            throw new Error('IoC Container has already been defined.');
        }
        else {
            IocContainer.instance = this;
        }
        this.config = config;
        this.container = new inversify_1.Container();
        //Bind the dependencies
        this.container.bind(ioctypes_1.IOC_TYPES.Config).toConstantValue(config);
        this.container.bind(ioctypes_1.IOC_TYPES.Database).to(mysqldatabase_1.MySqlDatabase).inSingletonScope();
        this.container.bind(ioctypes_1.IOC_TYPES.EmailSender).to(zohoemailsender_1.ZohoEmailService);
        //Bind the services
        this.container.bind(ioctypes_1.IOC_TYPES.AccountService).to(accountservice_1.AccountService);
        this.container.bind(ioctypes_1.IOC_TYPES.AuthService).to(authservice_1.AuthService);
        this.container.bind(ioctypes_1.IOC_TYPES.TokenService).to(tokenservice_1.AccessTokenService);
        this.container.bind(ioctypes_1.IOC_TYPES.UserService).to(userservice_1.UserService);
        //Bind the server routers
        this.container.bind(ioctypes_1.IOC_TYPES.AccountHandler).to(accounthandler_1.AccountHandler);
        this.container.bind(ioctypes_1.IOC_TYPES.AuthHandler).to(authhandler_1.AuthHandler);
        this.container.bind(ioctypes_1.IOC_TYPES.UserHandler).to(userhandler_1.UserHandler);
        this.container.bind(ioctypes_1.IOC_TYPES.Server).to(server_1.Server);
    }
    /**
     * Resolve a dependency from the IOC container.
     * @param serviceIdentifier The identifier of the dependency to resolve.
     * @returns The dependency.
     */
    get(serviceIdentifier) {
        return this.container.get(serviceIdentifier);
    }
}
exports.IocContainer = IocContainer;
//# sourceMappingURL=ioccontainer.js.map