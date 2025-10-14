import '../button-copy.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

describe('d2l-button-copy', () => {

	it('normal', async() => {
		const el = await fixture(html`<d2l-button-copy></d2l-button-copy>`);
		await expect(el).to.be.accessible();
	});

	it('disabled', async() => {
		const el = await fixture(html`<d2l-button-copy disabled></d2l-button-copy>`);
		await expect(el).to.be.accessible();
	});

	it('focused', async() => {
		const el = await fixture(html`<d2l-button-copy></d2l-button-copy>`);
		setTimeout(() => el.focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

});
