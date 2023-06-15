import '../list-item-drag-handle.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

describe('d2l-list-item-drag-handle', () => {

	it('normal', async() => {
		const element = await fixture(html`<d2l-list-item-drag-handle></d2l-list-item-drag-handle>`);
		await expect(element).to.be.accessible();
	});

	it('disabled', async() => {
		const element = await fixture(html`<d2l-list-item-drag-handle disabled></d2l-list-item-drag-handle>`);
		await expect(element).to.be.accessible();
	});

	it('normal + focus', async() => {
		const element = await fixture(html`<d2l-list-item-drag-handle></d2l-list-item-drag-handle>`);
		element.focus();
		await expect(element).to.be.accessible();
	});

	it('keyboard mode active', async() => {
		const element = await fixture(html`<d2l-list-item-drag-handle></d2l-list-item-drag-handle>`);
		element.focus();
		const actionArea = element.shadowRoot.querySelector('button');
		setTimeout(() => actionArea.dispatchEvent(new Event('click')));
		await oneEvent(actionArea, 'click');
		await expect(element).to.be.accessible();
	});

});
