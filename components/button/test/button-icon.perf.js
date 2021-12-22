import '../button-icon.js';
import { html, testRenderTime } from 'web-test-runner-performance/browser.js';
import { expect } from '@open-wc/testing';

describe('d2l-button-icon', () => {

	it('normal', async() => {
		const element = html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>`;
		const result = await testRenderTime(element, { iterations: 1000 });
		expect(result.duration).to.be.below(2500);
	});

});
