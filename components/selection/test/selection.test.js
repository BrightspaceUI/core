import '../selection-action.js';
import './selection-component.js';
import '../selection-input.js';
import '../selection-select-all.js';
import '../selection-summary.js';
import { expect, fixture, html, nextFrame, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-selection-action', () => {

	it('should construct', () => {
		runConstructor('d2l-selection-action');
	});

	it('dispatches d2l-selection-action-click event when clicked', async() => {
		const el = await fixture(html`<d2l-selection-action></d2l-selection-action>`);
		setTimeout(() => el.shadowRoot.querySelector('d2l-button-subtle').click());
		await oneEvent(el, 'd2l-selection-action-click');
	});

	it('dispatches d2l-selection-action-click event when d2l-button-ghost-click is dispatched', async() => {
		const el = await fixture(html`<d2l-selection-action></d2l-selection-action>`);
		setTimeout(() => el.dispatchEvent(new CustomEvent('d2l-button-ghost-click')));
		await oneEvent(el, 'd2l-selection-action-click');
	});

	it('dispatches d2l-selection-action-click event if requires selection and has selected', async() => {
		const el = await fixture(html`<d2l-selection-action requires-selection></d2l-selection-action>`);
		el.selectionInfo = { state: 'some', keys: [] };
		setTimeout(() => el.shadowRoot.querySelector('d2l-button-subtle').click());
		await oneEvent(el, 'd2l-selection-action-click');
	});

	it('does not dispatch d2l-selection-action-click event if requires selection and none selected', async() => {
		const el = await fixture(html`<d2l-selection-action requires-selection></d2l-selection-action>`);
		let dispatched = false;
		el.addEventListener('d2l-selection-action-click', () => dispatched = true);
		el.shadowRoot.querySelector('d2l-button-subtle').click();
		expect(dispatched).to.be.false;
	});

});

describe('d2l-selection-input', () => {

	it('should construct', () => {
		runConstructor('d2l-selection-input');
	});

	let el;

	beforeEach(async() => {
		el = await fixture(`
			<d2l-test-selection>
				<d2l-selection-input key="key1" label="label1"></d2l-selection-input>
			</d2l-test-selection>
		`);
		await el.updateComplete;
		await nextFrame();
		el = el.querySelector('d2l-selection-input');
	});

	it('dispatches d2l-selection-change event when checkbox changes', async() => {
		setTimeout(() => el.shadowRoot.querySelector('d2l-input-checkbox').dispatchEvent(new CustomEvent('change')));
		await oneEvent(el, 'd2l-selection-change');
	});

	it('dispatches d2l-selection-change event when selected changes to true', async() => {
		setTimeout(() => el.selected = true);
		await oneEvent(el, 'd2l-selection-change');
	});

	it('dispatches d2l-selection-change event when selected changes to false', async() => {
		setTimeout(() => el.selected = false);
		await oneEvent(el, 'd2l-selection-change');
	});

});

describe('d2l-selection-select-all', () => {

	it('should construct', () => {
		runConstructor('d2l-selection-select-all');
	});

	it('dispatches d2l-selection-select-all-change event when checkbox changes', async() => {
		const el = await fixture(html`<d2l-selection-select-all></d2l-selection-select-all>`);
		setTimeout(() => el.shadowRoot.querySelector('d2l-input-checkbox').dispatchEvent(new CustomEvent('change')));
		await oneEvent(el, 'd2l-selection-select-all-change');
	});

});

describe('d2l-selection-summary', () => {

	it('should construct', () => {
		runConstructor('d2l-selection-summary');
	});

});

describe('SelectionMixin', () => {

	let el;

	beforeEach(async() => {
		el = await fixture(`
			<d2l-test-selection>
				<d2l-selection-select-all></d2l-selection-select-all>
				<d2l-selection-summary></d2l-selection-summary>
				<d2l-selection-input key="key1" label="label1"></d2l-selection-input>
				<d2l-selection-input key="key2" label="label2"></d2l-selection-input>
				<d2l-selection-input key="key3" label="label3"></d2l-selection-input>
			</d2l-test-selection>
		`);
		await el.updateComplete;
		await nextFrame();
	});

	it('registers observers', async() => {
		expect(el._selectionObservers.size).to.equal(2);
	});

	it('unregisters observers', async() => {
		el.removeChild(el.querySelector('d2l-selection-summary'));
		expect(el._selectionObservers.size).to.equal(1);
	});

	it('registers selectables', async() => {
		expect(el._selectionSelectables.size).to.equal(3);
	});

	it('unregisters selectables', async() => {
		el.removeChild(el.querySelector('[key="key1"]'));
		expect(el._selectionSelectables.size).to.equal(2);
	});

	it('returns none for getSelectionInfo when none selected', async() => {
		const info = el.getSelectionInfo();
		expect(info.state).to.equal('none');
		expect(info.keys.length).to.equal(0);
	});

	it('returns some for getSelectionInfo when some selected', async() => {
		el.querySelector('[key="key1"]').selected = true;
		const info = el.getSelectionInfo();
		expect(info.state).to.equal('some');
		expect(info.keys.length).to.equal(1);
		expect(info.keys.includes('key1')).to.equal(true);
	});

	it('returns all for getSelectionInfo when all selected', async() => {
		el.querySelectorAll('[key]').forEach(checkbox => checkbox.selected = true);
		const info = el.getSelectionInfo();
		expect(info.state).to.equal('all');
		expect(info.keys.length).to.equal(3);
		el.querySelectorAll('[key]').forEach(checkbox => expect(info.keys.includes(checkbox.key)).to.equal(true));
	});

});
