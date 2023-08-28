import { expect } from '@brightspace-ui/testing';
import { getValidHexColor } from '../color.js';

describe('color', () => {

	it('should return color as expected when valid 6 character hex color and canHaveAlpha is false', async() => {
		expect(getValidHexColor('#fF0a9b')).to.equal('#FF0A9B');
	});

	it('should return color as expected when valid 6 character hex color and canHaveAlpha is true', async() => {
		expect(getValidHexColor('#fF0a9b', true)).to.equal('#FF0A9B');
	});

	it('should throw when 7 character hex color and canHaveAlpha is false', async() => {
		expect(() => getValidHexColor('fF0a9ba')).to.throw('Invalid HEX color value "fF0a9ba". Expecting a 6 character HEX color.');
	});

	it('should throw when 7 character hex color when canHaveAlpha is true', async() => {
		expect(() => getValidHexColor('fF0a9ba', true)).to.throw('Invalid HEX color value "fF0a9ba". Expecting a 6 or 8 character HEX color.');
	});

	it('should throw when 8 character hex color and canHaveAlpha is false', async() => {
		expect(() => getValidHexColor('fF0a9bab')).to.throw('Invalid HEX color value "fF0a9bab". Expecting a 6 character HEX color.');
	});

	it('should return color as expected when valid 8 character hex color when canHaveAlpha is true', async() => {
		expect(getValidHexColor('#fF0a9bab', true)).to.equal('#FF0A9BAB');
	});

	it('should throw if invalid HEX value is set and canHaveAlpha is false', async() => {
		expect(() => getValidHexColor('notHex')).to.throw('Invalid HEX color value "notHex". Expecting a 6 character HEX color.');
	});

	it('should throw if invalid HEX value is set and canHaveAlpha is true', async() => {
		expect(() => getValidHexColor('notHex', true)).to.throw('Invalid HEX color value "notHex". Expecting a 6 or 8 character HEX color.');
	});

	it('should return undefined if value is undefined', async() => {
		expect(getValidHexColor(undefined, true)).to.equal(undefined);
	});

});
