"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const configtype_1 = require("../../../config/configtype");
const configtypeutils_1 = require("../../../config/configtypeutils");
/**
 * Test module ConfigTypeUtils
 */
describe('ConfigTypeUtils', () => {
    describe('fromCommandArgument()', () => {
        let configType;
        it('is Production for "prod"', () => {
            configType = configtypeutils_1.ConfigTypeUtils.fromCommandArgument('prod');
            chai_1.expect(configType).to.equal(configtype_1.ConfigType.Production);
        });
        it('is Development for "dev"', () => {
            configType = configtypeutils_1.ConfigTypeUtils.fromCommandArgument('dev');
            chai_1.expect(configType).to.equal(configtype_1.ConfigType.Development);
        });
        it('is Test for "test"', () => {
            configType = configtypeutils_1.ConfigTypeUtils.fromCommandArgument('test');
            chai_1.expect(configType).to.equal(configtype_1.ConfigType.Test);
        });
        it('throws error for bad input', () => {
            chai_1.expect(() => { configtypeutils_1.ConfigTypeUtils.fromCommandArgument('LOLWUT'); }).to.throw();
        });
    });
});
//# sourceMappingURL=configtypeutils.test.js.map