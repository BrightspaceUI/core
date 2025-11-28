import '../button-move.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

describe('d2l-button-move', () => {

	it('normal', async() => {
		const el = await fixture(html`<d2l-button-move text="Reorder Item"></d2l-button-move>`);
		await expect(el).to.be.accessible();
	});

	it('disabled', async() => {
		const el = await fixture(html`<d2l-button-move text="Reorder Item" disabled-up disabled-down disabled-left disabled-right disabled-home disabled-end></d2l-button-move>`);
		await expect(el).to.be.accessible();
	});

	it('focused', async() => {
		const el = await fixture(html`<d2l-button-move text="Reorder Item"></d2l-button-move>`);
		setTimeout(() => el.focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

	it('description', async() => {
		const el = await fixture(html`<d2l-button-move text="Reorder Item" description="secondary"></d2l-button-move>`);
		await expect(el).to.be.accessible();

		const btnElem = el.shadowRoot.querySelector('button');
		const description = el.shadowRoot.querySelector(`#${btnElem.getAttribute('aria-describedby')}`);
		expect(description.innerText).to.equal('secondary');
	});

	it('partially disabled (up)', async() => {
		const el = await fixture(html`<d2l-button-move text="Reorder Item" disabled-up></d2l-button-move>`);
		await expect(el).to.be.accessible();
	});

	it('partially disabled (down)', async() => {
		const el = await fixture(html`<d2l-button-move text="Reorder Item" disabled-down></d2l-button-move>`);
		await expect(el).to.be.accessible();
	});

	it('partially disabled (left)', async() => {
		const el = await fixture(html`<d2l-button-move text="Reorder Item" disabled-left></d2l-button-move>`);
		await expect(el).to.be.accessible();
	});

	it('partially disabled (right)', async() => {
		const el = await fixture(html`<d2l-button-move text="Reorder Item" disabled-right></d2l-button-move>`);
		await expect(el).to.be.accessible();
	});

	it('autofocus', async() => {
		const el = await fixture(html`<d2l-button-move text="Reorder Item" autofocus></d2l-button-move>`);
		await expect(el).to.be.accessible();
	});

	it('dark theme', async() => {
		const el = await fixture(html`<d2l-button-move text="Reorder Item" theme="dark"></d2l-button-move>`);
		await expect(el).to.be.accessible();
	});

});
