import '../object-property-list-item.js';
import { expect, fixture, html } from '@open-wc/testing';

const getIcon = item => item.shadowRoot.querySelector('.item-icon');

describe('d2l-object-property-list-item', () => {

	it('should show/hide the icon when its property is changed', async() => {
		const elem = await fixture(html`<d2l-object-property-list-item text="Example item"></d2l-object-property-list-item>`);
		expect(getIcon(elem)).to.be.null;

		elem.icon = 'emoji:happy';
		await elem.updateComplete;
		expect(getIcon(elem)).not.to.be.null;
	});

});
