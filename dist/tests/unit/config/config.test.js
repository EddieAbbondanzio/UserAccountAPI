"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const config_1 = require("../../../config/config");
/**
 * Test module for Config.
 */
describe('config', () => {
    describe('constructor()', () => {
        let config = new config_1.Config();
        it('assigns Config.current', () => {
            chai_1.expect(config_1.Config.current).to.equal(config);
        });
        it('throws an error if a config alread exists', () => {
            chai_1.expect(() => { new config_1.Config(); }).to.throw();
        });
    });
});
//# sourceMappingURL=config.test.js.map