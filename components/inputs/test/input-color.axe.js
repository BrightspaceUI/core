import '../input-color.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { inlineHelpFixtures } from './input-shared-content.js';

describe('d2l-input-color', () => {
	it('normal', async() => {
		const elem = await fixture(html`<d2l-input-color type="background"></d2l-input-color>`);
		await expect(elem).to.be.accessible();
	});

	it('hidden label', async() => {
		const elem = await fixture(html`<d2l-input-color type="background" label-hidden></d2l-input-color>`);
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-input-color type="background" disabled></d2l-input-color>`);
		await expect(elem).to.be.accessible();
	});

	it('readonly', async() => {
		const elem = await fixture(html`<d2l-input-color type="background" readonly></d2l-input-color>`);
		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-color type="background"></d2l-input-color>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

	it('inline-help', async() => {
		const elem = await fixture(new inlineHelpFixtures().color());
		await expect(elem).to.be.accessible();
	});
});
