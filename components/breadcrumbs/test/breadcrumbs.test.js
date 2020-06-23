import '../breadcrumbs.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-breadcrumbs', () => {
	describe('basic attribute tests', () => {
		let elem;
		beforeEach(async() => {
			elem = await fixture(html`
				<d2l-breadcrumbs>
					<d2l-breadcrumb href="#" text="Basic Item 1"></d2l-breadcrumb>
					<d2l-breadcrumb href="#" text="Basic Item 2"></d2l-breadcrumb>
					<d2l-breadcrumb href="#" text="Basic Item 3" aria-label="Aria for Item 3"></d2l-breadcrumb>
				</d2l-breadcrumbs>
			`);
		});

		describe('attribute reflection', () => {
			it('should reflect "compact" property to attribute', async() => {
				elem.compact = true;
				await elem.updateComplete;
				expect(elem.hasAttribute('compact')).to.be.true;
			});

			it('should reflect "compact" property to children', async() => {
				elem.compact = true;
				await elem.updateComplete;
				expect(elem.shadowRoot.querySelector('slot').assignedNodes().filter(
					item => item.nodeName === 'D2L-BREADCRUMB' &&
				item.hasAttribute('compact')
				).length).to.eq(3);
			});
		});

		describe('constructor', () => {
			it('should construct', () => {
				runConstructor('d2l-breadcrumbs');
			});
		});

		describe('default property values', () => {
			it('should default "compact" property to "false" when unset', () => {
				expect(elem.compact).to.be.false;
			});
		});
	});

	describe('basic', () => {
		let list;
		let items;
		before(async() => {
			list = await fixture(html`
				<d2l-breadcrumbs>
					<d2l-breadcrumb href="#" text="Basic Item 1"></d2l-breadcrumb>
					<d2l-breadcrumb href="#" text="Basic Item 2"></d2l-breadcrumb>
					<d2l-breadcrumb href="#" text="Basic Item 3" aria-label="Aria for Item 3"></d2l-breadcrumb>
				</d2l-breadcrumbs>
			`);
			items = list.querySelectorAll('d2l-breadcrumb:not([hidden])');
		});

		it('should display three items', () => {
			expect(items.length).to.equal(3);
		});
	});

	describe('basic overflow', () => {
		let list;
		let wrapper;

		before(async() => {
			list = await fixture(html`
				<d2l-breadcrumbs style="max-width: 250px; width: 250px;">
					<d2l-breadcrumb href="#" text="Truncate Basic Item 1"></d2l-breadcrumb>
					<d2l-breadcrumb href="#" text="Truncate Basic Item 2"></d2l-breadcrumb>
					<d2l-breadcrumb href="#" text="Truncate Basic Item 3"></d2l-breadcrumb>
					<d2l-breadcrumb href="#" text="Truncate Basic Item 4"></d2l-breadcrumb>
					<d2l-breadcrumb href="#" text="Truncate Basic Item 5"></d2l-breadcrumb>
					<d2l-breadcrumb href="#" text="Truncate Basic Item 6"></d2l-breadcrumb>
				</d2l-breadcrumbs>
			`);
			const itemShadowRoot = list.shadowRoot;
			wrapper = itemShadowRoot.querySelector('div.d2l-breadcrumbs-wrapper');
		});

		it('should hide overflown elements', () => {
			expect(wrapper.clientWidth).to.equal(250);
			expect(wrapper.scrollWidth > wrapper.clientWidth).to.be.true;
		});
	});

	describe('compact', () => {
		let list;
		let items;

		before(async() => {
			list = await fixture(html`
				<d2l-breadcrumbs compact>
					<d2l-breadcrumb href="#" text="Compact Item 1"></d2l-breadcrumb>
					<d2l-breadcrumb href="#" text="Compact Item 2"></d2l-breadcrumb>
					<d2l-breadcrumb href="#" text="Compact Item 3"></d2l-breadcrumb>
				</d2l-breadcrumbs>
			`);
			items = list.querySelectorAll('d2l-breadcrumb');
		});

		it('should display only last item', () => {
			expect(items.length).to.equal(3);
			expect(items[0].scrollWidth).to.equal(0);
			expect(items[1].scrollWidth).to.equal(0);
			expect(items[2].scrollWidth).to.not.equal(0);
			const itemLink = items[2].shadowRoot.querySelector('d2l-link');
			expect(itemLink.innerText).to.equal('Compact Item 3');
		});

		it('should show chevron-left icon', () => {
			expect(items.length).to.equal(3);
			const itemLink = items[2].shadowRoot.querySelector('d2l-icon');
			expect(itemLink.icon).to.equal('d2l-tier1:chevron-left');
		});
	});

});
