import '../list-item-nav.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-list-item-nav', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-list-item-nav');
		});
	});

	describe('basic functionality', () => {
		it('should accept href attribute', async() => {
			const elem = await fixture(html`<d2l-list-item-nav action-href="/test">Nav Item</d2l-list-item-nav>`);
			await elem.updateComplete;
			expect(elem.shadowRoot.querySelector('a').getAttribute('href')).to.equal('/test');
		});
	});

});
