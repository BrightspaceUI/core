import '../icon.js';
import { expect, html } from '@open-wc/testing';
import { testRenderTime } from 'web-test-runner-performance/browser.js';

describe('d2l-button', () => {

	it('normal', async() => {
		const element = html`<d2l-icon icon="d2l-tier3:assignments"></d2l-icon>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(50);
	});

});
