import '../icon.js';
import { html, testRenderTime } from 'web-test-runner-performance/browser.js';
import { expect } from '@open-wc/testing';

describe('d2l-icon', () => {

	it('normal', async() => {
		const element = html`<d2l-icon icon="d2l-tier3:assignments"></d2l-icon>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(1000);
	});

});
