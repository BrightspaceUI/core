import '../view-switcher.js';
import '../view-switcher-button.js';
import { expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

describe('d2l-view-switcher', () => {
	[
		{ name: 'basic' },
		{
			name: 'selected focus',
			action: async(items) => {
				items[0]._focusable = true;
				await focusElem(items[0]);
			}
		},
		{
			name: 'selected hover',
			action: async(items) => {
				await hoverElem(items[0]);
			}
		},
		{
			name: 'unselected hover',
			action: async(items) => {
				await hoverElem(items[1]);
			},
		},
		{
			name: 'unselected focus',
			action: async(items) => {
				items[1]._focusable = true;
				await focusElem(items[1]);
			},
		}
	].forEach(({ name, action }) => {
		it(name, async() => {
			const elem = await fixture(html`
				<d2l-view-switcher>
					<d2l-view-switcher-button selected key="saveAsDraft" text="Save as Draft"></d2l-view-switcher-button>
					<d2l-view-switcher-button key="saveAndClose" text="Save and Close"></d2l-view-switcher-button>
					<d2l-view-switcher-button key="saveAndNew" text="Save and New"></d2l-view-switcher-button>
				</d2l-view-switcher>
			`);
			if (action) await action(elem.items);
			await expect(elem).to.be.golden();
		});

		it(`icons-${name}`, async() => {
			const elem = await fixture(html`
				<d2l-view-switcher>
					<d2l-view-switcher-button selected key="list" text="list view" icon="tier1:list-view"></d2l-view-switcher-button>
					<d2l-view-switcher-button key="tile" text="tile view" icon="tier1:tile-view"></d2l-view-switcher-button>
				</d2l-view-switcher>
			`);
			if (action) await action(elem.items);
			await expect(elem).to.be.golden();
		});

		it(`icons-text-hidden-${name}`, async() => {
			const elem = await fixture(html`
				<d2l-view-switcher>
					<d2l-view-switcher-button selected key="list" text="list view" icon="tier1:list-view" text-hidden></d2l-view-switcher-button>
					<d2l-view-switcher-button key="tile" text="tile view" icon="tier1:tile-view" text-hidden></d2l-view-switcher-button>
				</d2l-view-switcher>
			`);
			if (action) await action(elem.items);
			await expect(elem).to.be.golden();
		});
	});

});
