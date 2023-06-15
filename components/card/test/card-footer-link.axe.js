import '../card-footer-link.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-card-footer-link', () => {

	it('default', async() => {
		const elem = await fixture(html`<d2l-card-footer-link href="https://www.d2l.com" icon="tier1:assignments" text="Assignments"></d2l-card-footer-link>`);
		await expect(elem).to.be.accessible();
	});

	it('secondary notification text', async() => {
		const elem = await fixture(html`<d2l-card-footer-link href="https://www.d2l.com" icon="tier1:assignments" text="Assignments" secondary-count="3" secondary-count-type="notification"></d2l-card-footer-link>`);
		await expect(elem).to.be.accessible();
	});

	it('secondary count text', async() => {
		const elem = await fixture(html`<d2l-card-footer-link href="https://www.d2l.com" icon="tier1:assignments" text="Assignments" secondary-count="3" secondary-count-type="count"></d2l-card-footer-link>`);
		await expect(elem).to.be.accessible();
	});

});
