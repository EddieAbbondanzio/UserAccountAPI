"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validatorruleresult_1 = require("../../../../logic/validation/validatorruleresult");
const chai_1 = require("chai");
require("mocha");
/**
 * Test module for ValidatorRuleResult
 */
describe('ValidatorRuleResult', () => {
    describe('constructor()', () => {
        it('isValid defaults to false', () => {
            let valRuleResult = new validatorruleresult_1.ValidatorRuleResult();
            chai_1.expect(valRuleResult.isValid).to.be.false;
        });
        it('isValid is defined', () => {
            let valRuleResult = new validatorruleresult_1.ValidatorRuleResult(true);
            chai_1.expect(valRuleResult.isValid).to.be.true;
        });
        it('assigns a single error message', () => {
            let valRuleResult = new validatorruleresult_1.ValidatorRuleResult(false, 'foo');
            chai_1.expect(valRuleResult.error).to.equal('foo');
        });
    });
});
//# sourceMappingURL=validatorruleresult.test.js.map