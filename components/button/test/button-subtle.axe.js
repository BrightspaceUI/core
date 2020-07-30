import '../button-subtle.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

describe('d2l-button-subtle', () => {

	it('normal', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('normal + disabled', async() => {
		const el = await fixture(html`<d2l-button-subtle disabled text="Disabled Subtle Button"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('normal + focused', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
		setTimeout(() => el.shadowRoot.querySelector('button').focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

	it('icon', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button with Icon" icon="tier1:gear"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('icon + disabled', async() => {
		const el = await fixture(html`<d2l-button-subtle disabled text="Subtle Button with Icon" icon="tier1:gear"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('icon + focused', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button with Icon" icon="tier1:gear"></d2l-button-subtle>`);
		setTimeout(() => el.shadowRoot.querySelector('button').focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

});
