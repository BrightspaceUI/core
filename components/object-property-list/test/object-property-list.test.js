import '../object-property-list.js';
import '../object-property-list-item.js';
import '../object-property-list-item-link.js';
import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const validateSeparators = (elem, count) => {
	const items = elem.querySelectorAll('d2l-object-property-list-item, d2l-object-property-list-item-link');
	expect(items.length).to.equal(count);
	items.forEach((item, i) => {
		const expectedDisplay = i === items.length - 1 ? 'none' : 'inline';
		const separator = item.shadowRoot.querySelector('.separator');
		expect(window.getComputedStyle(separator).display).to.equal(expectedDisplay);
	});
};

describe('d2l-object-property-list', () => {

	it('should construct', () => {
		runConstructor('d2l-object-property-list');
		runConstructor('d2l-object-property-list-item');
		runConstructor('d2l-object-property-list-item-link');
	});

	describe('separators', () => {
		it('should not be visible for a single item', async() => {
			const elem = await fixture(html`
				<d2l-object-property-list>
					<d2l-object-property-list-item text="Example item"></d2l-object-property-list-item>
				</d2l-object-property-list>
			`);
			validateSeparators(elem, 1);
		});

		it('should hide the final separator for multiple items', async() => {
			const elem = await fixture(html`
				<d2l-object-property-list>
					<d2l-object-property-list-item text="Example item"></d2l-object-property-list-item>
					<d2l-object-property-list-item text="Example item with icon" icon="tier1:grade"></d2l-object-property-list-item>
					<d2l-object-property-list-item-link text="Example link" href="https://www.d2l.com/"></d2l-object-property-list-item-link>
					<d2l-object-property-list-item-link text="Example link with icon" href="https://www.d2l.com/" icon="tier1:alert"></d2l-object-property-list-item-link>
				</d2l-object-property-list>
			`);
			validateSeparators(elem, 4);
		});

		it('should update automatically as items are added/removed', async() => {
			const elem = await fixture(html`
				<d2l-object-property-list>
					<d2l-object-property-list-item text="Example item 1"></d2l-object-property-list-item>
					<d2l-object-property-list-item text="Example item 2"></d2l-object-property-list-item>
				</d2l-object-property-list>
			`);

			const items = elem.querySelectorAll('d2l-object-property-list-item, d2l-object-property-list-item-link');
			elem.removeChild(items[1]);
			validateSeparators(elem, 1);
			elem.appendChild(items[1]);
			validateSeparators(elem, 2);
		});
	});

});
