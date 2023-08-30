import { expect } from '@brightspace-ui/testing';
import { getValidHexColor } from '../color.js';

const hexVals = {
	3: '#abc',
	4: '#00ff',
	6: '#eeff00',
	7: '#ef02300',
	8: '#abcdef12',
	10: '#abcdef12ab',
	'notHex': 'notHex'
};

describe('color', () => {

	[
		{ numChars: 3, canHaveAlpha: false, shouldThrow: false },
		{ numChars: 3, canHaveAlpha: true, shouldThrow: false },
		{ numChars: 4, canHaveAlpha: false, shouldThrow: true, errorMsg: '3 or 6' },
		{ numChars: 4, canHaveAlpha: true, shouldThrow: false },
		{ numChars: 6, canHaveAlpha: false, shouldThrow: false },
		{ numChars: 6, canHaveAlpha: true, shouldThrow: false },
		{ numChars: 7, canHaveAlpha: false, shouldThrow: true, errorMsg: '3 or 6' },
		{ numChars: 7, canHaveAlpha: true, shouldThrow: true, errorMsg: '3, 4, 6, or 8' },
		{ numChars: 8, canHaveAlpha: false, shouldThrow: true, errorMsg: '3 or 6' },
		{ numChars: 8, canHaveAlpha: true, shouldThrow: false },
		{ numChars: 10, canHaveAlpha: false, shouldThrow: true, errorMsg: '3 or 6' },
		{ numChars: 10, canHaveAlpha: true, shouldThrow: true, errorMsg: '3, 4, 6, or 8' },
		{ numChars: 'notHex', canHaveAlpha: false, shouldThrow: true, errorMsg: '3 or 6' },
		{ numChars: 'notHex', canHaveAlpha: true, shouldThrow: true, errorMsg: '3, 4, 6, or 8' },
	].forEach((testCase) => {

		it.only(`should behave as expected with ${testCase.numChars} character hex code and canHaveAlpha is ${testCase.canHaveAlpha}`, async() => {
			const testVal = hexVals[testCase.numChars];
			if (testCase.shouldThrow) {
				expect(() => getValidHexColor(testVal, testCase.canHaveAlpha)).to.throw(`Invalid HEX color value "${testVal}". Expecting a ${testCase.errorMsg} character HEX color.`);
			} else {
				expect(getValidHexColor(testVal, testCase.canHaveAlpha)).to.equal(testVal.toUpperCase());
			}
		});

	});

});
