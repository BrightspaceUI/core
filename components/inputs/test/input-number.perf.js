import '../input-number.js';
import '../../button/button-icon.js';
import { html, testRenderTime } from 'web-test-runner-performance/browser.js';
import { expect } from '@open-wc/testing';

describe('d2l-input-number', () => {

	it('normal', async() => {
		const element = html`<d2l-input-number label="label" value="18"></d2l-input-number>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(2000);
	});

	it('min-max', async() => {
		const element = html`<d2l-input-number label="label" value="18" min="18" max="100"></d2l-input-number>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(2500);
	});
	// Disabled due to timeouts
	it.skip('min-max-exclusive', async() => {
		const element = html`<d2l-input-number label="label" value="5" min="5" max="100" min-exclusive max-exclusive></d2l-input-number>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(7500);
	});
	it('integer-only', async() => {
		const element = html`<d2l-input-number label="label" value="18" max-fraction-digits="0" max="150" min="0"></d2l-input-number>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(2000);
	});
	it('after-slot', async() => {
		const element =
			html`<d2l-input-number label="Help Text">
				<span slot="after">Some text</span>
			</d2l-input-number>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(2000);
	});
});
