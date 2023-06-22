import '../pager-load-more.js';
import { defineCE, expect, fixture, oneEvent } from '@brightspace-ui/testing';
import { html, LitElement } from 'lit';
import { PageableMixin } from '../pageable-mixin.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const tagName = defineCE(
	class extends PageableMixin(LitElement) {
		render() {
			return html`${this._renderPagerContainer()}`;
		}
		_getItemByIndex() { return null; }
		_getItemShowingCount() { return 10; }
	}
);

describe('d2l-pager-load-more', () => {

	it('should construct', () => {
		runConstructor('d2l-pager-load-more');
	});

	it('dispatches d2l-pager-load-more event when clicked', async() => {
		const el = await fixture(`<${tagName} item-count="30"><d2l-pager-load-more slot="pager" has-more page-size="5"></d2l-pager-load-more></${tagName}`);
		const pager = el.querySelector('d2l-pager-load-more');

		setTimeout(() => pager.shadowRoot.querySelector('button').click());
		await oneEvent(pager, 'd2l-pager-load-more');
	});

	it('does not dispatch d2l-pager-load-more event while loading', async() => {
		const el = await fixture(`<${tagName} item-count="30"><d2l-pager-load-more slot="pager" has-more page-size="5"></d2l-pager-load-more></${tagName}`);
		const pager = el.querySelector('d2l-pager-load-more');

		setTimeout(() => pager.shadowRoot.querySelector('button').click());
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

	it('should have the right initial item counts', async() => {
		const el = await fixture(`<${tagName} item-count="30"><d2l-pager-load-more slot="pager" has-more page-size="5"></d2l-pager-load-more></${tagName}`);
		const pager = el.querySelector('d2l-pager-load-more');

		expect(pager._pageableInfo).to.eql({ itemCount: 30, itemShowingCount: 10 });
	});
});
