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
const server_1 = require("./server/server");
const datacontext_1 = require("./data/datacontext");
const servicelocator_1 = require("./logic/servicelocator");
const datamodule_1 = require("./data/datamodule");
const registrationhandler_1 = require("./logic/authentication/handlers/registrationhandler");
/**
 * Initialize the application for use. This first starts
 * up the data layer, then turns on the logic layer,
 * and lastly bring the server online.
 */
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //Get the data connection ready to roll.
            const connection = yield datacontext_1.DataContext.initializeDatabaseAsync();
            // Set up the logic layer for use.
            const serviceLocator = new servicelocator_1.ServiceLocator(connection);
            //Spin up the server. This takes and handles the 
            //HTTP Requests clients make.
            const server = new server_1.Server(serviceLocator);
            let userReg = new datamodule_1.UserRegistration();
            userReg.email = 'eddieabb95@gmail.com';
            userReg.name = 'Eddie Abbondanzio';
            userReg.password = 'testpassword';
            userReg.username = 'EddieAbb95';
            let regHandler = new registrationhandler_1.RegistrationHandler(connection, serviceLocator);
            let user = yield regHandler.registerNewUser(userReg);
            console.log(user);
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
