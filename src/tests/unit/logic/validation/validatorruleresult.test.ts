import { ValidatorRuleResult } from "../../../../logic/validation/validatorruleresult";
import { expect } from 'chai';
import 'mocha';

/**
 * Test module for ValidatorRuleResult
 */
describe('ValidatorRuleResult', () => {
    describe('constructor()', () => {
        it('isValid defaults to false', () => {
            let valRuleResult: ValidatorRuleResult = new ValidatorRuleResult();
            expect(valRuleResult.isValid).to.be.false;
        });

        it('isValid is defined', () => {
            let valRuleResult: ValidatorRuleResult = new ValidatorRuleResult(true);
            expect(valRuleResult.isValid).to.be.true;
        });

        it('assigns a single error message', () => {
            let valRuleResult: ValidatorRuleResult = new ValidatorRuleResult(false, 'foo');
            expect(valRuleResult.error).to.equal('foo');
        });
    });
});