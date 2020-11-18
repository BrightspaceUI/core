import '../switch.js';
import { expect, fixture, html } from '@open-wc/testing';

describe('d2l-switch', () => {

	it('off', async() => {
		const elem = await fixture(html`<d2l-switch text="some text"></d2l-switch>`);
		await expect(elem).to.be.accessible;
	});

	it('on', async() => {
		const elem = await fixture(html`<d2l-switch text="some text" on></d2l-switch>`);
		await expect(elem).to.be.accessible;
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-switch text="some text" disabled></d2l-switch>`);
		await expect(elem).to.be.accessible;
	});

	it('tooltip', async() => {
		const elem = await fixture(html`<d2l-switch text="some text" tooltip="tooltip text"></d2l-switch>`);
		await expect(elem).to.be.accessible;
	});

	it('hidden label', async() => {
		const elem = await fixture(html`<d2l-switch text="some text" text-position="hidden"></d2l-switch>`);
		await expect(elem).to.be.accessible;
	});

});
