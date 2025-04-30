import '../button-split.js';
import '../button-split-item.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

describe('d2l-button-split-item', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-split-item');
		});

	});

});

describe('d2l-button-split', () => {

	const getTemplate = (options) => {
		return html`
			<d2l-button-split 
				?disabled="${options?.disabled}"
				disabled-tooltip="${ifDefined(options?.disabledTooltip)}"
				key="save"
				text="Save">
				<d2l-button-split-item key="saveAsDraft" text="Save as Draft"></d2l-button-split-item>
				<d2l-button-split-item key="saveAndClose" text="Save and Close"></d2l-button-split-item>
			</d2l-button-split>
		`;
	};

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-split');
		});

	});

	describe('events', () => {

		it('dispatches click event when main action button clicked', async() => {
			const el = await fixture(getTemplate());
			clickElem(el.shadowRoot.querySelector('.main-action'));
			const e = await oneEvent(el, 'click');
			expect(e.detail.key).to.equal('save');
		});

		it('dispatches click event when menu item clicked', async() => {
			const el = await fixture(getTemplate());
			await clickElem(el.shadowRoot.querySelector('.d2l-dropdown-opener'));
			clickElem(el.querySelector('d2l-button-split-item'));
			const e = await oneEvent(el, 'click');
			expect(e.detail.key).to.equal('saveAsDraft');
		});

		it('does not dispatch click event when opener clicked', async() => {
			let dispatched = false;
			const el = await fixture(getTemplate());
			el.addEventListener('click', () => dispatched = true);
			await clickElem(el.shadowRoot.querySelector('.d2l-dropdown-opener'));
			expect(dispatched).to.equal(false);
		});

		it('does not dispatch click event when disabled', async() => {
			let dispatched = false;
			const el = await fixture(getTemplate({ disabled: true, disabledTooltip: 'Mmmmm... more donuts' }));
			el.addEventListener('click', () => dispatched = true);
			await clickElem(el.shadowRoot.querySelector('.main-action'));
			expect(dispatched).to.equal(false);
		});

	});

});
