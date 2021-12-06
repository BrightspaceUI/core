import '../link.js';
import { expect, html } from '@open-wc/testing';
import { testRenderTime } from 'web-test-runner-performance/browser.js';

describe('d2l-link', () => {

	it('normal', async() => {
		const element = html`<d2l-button>Button</d2l-button>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(1500);
	});

});
