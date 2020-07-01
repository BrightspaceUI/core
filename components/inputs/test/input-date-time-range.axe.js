import '../input-date-time-range.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

describe('d2l-input-date-time-range', () => {

	it('normal', async() => {
		const elem = await fixture(html`<d2l-input-date-time-range label="label text"></d2l-input-date-time-range>`);
		await expect(elem).to.be.accessible({ignoredRules: ['color-contrast']}); // color-contrast takes a while and should be covered by axe tests in the individual components
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-input-date-time-range label="label text" disabled></d2l-input-date-time-range>`);
		await expect(elem).to.be.accessible({ignoredRules: ['color-contrast']}); // color-contrast takes a while and should be covered by axe tests in the individual components
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-date-time-range label="label text"></d2l-input-date-time-range>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible({ignoredRules: ['color-contrast']}); // color-contrast takes a while and should be covered by axe tests in the individual components
	});

});
