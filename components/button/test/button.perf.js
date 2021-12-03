import '../button.js';
import { expect, html } from '@open-wc/testing';
import { testRenderTime } from 'web-test-runner-performance/browser.js';

describe('d2l-button', () => {

	it('normal', async() => {
		const element = html`<d2l-button>Button</d2l-button>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(1500);
	});

	it('primary', async() => {
		const element = html`<d2l-button primary>Button</d2l-button>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(1500);
	});

	it('disabled', async() => {
		const element = html`<d2l-button disabled>Button</d2l-button>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(1500);
	});
});
