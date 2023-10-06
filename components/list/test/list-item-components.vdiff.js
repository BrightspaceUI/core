import '../list-item-drag-handle.js';
import '../list-item-drag-image.js';
import '../list-item-placement-marker.js';
import { expect, fixture, focusElem, html, oneEvent } from '@brightspace-ui/testing';

describe('list-item-drag-handle', () => {
	let elem, handle;
	beforeEach(async() => {
		elem = await fixture(html`<div style="width: 50px;"><d2l-list-item-drag-handle class="vdiff-include"></d2l-list-item-drag-handle></div>`);
		handle = elem.querySelector('d2l-list-item-drag-handle');
	});

	describe('dragger', () => {
		it('simple', async() => {
			await expect(elem).to.be.golden();
		});

		it('focus', async() => {
			await focusElem(handle);
			await expect(elem).to.be.golden();
		});

		it('keyboard-mode', async() => {
			handle._keyboardActive = true;
			await oneEvent(handle, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});

	});
});

describe('list-item-drag-image', () => {
	[
		{ name: '1-digit', count: 1 },
		{ name: '2-digit', count: 10 },
		{ name: '4-digit', count: 1000 },
		{ name: 'rtl', rtl: true, count: 1000 },
	].forEach(({ name, count, rtl }) => {
		it(name, async() => {
			const elem = await fixture(html`<d2l-list-item-drag-image count="${count}" style="inset-inline-start: 20px !important;"></d2l-list-item-drag-image>`, { rtl });
			await expect(elem).to.be.golden();
		});
	});
});

describe('list-item-placement-marker', () => {
	describe('placement-marker', () => {
		// rtl/ltr tests are combined with with broder/no-border to reduce test time and still cover both conditions
		it('ltr and no border', async() => {
			const elem = await fixture(html`<div style="width: 100px;"><d2l-list-item-placement-marker></d2l-list-item-placement-marker></div>`);
			await expect(elem).to.be.golden();
		});
		it('rtl and border', async() => {
			const elem = await fixture(html`<div style="border: dotted; width: 100px;"><d2l-list-item-placement-marker></d2l-list-item-placement-marker></div>`, { rtl: true });
			await expect(elem).to.be.golden();
		});

	});
});
