import '../menu.js';
import '../menu-item.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-menu', () => {

	it('should pass all aXe tests', async() => {
		const elem = await fixture(html`
			<d2l-menu label="menu label">
				<d2l-menu-item></d2l-menu-item>
				<d2l-menu-item></d2l-menu-item>
			</d2l-menu>
		`);
		await expect(elem).to.be.accessible;
	});

});
