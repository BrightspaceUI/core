import '../object-property-list.js';
import '../object-property-list-item.js';
import '../object-property-list-item-link.js';
import '../../status-indicator/status-indicator.js';
import { aTimeout, expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const validateSeparators = (elem, count) => {
	const items = elem.querySelectorAll('d2l-object-property-list-item:not([hidden]), d2l-object-property-list-item-link:not([hidden])');
	expect(items.length).to.equal(count);
	items.forEach((item, i) => {
		const shouldHaveSeparator = i !== items.length - 1;
		const separator = item.shadowRoot.querySelector('.separator');
		expect(!!separator).to.equal(shouldHaveSeparator);
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
					<d2l-status-indicator slot="status" state="default" text="Status"></d2l-status-indicator>
					<d2l-object-property-list-item text="Example item"></d2l-object-property-list-item>
				</d2l-object-property-list>
			`);
			validateSeparators(elem, 1);
		});

		it('should hide the final separator for multiple items', async() => {
			const elem = await fixture(html`
				<d2l-object-property-list>
					<d2l-status-indicator slot="status" state="default" text="Status"></d2l-status-indicator>
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
					<d2l-status-indicator slot="status" state="default" text="Status"></d2l-status-indicator>
					<d2l-object-property-list-item text="Example item 1"></d2l-object-property-list-item>
					<d2l-object-property-list-item text="Example item 2"></d2l-object-property-list-item>
				</d2l-object-property-list>
			`);

			const items = elem.querySelectorAll('d2l-object-property-list-item, d2l-object-property-list-item-link');
			elem.removeChild(items[1]);
			await aTimeout(); // Required for Webkit only.
			validateSeparators(elem, 1);

			elem.appendChild(items[1]);
			await aTimeout(); // Required for Webkit only.
			validateSeparators(elem, 2);
		});

		it('should display correctly if status slot is after all items', async() => {
			const elem = await fixture(html`
				<d2l-object-property-list>
					<d2l-object-property-list-item text="Example item 1"></d2l-object-property-list-item>
					<d2l-object-property-list-item text="Example item 2"></d2l-object-property-list-item>
					<d2l-status-indicator slot="status" state="default" text="Status"></d2l-status-indicator>
				</d2l-object-property-list>
			`);
			validateSeparators(elem, 2);
		});

		it('should respond to hidden items', async() => {
			const elem = await fixture(html`
				<d2l-object-property-list>
					<d2l-status-indicator slot="status" state="default" text="Status"></d2l-status-indicator>
					<d2l-object-property-list-item text="Example item 1"></d2l-object-property-list-item>
					<d2l-object-property-list-item text="Example item 2"></d2l-object-property-list-item>
					<d2l-object-property-list-item text="Example item 3" hidden id="hidden"></d2l-object-property-list-item>
				</d2l-object-property-list>
			`);
			validateSeparators(elem, 2);

			elem.querySelector('#hidden').removeAttribute('hidden');
			await elem.updateComplete;
			validateSeparators(elem, 3);

			elem.querySelector('#hidden').setAttribute('hidden', '');
			await elem.updateComplete;
			validateSeparators(elem, 2);
		});
	});

});
