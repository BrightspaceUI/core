import '../input-textarea.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { inlineHelpTextAreaFixtures } from './input-textarea.vdiff.js';

describe('d2l-input-textarea', () => {

	it('normal', async() => {
		const elem = await fixture(html`<d2l-input-textarea label="label"></d2l-input-textarea>`);
		await expect(elem).to.be.accessible();
	});

	it('with value', async() => {
		const elem = await fixture(html`<d2l-input-textarea label="label" value="hello"></d2l-input-textarea>`);
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-input-textarea label="label" disabled></d2l-input-textarea>`);
		await expect(elem).to.be.accessible();
	});

	it('invalid', async() => {
		const elem = await fixture(html`<d2l-input-textarea label="label" aria-invalid="true"></d2l-input-textarea>`);
		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-textarea label="label"></d2l-input-textarea>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

	it('hidden label', async() => {
		const elem = await fixture(html`<d2l-input-textarea label="label" label-hidden></d2l-input-textarea>`);
		await expect(elem).to.be.accessible();
	});

	it('labelled-by', async() => {
		const elem = await fixture(html`<div>
			<d2l-input-textarea labelled-by="label"></d2l-input-textarea>
			<span id="label">label</span>
		</div>`);
		await expect(elem).to.be.accessible();
	});

	it('no border', async() => {
		const elem = await fixture(html`<d2l-input-textarea label="label" no-border></d2l-input-textarea>`);
		await expect(elem).to.be.accessible();
	});

	it('inline-help', async() => {
		const elem = await fixture(inlineHelpTextAreaFixtures.normal);
		await expect(elem).to.be.accessible();
	});

});
