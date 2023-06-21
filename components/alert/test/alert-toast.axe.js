import '../alert-toast.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-alert-toast', () => {

	it('closed', async() => {
		const el = await fixture(html`<d2l-alert-toast>message</d2l-alert-toast>`);
		await expect(el).to.be.accessible();
	});

	it('open', async() => {
		const el = await fixture(html`<d2l-alert-toast open>message</d2l-alert-toast>`);
		await expect(el).to.be.accessible();
	});

	it('button-text', async() => {
		const el = await fixture(html`<d2l-alert-toast open button-text="click">message</d2l-alert-toast>`);
		await expect(el).to.be.accessible();
	});

	it('subtext', async() => {
		const el = await fixture(html`<d2l-alert-toast open subtext="subtext">message</d2l-alert-toast>`);
		await expect(el).to.be.accessible();
	});

	it('should have status alert when open', async() => {
		const el = await fixture(html`<d2l-alert-toast open>message</d2l-alert-toast>`);
		expect(el.getAttribute('role')).to.equal('alert');
	});

});
