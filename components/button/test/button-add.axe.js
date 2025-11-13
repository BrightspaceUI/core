import '../button-add.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

describe('d2l-button-add', () => {

	it('default', async() => {
		const el = await fixture(html`<d2l-button-add></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('text', async() => {
		const el = await fixture(html`<d2l-button-add text="Custom Text"></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('icon-and-text mode', async() => {
		const el = await fixture(html`<d2l-button-add mode="icon-and-text"></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('icon-when-interacted mode', async() => {
		const el = await fixture(html`<d2l-button-add mode="icon-when-interacted"></d2l-button-add>`);
		await expect(el).to.be.accessible();
	});

	it('focused', async() => {
		const el = await fixture(html`<d2l-button-add></d2l-button-add>`);
		await focusElem(el);
		await expect(el).to.be.accessible();
	});

	it('focused, icon-and-text mode', async() => {
		const el = await fixture(html`<d2l-button-add mode="icon-and-text"></d2l-button-add>`);
		await focusElem(el);
		await expect(el).to.be.accessible();
	});

	it('focused, icon-when-interacted mode', async() => {
		const el = await fixture(html`<d2l-button-add mode="icon-when-interacted"></d2l-button-add>`);
		await focusElem(el);
		await expect(el).to.be.accessible();
	});

	describe('tooltip', () => {

		it('should have tooltip for attribute matching button id in icon mode', async() => {
			const el = await fixture(html`<d2l-button-add text="Add New Item"></d2l-button-add>`);
			const button = el.shadowRoot.querySelector('button');
			const tooltip = el.shadowRoot.querySelector('d2l-tooltip');
			expect(tooltip).to.exist;
			expect(tooltip.getAttribute('for-type')).to.equal('label');
			expect(button.id).to.equal(tooltip.getAttribute('for'));
		});

		it('should have tooltip for attribute matching button id in icon-when-interacted mode', async() => {
			const el = await fixture(html`<d2l-button-add mode="icon-when-interacted" text="Add New Item"></d2l-button-add>`);
			const button = el.shadowRoot.querySelector('button');
			const tooltip = el.shadowRoot.querySelector('d2l-tooltip');
			expect(tooltip).to.exist;
			expect(button.id).to.equal(tooltip.getAttribute('for'));
		});

	});

});
