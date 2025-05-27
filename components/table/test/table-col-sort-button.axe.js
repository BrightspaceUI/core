import '../table-col-sort-button.js';
import '../table-col-sort-button-item.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-table-col-sort-button', () => {

	it('single-facet', async() => {
		const elem = await fixture(html`
			<d2l-table-col-sort-button>Field Name</d2l-table-col-sort-button>
		`);
		await expect(elem).to.be.accessible();
	});

	it('multi-faceted', async() => {
		const elem = await fixture(html`
			<d2l-table-col-sort-button>
				Items
				<d2l-table-col-sort-button-item slot="items" text="Item, ascending"></d2l-table-col-sort-button-item>
				<d2l-table-col-sort-button-item slot="items" text="Item, descending"></d2l-table-col-sort-button-item>
			</d2l-table-col-sort-button>
		`);
		await expect(elem).to.be.accessible();
	});

	it('should assign default slot text content to menu label', async() => {
		const elem = await fixture(html`
			<d2l-table-col-sort-button>
				Part 1
				<div>
					Part 2
					<span>Part 3</span>
					Part 4
				</div>Part 5
				<d2l-table-col-sort-button-item slot="items" text="Item, ascending"></d2l-table-col-sort-button-item>
				<d2l-table-col-sort-button-item slot="items" text="Item, descending"></d2l-table-col-sort-button-item>
			</d2l-table-col-sort-button>
		`);
		expect(elem.shadowRoot.querySelector('d2l-menu').getAttribute('label')).to.equal('Part 1 Part 2 Part 3 Part 4 Part 5');
	});

});
