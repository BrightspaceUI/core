import '../switch.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

describe('d2l-switch', () => {

	it('off', async() => {
		const elem = await fixture(html`<d2l-switch label="some label"></d2l-switch>`);
		await expect(elem).to.be.accessible;
	});

	it('on', async() => {
		const elem = await fixture(html`<d2l-switch label="some label" on></d2l-switch>`);
		await expect(elem).to.be.accessible;
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-switch label="some label" disabled></d2l-switch>`);
		await expect(elem).to.be.accessible;
	});

	it('hidden label', async() => {
		const elem = await fixture(html`<d2l-switch label="some label" label-hidden></d2l-switch>`);
		await expect(elem).to.be.accessible;
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-switch label="some label"></d2l-switch>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

});
