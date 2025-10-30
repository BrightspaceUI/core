import '../alert-toast.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

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
		expect(el.shadowRoot.querySelector('d2l-alert').getAttribute('role')).to.equal('alert');
	});

	it('role removed when closed', async() => {
		const el = await fixture(html`<d2l-alert-toast open>message</d2l-alert-toast>`);
		await el.updateComplete;
		el.open = false;
		await oneEvent(el, 'd2l-alert-toast-close');
		expect(el.shadowRoot.querySelector('d2l-alert').getAttribute('role')).to.be.null;
	});

	it('hide-close-button variant accessible', async() => {
		const el = await fixture(html`<d2l-alert-toast open hide-close-button>message</d2l-alert-toast>`);
		await expect(el).to.be.accessible();
	});

	it('no-auto-close variant accessible', async() => {
		const el = await fixture(html`<d2l-alert-toast open no-auto-close button-text="act" subtext="more info">message</d2l-alert-toast>`);
		await expect(el).to.be.accessible();
	});

	it('multiple stacked accessible', async() => {
		const container = await fixture(html`<div>
			<d2l-alert-toast open type="success">One</d2l-alert-toast>
			<d2l-alert-toast open type="warning" button-text="Do it">Two action</d2l-alert-toast>
			<d2l-alert-toast open type="critical" subtext="Details">Three critical</d2l-alert-toast>
		</div>`);
		await expect(container).to.be.accessible();
	});

});
