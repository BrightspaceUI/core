import '../count-badge.js';
import { html, testRenderTime } from 'web-test-runner-performance/browser.js';
import { expect } from '@open-wc/testing';

describe('d2l-count-badge', () => {

	describe('count', () => {
		it('normal', async() => {
			const element = html`<d2l-count-badge text="Test" type="count" number="444"></d2l-count-badge>`;
			const result = await testRenderTime(element, { iterations: 1000 });
			expect(result.duration).to.be.below(1000);
		});
		it('large', async() => {
			const element = html`<d2l-count-badge size="large" text="Test" type="count" number="444"></d2l-count-badge>`;
			const result = await testRenderTime(element, { iterations: 1000 });
			expect(result.duration).to.be.below(1000);
		});
		it('max-digits', async() => {
			const element = html`<d2l-count-badge text="Test" type="count" number="44444" max-digits="3"></d2l-count-badge>`;
			const result = await testRenderTime(element, { iterations: 1000 });
			expect(result.duration).to.be.below(1000);
		});
	});
	describe('notification', () => {
		it('normal', async() => {
			const element = html`<d2l-count-badge text="10 new notifications."  type="notification" number="10"></d2l-count-badge>`;
			const result = await testRenderTime(element, { iterations: 1000 });
			expect(result.duration).to.be.below(1000);
		});
		it('large', async() => {
			const element = html`<d2l-count-badge text="10 new notifications."  type="notification" number="10" size="large"></d2l-count-badge>`;
			const result = await testRenderTime(element, { iterations: 1000 });
			expect(result.duration).to.be.below(1000);
		});
		it('max-digits', async() => {
			const element = html`<d2l-count-badge text="Test" number="44444" max-digits="3"></d2l-count-badge>`;
			const result = await testRenderTime(element, { iterations: 1000 });
			expect(result.duration).to.be.below(1000);
		});
	});
});
