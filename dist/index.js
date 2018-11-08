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
const ioccontainer_1 = require("./server/ioccontainer");
const confighandler_1 = require("./config/confighandler");
const configtype_1 = require("./config/configtype");
const configtypeutils_1 = require("./config/configtypeutils");
const Minimist = require("minimist");
const ioctypes_1 = require("./common/ioc/ioctypes");
/**
 * Initialize the application for use. This first starts
 * up the data layer, then turns on the logic layer,
 * and lastly bring the server online.
 */
function initialize() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Starting Server');
            //Get the command line arguments
            var parseArgs = Minimist(process.argv);
            //Load in the config to use.
            let configType = configtypeutils_1.ConfigTypeUtils.fromCommandArgument(parseArgs.e);
            let config = yield confighandler_1.ConfigHandler.loadConfig(configType);
            console.log('Mode: ', configtype_1.ConfigType[configType]);
            //Get the IOC container running.
            let container = new ioccontainer_1.IocContainer(config);
            //Get the database up
            let database = container.get(ioctypes_1.IOC_TYPES.Database);
            yield database.initialize(config.database);
            //Fire up the server.
            let server = container.get(ioctypes_1.IOC_TYPES.Server);
            console.log('Ready...');
        }
        catch (error) {
            console.error('Failed to init app.');
            console.error(error);
        }
    });
}
initialize();
//# sourceMappingURL=index.js.map