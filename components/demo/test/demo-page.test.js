import '../demo-page.js';

import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-demo-page', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-demo-page');
		});
	});

	describe('language select', () => {
		it('updates the documentElement language on change', async() => {
			const elem = await fixture(html`<d2l-demo-page></d2l-demo-page>`);
			const select = elem.shadowRoot.querySelector('select');
			select.value = 'ko-kr';
			setTimeout(() => select.dispatchEvent(new Event('change')));
			await oneEvent(select, 'change');
			expect(document.documentElement.lang).to.equal('ko-kr');
			expect(document.documentElement.matches('*:lang(ko)')).to.be.true;
		});

	});

	it('should set isD2LDemoPage', () => {
		expect(window.isD2LDemoPage).to.be.true;
	});

});
