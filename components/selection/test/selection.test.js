import '../../menu/menu.js';
import '../selection-action.js';
import '../selection-action-dropdown.js';
import '../selection-action-menu-item.js';
import './selection-component.js';
import '../selection-controls.js';
import '../selection-input.js';
import '../selection-select-all.js';
import '../selection-select-all-pages.js';
import '../selection-summary.js';
import { expect, fixture, html, nextFrame, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import { SelectionInfo } from '../selection-mixin.js';
import Sinon from 'sinon';

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

describe('d2l-selection-action-dropdown', () => {

	it('should construct', () => {
		runConstructor('d2l-selection-action-dropdown');
	});

});

describe('d2l-selection-action-menu-item', () => {

	it('should construct', () => {
		runConstructor('d2l-selection-action-menu-item');
	});

	it('dispatches d2l-selection-action-click event when clicked', async() => {
		const el = await fixture(html`<d2l-menu label="Actions"><d2l-selection-action-menu-item text="Action"></d2l-selection-action-menu-item></d2l-menu>`);
		setTimeout(() => el.querySelector('d2l-selection-action-menu-item').click());
		await oneEvent(el, 'd2l-selection-action-click');
	});

	it('dispatches d2l-selection-action-click event if requires selection and has selected', async() => {
		const el = await fixture(html`<d2l-menu label="Actions"><d2l-selection-action-menu-item text="Action" requires-selection></d2l-selection-action-menu-item></d2l-menu>`);
		const item = el.querySelector('d2l-selection-action-menu-item');
		item.selectionInfo = { state: 'some', keys: [] };
		setTimeout(() => item.click());
		await oneEvent(el, 'd2l-selection-action-click');
	});

	it('does not dispatch d2l-selection-action-click event if requires selection and none selected', async() => {
		const el = await fixture(html`<d2l-menu label="Actions"><d2l-selection-action-menu-item text="Action" requires-selection></d2l-selection-action-menu-item></d2l-menu>`);
		const item = el.querySelector('d2l-selection-action-menu-item');
		let dispatched = false;
		item.addEventListener('d2l-selection-action-click', () => dispatched = true);
		item.click();
		expect(dispatched).to.be.false;
	});

});

describe('d2l-selection-controls', () => {

	it('should construct', () => {
		runConstructor('d2l-selection-controls');
	});

	it('should set default label', async() => {
		const el = await fixture(html`<d2l-selection-controls></d2l-selection-controls>`);
		const section = el.shadowRoot.querySelector('section');
		expect(section.getAttribute('aria-label')).to.equal('Actions for selection');
	});

	it('should not set action label if there are no actions or selection options', async() => {
		const el = await fixture(html`<d2l-selection-controls no-selection></d2l-selection-controls>`);
		const section = el.shadowRoot.querySelector('section');
		expect(section.getAttribute('aria-label')).to.be.null;
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
				<d2l-selection-input key="key2" label="label2" selected></d2l-selection-input>
				<d2l-selection-input key="key3" label="label3" disabled></d2l-selection-input>
			</d2l-test-selection>
		`);
		await nextFrame();
	});

	it('dispatches d2l-selection-change event when selected changes to true', async() => {
		setTimeout(() => el.querySelector('[key="key1"]').selected = true);
		await oneEvent(el, 'd2l-selection-change');
	});

	it('dispatches d2l-selection-change event when selected changes to false', async() => {
		setTimeout(() => el.querySelector('[key="key2"]').selected = false);
		await oneEvent(el, 'd2l-selection-change');
	});

	describe('_handleRadioClick', () => {

		it('sets the selected property to true when enabled element is clicked', async() => {
			const clickEvent = new Event('click');
			el.querySelector('[key="key1"]')._handleRadioClick(clickEvent);
			expect(el.querySelector('[key="key1"]').selected).to.be.true;
		});

		it('does not set the selected property to true when a disabled element is clicked', async() => {
			const clickEvent = new Event('click');
			el.querySelector('[key="key3"]')._handleRadioClick(clickEvent);
			expect(el.querySelector('[key="key3"]').selected).to.be.false;
		});

	});

});

describe('d2l-selection-select-all', () => {

	it('should construct', () => {
		runConstructor('d2l-selection-select-all');
	});

});

describe('d2l-selection-select-all-pages', () => {

	it('should construct', () => {
		runConstructor('d2l-selection-select-all-pages');
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
		el = await fixture(html`
			<d2l-test-selection>
				<d2l-selection-select-all></d2l-selection-select-all>
				<d2l-selection-summary></d2l-selection-summary>
				<d2l-selection-input key="key1" label="label1"></d2l-selection-input>
				<d2l-selection-input key="key2" label="label2"></d2l-selection-input>
				<d2l-selection-input key="key3" label="label3"></d2l-selection-input>
				<d2l-selection-input key="key4" label="label4" disabled></d2l-selection-input>
			</d2l-test-selection>
		`);
		await nextFrame();
	});

	it('dispatches d2l-selection-provider-connected event when connected', async() => {
		setTimeout(() => {
			const parentNode = el.parentNode;
			parentNode.removeChild(el);
			parentNode.appendChild(el);
		});
		await oneEvent(el, 'd2l-selection-provider-connected');
	});

	it('registers observers', async() => {
		expect(el._selectionObservers.size).to.equal(2);
	});

	it('unregisters observers', async() => {
		el.removeChild(el.querySelector('d2l-selection-summary'));
		expect(el._selectionObservers.size).to.equal(1);
	});

	it('registers selectables', async() => {
		expect(el._selectionSelectables.size).to.equal(4);
	});

	it('unregisters selectables', async() => {
		el.removeChild(el.querySelector('[key="key1"]'));
		expect(el._selectionSelectables.size).to.equal(3);
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
		expect(info.keys.length).to.equal(4);
		el.querySelectorAll('[key]').forEach(checkbox => expect(info.keys.includes(checkbox.key)).to.equal(true));
	});

	describe('setSelectionForAll', () => {
		it('only sets the selectables that need to change', async() => {
			el.querySelector('[key="key1"]').selected = true;
			const spy1 = Sinon.spy(el.querySelector('[key="key1"]'), 'selected', ['set']);
			const spy2 = Sinon.spy(el.querySelector('[key="key2"]'), 'selected', ['set']);
			const spy3 = Sinon.spy(el.querySelector('[key="key3"]'), 'selected', ['set']);
			const spy4 = Sinon.spy(el.querySelector('[key="key4"]'), 'selected', ['set']);

			el.setSelectionForAll(true);

			expect(spy1.set).to.not.have.been.called;
			expect(spy2.set).to.have.been.calledOnce;
			expect(spy3.set).to.have.been.calledOnce;
			expect(spy4.set).to.not.have.been.called;
			el.querySelectorAll('[key]').forEach(checkbox => {
				if (checkbox.key === 'key4') {
					expect(checkbox.selected).to.equal(false);
				}
				else {
					expect(checkbox.selected).to.equal(true);
				}
			});
		});

		it('cannot be used for selecting in the selection-single case (only clearing)', async() => {
			el.selectionSingle = true;
			el.querySelector('[key="key1"]').selected = true;
			const spy1 = Sinon.spy(el.querySelector('[key="key1"]'), 'selected', ['set']);
			const spy2 = Sinon.spy(el.querySelector('[key="key2"]'), 'selected', ['set']);
			const spy3 = Sinon.spy(el.querySelector('[key="key3"]'), 'selected', ['set']);
			const spy4 = Sinon.spy(el.querySelector('[key="key4"]'), 'selected', ['set']);

			el.setSelectionForAll(true);
			expect(spy1.set).to.not.have.been.called;
			expect(spy2.set).to.not.have.been.called;
			expect(spy3.set).to.not.have.been.called;
			expect(spy4.set).to.not.have.been.called;
			expect(el.querySelector('[key="key1"]').selected).to.be.true;
			expect(el.querySelector('[key="key2"]').selected).to.be.false;
			expect(el.querySelector('[key="key3"]').selected).to.be.false;
			expect(el.querySelector('[key="key4"]').selected).to.be.false;

			el.setSelectionForAll(false);
			expect(spy1.set).to.have.been.calledOnce;
			el.querySelectorAll('[key]').forEach(checkbox => expect(!!checkbox.selected).to.equal(false));
		});
	});

});

describe('SelectionObserverMixin', () => {

	let el, collection;

	beforeEach(async() => {
		el = await fixture(html`
			<div>
				<d2l-selection-action selection-for="d2l-test-selection"></d2l-selection-action>
				<d2l-selection-select-all selection-for="d2l-test-selection"></d2l-selection-select-all>
				<d2l-selection-summary selection-for="some-other-selection"></d2l-selection-summary>
				<d2l-test-selection id="d2l-test-selection">
					<d2l-selection-input key="key1" label="label1"></d2l-selection-input>
					<d2l-selection-input key="key2" label="label2" selected></d2l-selection-input>
					<d2l-selection-input key="key3" label="label3"></d2l-selection-input>
				</d2l-test-selection>

				<d2l-test-selection id="d2l-test-selection-2"></d2l-test-selection>
				<d2l-test-selection id="d2l-test-selection-3">
					<d2l-selection-action></d2l-selection-action>
				</d2l-test-selection>
				<d2l-test-selection id="d2l-test-selection-4"></d2l-test-selection>
				<d2l-test-selection-observer-shadow selection-for="d2l-test-selection-2"></d2l-test-selection-observer-shadow>
			</div>
		`);
		collection = el.querySelector('#d2l-test-selection');
		await nextFrame();
		await nextFrame(); // Limit test flake
	});

	it('registers observers', async() => {
		expect(collection._selectionObservers.size).to.equal(2);

		el.querySelector('d2l-selection-summary').selectionFor = 'd2l-test-selection';
		await collection.updateComplete;
		expect(collection._selectionObservers.size).to.equal(3);

		const newObserver = document.createElement('d2l-selection-action');
		newObserver.selectionFor = 'd2l-test-selection';
		el.appendChild(newObserver);
		await newObserver.updateComplete;

		expect(collection._selectionObservers.size).to.equal(4);
	});

	it('unregisters observers', async() => {
		expect(collection._selectionObservers.size).to.equal(2);
		el.removeChild(el.querySelector('d2l-selection-action'));
		await collection.updateComplete;
		expect(collection._selectionObservers.size).to.equal(1);

		el.querySelector('d2l-selection-select-all').selectionFor = 'some-other-selection';
		await collection.updateComplete;
		expect(collection._selectionObservers.size).to.equal(0);
	});

	it('unregisters and registers the SelectionMixin component', async() => {
		const observer = el.querySelector('d2l-selection-action');
		const provider = el.querySelector('#d2l-test-selection');

		expect(observer._provider).to.equal(provider);
		expect(observer.selectionInfo.state).to.equal(SelectionInfo.states.some);

		el.removeChild(el.querySelector('#d2l-test-selection'));
		await observer.updateComplete;
		expect(observer._provider).to.be.null;
		expect(observer.selectionInfo.state).to.equal(SelectionInfo.states.none);

		const newProvider = document.createElement('d2l-test-selection');
		newProvider.id = 'd2l-test-selection';
		el.appendChild(newProvider);
		await observer.updateComplete;
		expect(observer._provider).to.equal(newProvider);
		expect(observer.selectionInfo.state).to.equal(SelectionInfo.states.none);
	});

	it('should unsubscribe and remove provider/observer when selectionFor is cleared', async() => {
		const observer = el.querySelector('d2l-selection-action');
		expect(collection._selectionObservers.size).to.equal(2);
		expect(observer._provider).to.equal(collection);
		expect(observer._selectionForObserver).not.to.be.undefined;

		observer.selectionFor = '';
		await observer.updateComplete;
		expect(collection._selectionObservers.size).to.equal(1);
		expect(observer._provider).to.be.undefined;
		expect(observer._selectionForObserver).to.be.undefined;
	});

	it('should resubscribe/observe when disconnected and reconnected', async() => {
		const observer = el.querySelector('d2l-selection-action');

		el.removeChild(observer);
		await collection.updateComplete;
		expect(collection._selectionObservers.size).to.equal(1);
		expect(observer._selectionForObserver).to.be.undefined;
		expect(observer._provider).to.be.undefined;

		el.appendChild(observer);
		await nextFrame();
		await nextFrame();
		await collection.updateComplete;
		expect(collection._selectionObservers.size).to.equal(2);
		expect(observer._selectionForObserver).not.to.be.undefined;
		expect(observer._provider).not.to.be.undefined;
	});

	it('should automatically subscribe any child selection-observers', async() => {
		const collection2 = el.querySelector('#d2l-test-selection-2');
		const observer = el.querySelector('d2l-test-selection-observer-shadow').shadowRoot.querySelector('d2l-test-selection-observer');
		expect(observer._provider).to.equal(collection2);
		expect(collection2._selectionObservers.size).to.equal(2);
	});

	it('should attach to a new provider when connected in a different context', async() => {
		const collection3 = el.querySelector('#d2l-test-selection-3');
		const collection4 = el.querySelector('#d2l-test-selection-4');
		const observer = collection3.querySelector('d2l-selection-action');
		expect(collection3._selectionObservers.size).to.equal(1);
		expect(collection4._selectionObservers.size).to.equal(0);

		collection4.appendChild(observer);
		await nextFrame();
		await nextFrame();
		await collection4.updateComplete;
		await collection3.updateComplete;
		expect(collection3._selectionObservers.size).to.equal(0);
		expect(collection4._selectionObservers.size).to.equal(1);
		expect(observer._provider).to.equal(collection4);
	});
});
