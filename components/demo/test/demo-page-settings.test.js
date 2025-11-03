import '../demo-page-settings.js';

import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-demo-page-settings', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-demo-page-settings');
		});
	});

	describe('language select', () => {
		it('updates the documentElement language on change', async() => {
			const elem = await fixture(html`<d2l-demo-page-settings></d2l-demo-page-settings>`);
			const select = elem.shadowRoot.querySelector('select');
			select.value = 'ko-kr';
			setTimeout(() => select.dispatchEvent(new Event('change')));
			await oneEvent(select, 'change');
			expect(document.documentElement.lang).to.equal('ko-kr');
			expect(document.documentElement.matches('*:lang(ko)')).to.be.true;
		});
	});

});
