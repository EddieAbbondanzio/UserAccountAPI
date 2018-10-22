"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const confighandler_1 = require("./config/confighandler");
const configtypeutils_1 = require("./config/configtypeutils");
const Minimist = require("minimist");
const mysqldatabase_1 = require("./data/mysqldatabase");
const userservice_1 = require("./logic/services/userservice");
const servicelocator_1 = require("./logic/common/servicelocator");
const authservice_1 = require("./logic/services/authservice");
const zohoemailsender_1 = require("./logic/email/zohoemailsender");
const tokenmanager_1 = require("./logic/helpers/tokenmanager");
/**
 * Initialize the application for use. This first starts
 * up the data layer, then turns on the logic layer,
 * and lastly bring the server online.
 */
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Get the command line arguments
            var parseArgs = Minimist(process.argv);
            //Load in the config to run with
            let configType = configtypeutils_1.ConfigTypeUtils.fromCommandArgument(parseArgs.e);
            let config = yield confighandler_1.ConfigHandler.loadConfig(configType);
            //Get the database up
            let database = new mysqldatabase_1.MySqlDatabase();
            yield database.initialize(config.database);
            //Set up the BLL.
            let emailSender = new zohoemailsender_1.ZohoEmailService(config.emailCredentials);
            let tokenManager = new tokenmanager_1.TokenManager(config.tokenSignature);
            servicelocator_1.ServiceLocator.register(new authservice_1.AuthService(database, tokenManager, emailSender));
            servicelocator_1.ServiceLocator.register(new userservice_1.UserService(database));
            // //Set up the data layer
            // AppDomain.dataAccessLayer = new MysqlDataAccessLayer();
            // await AppDomain.dataAccessLayer.initialize();
            //Get the data connection ready to roll.
            // const connection = await DataContext.initializeDatabaseAsync();
            // // Set up the logic layer for use.
            // const serviceLocator = new ServiceLocator();
            // //Spin up the server. This takes and handles the 
            // //HTTP Requests clients make.
            // const server = new Server(serviceLocator);
            // let userReg = new UserRegistration('testuser', 'password', 'Test User', 'me@eddieabbondanz.io');
            // let regHandler = new RegistrationHandler(connection, serviceLocator);
            // await regHandler.registerNewUser(userReg);
            //What method to run as?
            // let dataAccessLayer: DataAccessLayer = new DataAccessLayer();
            // let loginRepo: IUserLoginRepository = dataAccessLayer.get<IUserLoginRepository>('IUserLoginRepository');
            // console.log(loginRepo);
            // console.log('Config: ', config); 
            console.log('Server ready...');
        }
        catch (error) {
            console.error('Failed to init app.');
            console.error(error);
        }
    });
}
initialize();
//# sourceMappingURL=index.js.map