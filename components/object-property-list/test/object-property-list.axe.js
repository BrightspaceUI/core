import '../object-property-list.js';
import '../object-property-list-item.js';
import '../object-property-list-item-link.js';
import '../../status-indicator/status-indicator.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-object-property-list', () => {

	it('should pass all aXe tests', async() => {
		const elem = await fixture(html`
			<d2l-object-property-list>
				<d2l-status-indicator slot="status" state="default" text="Status"></d2l-status-indicator>
				<d2l-object-property-list-item text="Example item"></d2l-object-property-list-item>
				<d2l-object-property-list-item text="Example item with icon" icon="tier1:grade"></d2l-object-property-list-item>
				<d2l-object-property-list-item-link text="Example link" href="https://www.d2l.com/"></d2l-object-property-list-item-link>
				<d2l-object-property-list-item-link text="Example link with icon" href="https://www.d2l.com/" icon="tier1:alert"></d2l-object-property-list-item-link>
			</d2l-object-property-list>
		`);
		await expect(elem).to.be.accessible();
	});

});
