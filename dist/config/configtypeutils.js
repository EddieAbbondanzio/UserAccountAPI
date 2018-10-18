"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const configtype_1 = require("./configtype");
/**
 * Helper utility methods related to the ConfigType enum.
 */
var ConfigTypeUtils;
(function (ConfigTypeUtils) {
    /**
     * Convert a command line argument into the type of
     * config type to use.
     * @param arg The passed in command line argument.
     * @returns The matching config type.
     */
    function fromCommandArgument(arg) {
        switch (arg) {
            case 'prod':
                return configtype_1.ConfigType.Production;
            case 'dev':
                return configtype_1.ConfigType.Development;
            case 'test':
                return configtype_1.ConfigType.Test;
            default:
                throw new Error('Invalid config type of: ' + arg);
        }
    }
    ConfigTypeUtils.fromCommandArgument = fromCommandArgument;
})(ConfigTypeUtils = exports.ConfigTypeUtils || (exports.ConfigTypeUtils = {}));
//# sourceMappingURL=configtypeutils.js.map