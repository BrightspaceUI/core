import '../../menu/menu.js';
import '../selection-action.js';
import '../selection-action-dropdown.js';
import '../selection-action-menu-item.js';
import './selection-component.js';
import '../selection-input.js';
import '../selection-select-all.js';
import '../selection-select-all-pages.js';
import '../selection-summary.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

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

describe('d2l-selection-action-dropdown', () => {

	it('no selection required', async() => {
		const elem = await fixture(html`<d2l-selection-action-dropdown text="Action"></d2l-selection-action-dropdown>`);
		await expect(elem).to.be.accessible();
	});

	it('selection required', async() => {
		const elem = await fixture(html`<d2l-selection-action-dropdown text="Action" requires-selection></d2l-selection-action-dropdown>`);
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-selection-action-dropdown text="Action" disabled></d2l-selection-action-dropdown>`);
		await expect(elem).to.be.accessible();
	});

});

describe('d2l-selection-action-menu-item', () => {

	it('no selection required', async() => {
		const elem = await fixture(html`<d2l-menu label="Actions"><d2l-selection-action-menu-item text="Action"></d2l-selection-action-menu-item></d2l-menu>`);
		await expect(elem).to.be.accessible();
	});

	it('selection required', async() => {
		const elem = await fixture(html`<d2l-menu label="Actions"><d2l-selection-action-menu-item text="Action" requires-selection></d2l-selection-action-menu-item></d2l-menu>`);
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-menu label="Actions"><d2l-selection-action-menu-item text="Action" disabled></d2l-selection-action-menu-item></d2l-menu>`);
		await expect(elem).to.be.accessible();
	});

});

describe('d2l-selection-input checkbox', () => {

	it('not selected', async() => {
		const elem = await fixture(html`<d2l-test-selection><d2l-selection-input label="Input" key="key1"></d2l-selection-input></d2l-test-selection>`);
		await expect(elem.querySelector('d2l-selection-input')).to.be.accessible();
	});

	it('selected', async() => {
		const elem = await fixture(html`<d2l-test-selection><d2l-selection-input label="Input" key="key1" selected></d2l-selection-input></d2l-test-selection>`);
		await expect(elem.querySelector('d2l-selection-input')).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-test-selection><d2l-selection-input label="Input" key="key1" disabled></d2l-selection-input></d2l-test-selection>`);
		await expect(elem.querySelector('d2l-selection-input')).to.be.accessible();
	});

});

describe('d2l-selection-input radio', () => {

	it('not selected', async() => {
		const elem = await fixture(html`<d2l-test-selection selection-single><d2l-selection-input label="Input" key="key1"></d2l-selection-input></d2l-test-selection>`);
		await expect(elem.querySelector('d2l-selection-input')).to.be.accessible();
	});

	it('selected', async() => {
		const elem = await fixture(html`<d2l-test-selection selection-single><d2l-selection-input label="Input" key="key1" selected></d2l-selection-input></d2l-test-selection>`);
		await expect(elem.querySelector('d2l-selection-input')).to.be.accessible();
	});

});

describe('d2l-selection-select-all', () => {

	it('default', async() => {
		const elem = await fixture(html`<d2l-selection-select-all></d2l-selection-select-all>`);
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-selection-select-all disabled></d2l-selection-select-all>`);
		await expect(elem).to.be.accessible();
	});

});

describe('d2l-selection-select-all-pages', () => {

	it('default', async() => {
		const elem = await fixture(html`<d2l-test-selection item-count="50"><d2l-selection-select-all-pages></d2l-selection-select-all-pages><d2l-selection-input label="Input" key="key1" selected></d2l-selection-input></d2l-test-selection>`);
		await new Promise(resolve => setTimeout(resolve, 0));
		await expect(elem.querySelector('d2l-selection-select-all-pages')).to.be.accessible();
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
