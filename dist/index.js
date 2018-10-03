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
