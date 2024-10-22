import '../pager-load-more.js';
import { clickElem, defineCE, expect, fixture, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { html, LitElement } from 'lit';
import { reset, stub } from 'sinon';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { PageableMixin } from '../pageable-mixin.js';

const tagName = defineCE(
	class extends PageableMixin(LitElement) {
		render() {
			return html`${this._renderPagerContainer()}<slot></slot>`;
		}
		_getItemByIndex() { return null; }
		_getItemShowingCount() { return 10; }
	}
);

const focusableTag = defineCE(
	class extends LitElement {
		render() { return html`<button>focusable</button>`; }
		focus() { this.shadowRoot.querySelector('button').focus();}
	}
);

describe('d2l-pager-load-more', () => {

	let el, getItemByIndexStub, pager, pagerButton;
	beforeEach(async() => {
		el = await fixture(`
			<${tagName} item-count="30">
				<d2l-pager-load-more slot="pager" has-more page-size="5"></d2l-pager-load-more>
				<${focusableTag}></${focusableTag}>
				<div id="focusable-descendant"><button>focusable descendant</button></div>
				<div id="no-focusable-descendant">no focusable descendant</div>
			</${tagName}>
		`);
		getItemByIndexStub = stub(el, '_getItemByIndex');
		pager = el.querySelector('d2l-pager-load-more');
		pagerButton = el.querySelector('d2l-pager-load-more').shadowRoot.querySelector('button');
	});

	afterEach(() => reset);

	it('should construct', () => {
		runConstructor('d2l-pager-load-more');
	});

	it('should have the right initial item counts', async() => {
		expect(pager._pageableInfo).to.eql({ itemCount: 30, itemShowingCount: 10 });
	});

	describe('events', () => {

		it('dispatches d2l-pager-load-more event when clicked', async() => {
			clickElem(pagerButton);
			await oneEvent(pager, 'd2l-pager-load-more');
		});

		it('does not dispatch d2l-pager-load-more event while loading', async() => {

			clickElem(pagerButton);
			await oneEvent(pager, 'd2l-pager-load-more');

			// in loading state since e.detail.complete() was never called
			let dispatched = false;
			pager.addEventListener('d2l-pager-load-more', () => dispatched = true);
			pager.shadowRoot.querySelector('button').click();

			// make sure pager has a chance to dispatch the event
			await new Promise(resolve => {
				setTimeout(() => {
					expect(dispatched).to.be.false;
					resolve();
				});
			});
		});

	});

	describe('focus', () => {

		it('should not move focus when no item is provided', async() => {
			getItemByIndexStub.returns(null);
			clickElem(pagerButton);
			const e = await oneEvent(pager, 'd2l-pager-load-more');
			e.detail.complete();
			await oneEvent(pager, 'd2l-pager-load-more-loaded');
			expect(getComposedActiveElement()).to.equal(pagerButton);
		});

		it('should delegate focus when it implements its own focus method', async() => {
			const focusableElem = el.querySelector(focusableTag);
			getItemByIndexStub.returns(focusableElem);
			clickElem(pagerButton);
			const e = await oneEvent(pager, 'd2l-pager-load-more');
			e.detail.complete();
			await oneEvent(pager, 'd2l-pager-load-more-loaded');
			expect(getComposedActiveElement()).to.equal(focusableElem.shadowRoot.querySelector('button'));
		});

		it('should focus on first focusable descendant when no focus method is implemented', async() => {
			getItemByIndexStub.returns(el.querySelector('#focusable-descendant'));
			clickElem(pagerButton);
			const e = await oneEvent(pager, 'd2l-pager-load-more');
			e.detail.complete();
			await oneEvent(pager, 'd2l-pager-load-more-loaded');
			expect(getComposedActiveElement()).to.equal(el.querySelector('#focusable-descendant > button'));
		});

		it('should focus on item if no other focus target can be found', async() => {
			const focusableElem = el.querySelector('#no-focusable-descendant');
			getItemByIndexStub.returns(focusableElem);
			clickElem(pagerButton);
			const e = await oneEvent(pager, 'd2l-pager-load-more');
			e.detail.complete();
			await oneEvent(pager, 'd2l-pager-load-more-loaded');
			expect(getComposedActiveElement()).to.equal(focusableElem);
		});

	});

});
