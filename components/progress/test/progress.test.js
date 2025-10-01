import '../progress.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

describe('d2l-progress', () => {
	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-progress');
		});
	});

	describe('values', () => {
		let element, bar;

		beforeEach(async() => {
			element = await fixture(html`<d2l-progress></d2l-progress>`);
			bar = element.shadowRoot.querySelector('progress');
		});

		it('sets default values', () => {
			expect(element.max).to.equal(100);
			expect(element.value).to.equal(0);
		});

		it('changes value attribute of progress element', async() => {
			for (const val of [1, 10, 100]) {
				element.value = val;
				await element.updateComplete;
				expect(bar.getAttribute('value')).to.equal(val.toString());
			}
		});
		it('changes max attribute of progress element', async() => {
			for (const max of [1, 10, 100]) {
				element.max = max;
				await element.updateComplete;
				expect(bar.getAttribute('max')).to.equal(max.toString());
			}
		});
		it('sets aria-valuetext to a percentage regardless of max value', async() => {
			element.value = 1;
			const tests = [
				{ max: 1, expected: '100 %' },
				{ max: 10, expected: '10 %' },
				{ max: 100, expected: '1 %' }
			];
			for (const { max, expected } of tests) {
				element.max = max;
				await element.updateComplete;
				expect(bar.getAttribute('aria-valuetext')).to.equal(expected);
			}
		});

		it('uses the floor value of the percentage', async() => {
			const valueNode = element.shadowRoot.querySelector('.value');
			element.value = 2;
			element.max = 3;
			await element.updateComplete;
			expect(valueNode.textContent).to.equal('66 %');
			expect(bar.getAttribute('aria-valuetext')).to.equal('66 %');
		});
	});

});
