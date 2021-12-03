import '../input-text.js';
import { expect, html } from '@open-wc/testing';
import { testRenderTime } from 'web-test-runner-performance/browser.js';

describe('d2l-input-text', () => {

	it('normal', async() => {
		const element = html`<d2l-input-text label="label"></d2l-input-text>`;
		const result = await testRenderTime(element, { iterations: 100 });
		expect(result.duration).to.be.below(1500);
	});

	it('slots', async() => {
		const element = html`<d2l-input-text label="label">
				<span slot="left">left</span>
				<span slot="right">right</span>
				<span slot="after">after</span>
			</d2l-input-text>`;
		const result = await testRenderTime(element, { iterations: 100 });
		expect(result.duration).to.be.below(1500);
	});

	it('unit', async() => {
		const element = html`<d2l-input-text label="label" unit="%"></d2l-input-text>`;
		const result = await testRenderTime(element, { iterations: 100 });
		expect(result.duration).to.be.below(1500);
	});

});
