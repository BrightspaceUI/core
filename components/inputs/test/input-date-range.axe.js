import '../input-date-range.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

describe('d2l-input-date-range', () => {
	before(() => {
		const e = window.onerror;
		window.onerror = function(err) {
			if (err === 'ResizeObserver loop limit exceeded') {
				console.warn('Ignored: ResizeObserver loop limit exceeded');
				return false;
			} else {
				return e(...arguments);
			}
		};
	});

	it('normal', async() => {
		const elem = await fixture(html`<d2l-input-date-range label="label text"></d2l-input-date-range>`);
		await expect(elem).to.be.accessible({ ignoredRules: ['color-contrast'] }); // color-contrast takes a while and should be covered by axe tests in the individual components
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-input-date-range label="label text" disabled></d2l-input-date-range>`);
		await expect(elem).to.be.accessible({ ignoredRules: ['color-contrast'] }); // color-contrast takes a while and should be covered by axe tests in the individual components
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-date-range label="label text"></d2l-input-date-range>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible({ ignoredRules: ['color-contrast'] }); // color-contrast takes a while and should be covered by axe tests in the individual components
	});

	it('required', async() => {
		const elem = await fixture(html`<d2l-input-date-range label="label text" required></d2l-input-date-range>`);
		await expect(elem).to.be.accessible({ ignoredRules: ['color-contrast'] }); // color-contrast takes a while and should be covered by axe tests in the individual components
	});

});
