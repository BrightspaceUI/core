import '../button-segmented.js';
import '../button-segmented-item.js';
import { expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

describe('d2l-button-segmented', () => {

	let elem, items;
	beforeEach(async() => {
		elem = await fixture(html`
			<d2l-button-segmented>
				<d2l-button-segmented-item selected key="saveAsDraft" text="Save as Draft"></d2l-button-segmented-item>
				<d2l-button-segmented-item key="saveAndClose" text="Save and Close"></d2l-button-segmented-item>
				<d2l-button-segmented-item key="saveAndNew" text="Save and New"></d2l-button-segmented-item>
			</d2l-button-segmented>
		`);
		items = elem.querySelectorAll('d2l-button-segmented-item');
	});

	[
		{ name: 'basic' },
		{ name: 'selected focus', action: focusElem },
		{
			name: 'selected hover',
			action: async() => {
				await hoverElem(items[0]);
			}
		},
		{
			name: 'unselected hover',
			action: async() => {
				await hoverElem(items[1]);
			},
		},
		{
			name: 'unselected focus',
			action: async() => {
				items[1]._focusable = true;
				await focusElem(items[1]);
			},
		}
	].forEach(({ name, action }) => {
		it(name, async() => {
			if (action) await action(elem);
			expect(elem).to.be.golden();
		});
	});

});
