import '../view-switcher.js';
import '../view-switcher-item-button.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-view-switcher', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-view-switcher');
		});

	});

	let elem, items;
	beforeEach(async() => {
		elem = await fixture(html`
			<d2l-view-switcher>
				<d2l-view-switcher-button key="saveAsDraft" text="Save as Draft"></d2l-view-switcher-button>
				<d2l-view-switcher-button key="saveAndClose" text="Save and Close"></d2l-view-switcher-button>
				<d2l-view-switcher-button key="saveAndNew" text="Save and New"></d2l-view-switcher-button>
			</d2l-view-switcher>
		`);
		items = elem.items;
	});

	describe('selection', () => {
		it('should have first item selected by default', () => {
			expect(items[0].selected).to.be.true;
			expect(items[1].selected).to.be.false;
			expect(items[2].selected).to.be.false;
		});
		it('should fire select event when item is clicked', async() => {
			clickElem(items[2]);
			const e = await oneEvent(items[2], 'd2l-view-switcher-item-select');

			expect(e.detail.key).to.equal('saveAndNew');
		});

		it('should select clicked item and deselect others', async() => {
			clickElem(items[1]);
			await oneEvent(items[1], 'd2l-view-switcher-item-select');

			expect(items[0].selected).to.be.false;
			expect(items[1].selected).to.be.true;
			expect(items[2].selected).to.be.false;
		});
	});

});
