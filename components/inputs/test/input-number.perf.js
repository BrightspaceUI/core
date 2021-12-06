import '../input-number.js';
import '../../button/button-icon.js';
import { html, testRenderTime } from 'web-test-runner-performance/browser.js';
import { expect } from '@open-wc/testing';

describe('d2l-input-number', () => {

	it.only('normal', async() => {
		const element = html`<d2l-input-number label="label" value="18"></d2l-input-number>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(1500);
	});

	it('min-max', async() => {
		const element = html`<d2l-input-number label="label" value="18" min="18" max="100"></d2l-input-number>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(1500);
	});
	it('min-max-exclusive', async() => {
		const element = html`<d2l-input-number label="label" value="5" min="5" max="100" min-exclusive max-exclusive></d2l-input-number>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(1500);
	});
	it('integer-only', async() => {
		const element = html`<d2l-input-number label="label" value="18" max-fraction-digits="0" max="150" min="0"></d2l-input-number>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(1500);
	});
	it('after-slot', async() => {
		const element =
			html`<d2l-input-number label="Help Text">
				<d2l-button-icon icon="tier1:help" text="help" slot="after"></d2l-button-icon>
			</d2l-input-number>`;
		const result = await testRenderTime(element, { iterations: 10000, average: 10 });
		expect(result.duration).to.be.below(10);
	});
});
