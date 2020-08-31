import '../card-footer-link.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-card-footer-link', () => {

	it('default', async() => {
		const elem = await fixture(html`<d2l-card-footer-link href="https://www.d2l.com" icon="tier1:assignments" text="Assignments"></d2l-card-footer-link>`);
		await expect(elem).to.be.accessible;
	});

	it('secondary notification text', async() => {
		const elem = await fixture(html`<d2l-card-footer-link href="https://www.d2l.com" icon="tier1:assignments" text="Assignments" secondary-text="3" secondary-text-type="notification"></d2l-card-footer-link>`);
		await expect(elem).to.be.accessible;
	});

	it('secondary count text', async() => {
		const elem = await fixture(html`<d2l-card-footer-link href="https://www.d2l.com" icon="tier1:assignments" text="Assignments" secondary-text="3" secondary-text-type="count"></d2l-card-footer-link>`);
		await expect(elem).to.be.accessible;
	});

});
