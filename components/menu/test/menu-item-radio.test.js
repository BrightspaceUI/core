import '../menu-item-radio.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

function dispatchItemSelectEvent(elem) {
	const e = new CustomEvent(
		'd2l-menu-item-select',
		{ bubbles: true, composed: true }
	);
	elem.dispatchEvent(e);
}

describe('d2l-menu-item-radio', () => {

	describe('accessibility', () => {

		it('has role="menuitemradio"', async() => {
			const elem = await fixture(html`<d2l-menu-item-radio></d2l-menu-item-radio>`);
			expect(elem.getAttribute('role')).to.equal('menuitemradio');
		});

	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-menu-item-radio');
		});

	});

	describe('events', () => {

		it('should set selected=true when "d2l-menu-item-select" event occurs', async() => {
			const elem = await fixture(html`<d2l-menu-item-radio></d2l-menu-item-radio>`);
			dispatchItemSelectEvent(elem);
			expect(elem.selected).to.be.true;
		});

		it('deselects other radio options in the menu when selected', async() => {
			const elem = await fixture(html`
				<div>
					<d2l-menu-item-radio id="item1" value="1" selected></d2l-menu-item-radio>
					<d2l-menu-item-radio id="item2" value="2"></d2l-menu-item-radio>
				</div>
			`);
			const item1 = elem.querySelector('#item1');
			const item2 = elem.querySelector('#item2');
			expect(item1.selected).to.be.true;
			expect(item2.selected).to.be.false;
			dispatchItemSelectEvent(item2);
			expect(item2.selected).to.be.true;
			expect(item1.selected).to.be.false;
		});

		it('dispatches "d2l-menu-item-change" event when selected by calling __onSelect()', async() => {
			const elem = await fixture(html`<d2l-menu-item-radio value="1"></d2l-menu-item-radio>`);
			setTimeout(() => dispatchItemSelectEvent(elem));
			const { detail } = await oneEvent(elem, 'd2l-menu-item-change');
			expect(detail.value).to.equal('1');
			expect(detail.selected).to.be.true;
		});

	});

});
