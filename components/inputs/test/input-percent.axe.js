import '../input-percent.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

describe('d2l-input-percent', () => {
	it('normal', async() => {
		const elem = await fixture(html`<d2l-input-percent label="label"></d2l-input-percent>`);
		await expect(elem).to.be.accessible();
	});

	it('default value', async() => {
		const elem = await fixture(html`<d2l-input-percent label="label" value="10"></d2l-input-percent>`);
		await expect(elem).to.be.accessible();
	});

	it('required', async() => {
		const elem = await fixture(html`<d2l-input-percent label="label" required></d2l-input-percent>`);
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-input-percent label="label" disabled></d2l-input-percent>`);
		await expect(elem).to.be.accessible();
	});

	it('placeholder', async() => {
		const elem = await fixture(html`<d2l-input-percent label="label" placeholder="placeholder"></d2l-input-percent>`);
		await expect(elem).to.be.accessible();
	});

	it('hidden label', async() => {
		const elem = await fixture(html`<d2l-input-percent label="label" label-hidden></d2l-input-percent>`);
		await expect(elem).to.be.accessible();
	});

	it('labelled-by', async() => {
		const elem = await fixture(html`<div>
			<d2l-input-percent labelled-by="label"></d2l-input-percent>
			<span id="label">label</span>
		</div>`);
		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-percent label="label"></d2l-input-percent>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});
});
