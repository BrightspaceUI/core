import '../input-date.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { inlineHelpFixtures } from './input-shared-content.js';

describe('d2l-input-date', () => {

	it('normal', async() => {
		const elem = await fixture(html`<d2l-input-date label="label text"></d2l-input-date>`);
		await expect(elem).to.be.accessible();
	});

	it('hidden label', async() => {
		const elem = await fixture(html`<d2l-input-date label="label text" label-hidden></d2l-input-date>`);
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-input-date label="label text" disabled></d2l-input-date>`);
		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-date label="label text"></d2l-input-date>`);
		setTimeout(() => elem.shadowRoot.querySelector('d2l-input-text').focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

	it('required', async() => {
		const elem = await fixture(html`<d2l-input-date label="label text" required></d2l-input-date>`);
		await expect(elem).to.be.accessible();
	});

	it('labelled-by', async() => {
		const elem = await fixture(html`<div>
			<d2l-input-date labelled-by="label"></d2l-input-date>
			<span id="label">label text</span>
		</div>`);
		await expect(elem).to.be.accessible();
	});

	it('inline-help', async() => {
		const elem = await fixture(new inlineHelpFixtures().date());
		await expect(elem).to.be.accessible();
	});

});
