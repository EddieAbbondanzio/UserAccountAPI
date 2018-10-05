"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logiccomponent_1 = require("../common/logiccomponent");
const registrationhandler_1 = require("./handlers/registrationhandler");
const loginhandler_1 = require("./handlers/loginhandler");
const passwordhandler_1 = require("./handlers/passwordhandler");
const validationhandler_1 = require("./handlers/validationhandler");
/**
 * The business logic component managing
 * all things authentication related.
 */
class AuthenticationComponent extends logiccomponent_1.LogicComponent {
    /**
     * Create a new authentication module.
     * @param connection The database connection.
     * @param serviceLocator The service locator.
     */
    constructor(connection, serviceLocator) {
        super(connection, serviceLocator);
        this.registrationHandler = new registrationhandler_1.RegistrationHandler(connection, serviceLocator);
        this.loginHandler = new loginhandler_1.LoginHandler(connection, serviceLocator);
        this.passwordHandler = new passwordhandler_1.PasswordHandler(connection, serviceLocator);
        this.validationHandler = new validationhandler_1.ValidationHander(connection, serviceLocator);
    }
}
exports.AuthenticationComponent = AuthenticationComponent;

//# sourceMappingURL=authenticationcomponent.js.map
