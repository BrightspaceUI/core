import '../button.js';
import { html, testRenderTime } from 'web-test-runner-performance/browser.js';
import { expect } from '@open-wc/testing';

describe('d2l-button', () => {

	it('normal', async() => {
		const element = html`<d2l-button>Button</d2l-button>`;
		const result = await testRenderTime(element, { iterations: 1 });
		expect(result.duration).to.be.below(1500);
	});

	it('primary', async() => {
		const element = html`<d2l-button primary>Button</d2l-button>`;
		const result = await testRenderTime(element, { iterations: 1 });
		expect(result.duration).to.be.below(1500);
	});

	it('disabled', async() => {
		const element = html`<d2l-button disabled>Button</d2l-button>`;
		const result = await testRenderTime(element, { iterations: 1 });
		expect(result.duration).to.be.below(1500);
	});
});
