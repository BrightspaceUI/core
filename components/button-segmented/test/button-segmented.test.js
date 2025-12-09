import '../button-segmented.js';
import '../button-segmented-item.js';
import { clickElem, expect, fixture, focusElem, html, oneEvent, runConstructor, sendKeysElem } from '@brightspace-ui/testing';

describe('d2l-button-segmented', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-segmented');
		});

	});

	let elem, items, after;
	beforeEach(async() => {
		elem = await fixture(html`
			<d2l-button-segmented>
				<d2l-button-segmented-item key="saveAsDraft" text="Save as Draft"></d2l-button-segmented-item>
				<d2l-button-segmented-item key="saveAndClose" text="Save and Close"></d2l-button-segmented-item>
				<d2l-button-segmented-item key="saveAndNew" text="Save and New"></d2l-button-segmented-item>
			</d2l-button-segmented>
			<button id="after">After</button>
		`);
		items = elem.querySelectorAll('d2l-button-segmented-item');
		after = elem.parentElement.querySelector('#after');
	});

	describe('selection', () => {
		it('should have first item selected by default', () => {
			expect(items[0].selected).to.be.true;
			expect(items[1].selected).to.be.false;
			expect(items[2].selected).to.be.false;
		});
		it('should fire select event when item is clicked', async() => {
			setTimeout(() => clickElem(items[2]));
			const e = await oneEvent(items[2], 'd2l-button-segmented-item-select');

			expect(e.detail.key).to.equal('saveAndNew');
		});

		it('should select clicked item and deselect others', async() => {
			setTimeout(() => clickElem(items[1]));
			await oneEvent(items[1], 'd2l-button-segmented-item-select');

			expect(items[0].selected).to.be.false;
			expect(items[1].selected).to.be.true;
			expect(items[2].selected).to.be.false;
		});
	});

});
