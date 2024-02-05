import '../input-time-range.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { inlineHelpFixtures } from './input-shared-content.js';

describe('d2l-input-time-range', () => {

	it('normal', async() => {
		const elem = await fixture(html`<d2l-input-time-range label="label text"></d2l-input-time-range>`);
		await expect(elem).to.be.accessible({ ignoredRules: ['color-contrast'] }); // color-contrast takes a while and should be covered by axe tests in the individual components
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-input-time-range label="label text" disabled></d2l-input-time-range>`);
		await expect(elem).to.be.accessible({ ignoredRules: ['color-contrast'] }); // color-contrast takes a while and should be covered by axe tests in the individual components
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-time-range label="label text"></d2l-input-time-range>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible({ ignoredRules: ['color-contrast'] }); // color-contrast takes a while and should be covered by axe tests in the individual components
	});

	it('required', async() => {
		const elem = await fixture(html`<d2l-input-time-range label="label text" required></d2l-input-time-range>`);
		await expect(elem).to.be.accessible({ ignoredRules: ['color-contrast'] }); // color-contrast takes a while and should be covered by axe tests in the individual components
	});

	it('inline-help', async() => {
		const elem = await fixture(new inlineHelpFixtures().timeRange());
		await expect(elem).to.be.accessible({ ignoredRules: ['color-contrast'] }); // color-contrast takes a while and should be covered by axe tests in the individual components
	});

});
