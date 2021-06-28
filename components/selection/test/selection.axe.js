import '../selection-action.js';
import '../selection-checkbox.js';
import '../selection-select-all.js';
import '../selection-summary.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-selection-action', () => {

	it('no selection required', async() => {
		const elem = await fixture(html`<d2l-selection-action text="Action"></d2l-selection-action>`);
		await expect(elem).to.be.accessible();
	});

	it('selection required', async() => {
		const elem = await fixture(html`<d2l-selection-action text="Action" requires-selection></d2l-selection-action>`);
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-selection-action text="Action" disabled></d2l-selection-action>`);
		await expect(elem).to.be.accessible();
	});

});

describe('d2l-selection-checkbox', () => {

	it('not selected', async() => {
		const elem = await fixture(html`<d2l-selection-checkbox label="Item Checkbox" key="key1"></d2l-selection-checkbox>`);
		await expect(elem).to.be.accessible();
	});

	it('selected', async() => {
		const elem = await fixture(html`<d2l-selection-checkbox label="Item Checkbox" key="key1" selected></d2l-selection-checkbox>`);
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-selection-checkbox label="Item Checkbox" key="key1" disabled></d2l-selection-checkbox>`);
		await expect(elem).to.be.accessible();
	});

});

describe('d2l-selection-select-all', () => {

	it('default', async() => {
		const elem = await fixture(html`<d2l-selection-select-all></d2l-selection-select-all>`);
		await expect(elem).to.be.accessible();
	});

});

describe('d2l-selection-summary', () => {

	it('default', async() => {
		const elem = await fixture(html`<d2l-selection-summary></d2l-selection-summary>`);
		await expect(elem).to.be.accessible();
	});

	it('no selection text', async() => {
		const elem = await fixture(html`<d2l-selection-summary no-selection-text="no items selected"></d2l-selection-summary>`);
		await expect(elem).to.be.accessible();
	});

});
