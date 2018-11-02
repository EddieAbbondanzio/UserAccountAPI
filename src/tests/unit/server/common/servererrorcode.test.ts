import { expect } from 'chai';
import 'mocha';
import { ServerErrorCode } from '../../../../server/common/servererrorcode';

/**
 * Test module for the ServerErrorCode enum.
 */
describe('ServerErrorCode', () => {
    /**
     * I don't want any errors to have a code of 0
     * since that could imply there's no error.
     */
    it('no error has code 0', () => {
        expect(ServerErrorCode[0]).to.be.undefined;
    });
})