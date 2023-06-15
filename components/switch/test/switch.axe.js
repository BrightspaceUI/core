import '../switch.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

describe('d2l-switch', () => {

	it('off', async() => {
		const elem = await fixture(html`<d2l-switch text="some text"></d2l-switch>`);
		await expect(elem).to.be.accessible();
	});

	it('on', async() => {
		const elem = await fixture(html`<d2l-switch text="some text" on></d2l-switch>`);
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-switch text="some text" disabled></d2l-switch>`);
		await expect(elem).to.be.accessible();
	});

	it('hidden label', async() => {
		const elem = await fixture(html`<d2l-switch text="some text" text-position="hidden"></d2l-switch>`);
		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-switch text="some text"></d2l-switch>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

});
