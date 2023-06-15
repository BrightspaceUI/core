import { expect } from '@open-wc/testing';
import { isColorAccessible } from '../contrast.js';

describe('colour-contrast', () => {

	describe('accessibility', () => {

		const colours = {
			AAA: ['#0000FF', '#FFFFFF'],
			AA: ['#FFFFFF', '#707070'],
			F: ['#BBBBBB', '#FFFFFF']
		};

		it('Correctly passes/fails HEX colours on normal text for AAA rating', () => {
			[
				{ rating: 'AAA', result: true },
				{ rating: 'AA', result: false },
				{ rating: 'F', result: false }
			].forEach(({ rating, result }) => {
				expect(isColorAccessible(colours[rating][0], colours[rating][1], 7)).to.equal(result);
			});
		});

		it('Correctly passes/fails HEX colours on normal text for AA rating', () => {
			[
				{ rating: 'AAA', result: true },
				{ rating: 'AA', result: true },
				{ rating: 'F', result: false }
			].forEach(({ rating, result }) => {
				expect(isColorAccessible(colours[rating][0], colours[rating][1])).to.equal(result);
			});
		});

		it('Throws error with correct error message when passed invalid HEX colours', () => {
			[
				{ color1: 'nope', color2: '#FFFFFF', invalid: 'color1' },
				{ color1: '#FFFFFF', color2: 'nuh uh', invalid: 'color2' },
				{ color1: 'nope', color2: 'nuh uh', invalid: 'color1' },
			].forEach(config => {
				const { color1, color2, invalid } = config;
				expect(() => isColorAccessible(color1, color2)).to.throw(`Invalid HEX colour: ${config[invalid]}`);
			});
		});

	});

});
