"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const servererrorcode_1 = require("../../../../server/common/servererrorcode");
/**
 * Test module for the ServerErrorCode enum.
 */
describe('ServerErrorCode', () => {
    /**
     * I don't want any errors to have a code of 0
     * since that could imply there's no error.
     */
    it('no error has code 0', () => {
        chai_1.expect(servererrorcode_1.ServerErrorCode[0]).to.be.undefined;
    });
});
//# sourceMappingURL=servererrorcode.test.js.map