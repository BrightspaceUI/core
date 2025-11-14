import { aTimeout, expect, fixture, html, runConstructor, waitUntil } from '@brightspace-ui/testing';
import { liveRegionDebounceTime } from '../progress.js';

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

	describe('live region', () => {
		let element;

		beforeEach(async() => {
			element = await fixture(html`<d2l-progress live-region label="Progressing"></d2l-progress>`);
		});

		it('updates live region when value changes with a delay', async() => {
			element.value = 20;
			await element.updateComplete;
			expect(element._ariaPercentageText).to.equal('0 %');
			await aTimeout(liveRegionDebounceTime);
			await element.updateComplete;
			expect(element._ariaPercentageText).to.equal('20 %');
		});

		it('updates live region only once with multiple updates', async() => {
			for (let i = 1; i <= 5; i++) {
				setTimeout(() => {
					element.value = i * 10;
				}, i * 100);
			}
			await aTimeout(500);
			expect(element._ariaPercentageText).to.equal('0 %');
			await waitUntil(() => element._ariaPercentageText !== '0 %', 'live region did not update', { timeout: 2 * liveRegionDebounceTime });
			expect(element._ariaPercentageText).to.equal('50 %');
		});

		it('updates live region immediately when complete', async() => {
			element.value = 100;
			await element.updateComplete;
			expect(element._ariaPercentageText).to.equal('100 %');
		});
	});
});
