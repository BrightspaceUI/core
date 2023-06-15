import '../button-subtle.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

describe('d2l-button-subtle', () => {

	it('normal', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('normal + disabled', async() => {
		const el = await fixture(html`<d2l-button-subtle disabled text="Disabled Subtle Button"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('normal + disabled + disabled-tooltip', async() => {
		const el = await fixture(html`<d2l-button-subtle disabled disabled-tooltip="tooltip text" text="Disabled Subtle Button"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('normal + focused', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
		setTimeout(() => el.focus());
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
		setTimeout(() => el.focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

	it('description', async() => {
		const el = await fixture(html`<d2l-button-subtle text="primary" description="secondary"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();

		const btnElem = el.shadowRoot.querySelector('button');
		const description = el.shadowRoot.querySelector(`#${btnElem.getAttribute('aria-describedby')}`);
		expect(description.innerText).to.equal('secondary');
	});

});
