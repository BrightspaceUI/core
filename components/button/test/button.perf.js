import '../button.js';
import { html, testRenderTime } from 'web-test-runner-performance/browser.js';
import { expect } from '@open-wc/testing';

describe('d2l-button', () => {

	it('normal', async() => {
		const element = html`<d2l-button>Button</d2l-button>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(2500);
	});

});
