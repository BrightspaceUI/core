import '../view-switcher.js';
import '../view-switcher-item-button.js';
import { expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

describe('d2l-view-switcher', () => {

	let elem, items;
	beforeEach(async() => {
		elem = await fixture(html`
			<d2l-view-switcher>
				<d2l-view-switcher-button selected key="saveAsDraft" text="Save as Draft"></d2l-view-switcher-button>
				<d2l-view-switcher-button key="saveAndClose" text="Save and Close"></d2l-view-switcher-button>
				<d2l-view-switcher-button key="saveAndNew" text="Save and New"></d2l-view-switcher-button>
			</d2l-view-switcher>
		`);
		items = elem.items;
	});

	[
		{ name: 'basic' },
		{
			name: 'selected focus',
			action: async() => {
				items[0]._focusable = true;
				await focusElem(items[0]);
			}
		},
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
			await expect(elem).to.be.golden();
		});
	});

});
