import '../input-text.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { inlineHelpFixtures } from './input-shared-content.js';

describe('d2l-input-text', () => {

	it('normal', async() => {
		const elem = await fixture(html`<d2l-input-text label="label"></d2l-input-text>`);
		await expect(elem).to.be.accessible();
	});

	it('with value', async() => {
		const elem = await fixture(html`<d2l-input-text label="label" value="hello"></d2l-input-text>`);
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-input-text label="label" disabled></d2l-input-text>`);
		await expect(elem).to.be.accessible();
	});

	it('invalid', async() => {
		const elem = await fixture(html`<d2l-input-text label="label" aria-invalid="true"></d2l-input-text>`);
		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-text label="label"></d2l-input-text>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

	it('hidden label', async() => {
		const elem = await fixture(html`<d2l-input-text label="label" label-hidden></d2l-input-text>`);
		await expect(elem).to.be.accessible();
	});

	it('labelled-by', async() => {
		const elem = await fixture(html`<div>
			<d2l-input-text labelled-by="label"></d2l-input-text>
			<span id="label">label</span>
		</div>`);
		await expect(elem).to.be.accessible();
	});

	it('aria-label', async() => {
		const elem = await fixture(html`<d2l-input-text aria-label="label"></d2l-input-text>`);
		await expect(elem).to.be.accessible();
	});

	it('description', async() => {
		const elem = await fixture(html`<d2l-input-text label="label" description="description"></d2l-input-text>`);
		await expect(elem).to.be.accessible();
	});

	it('instructions', async() => {
		const elem = await fixture(html`<d2l-input-text label="label" instructions="some instructions"></d2l-input-text>`);
		await expect(elem).to.be.accessible();
	});

	it('inline-help', async() => {
		const elem = await fixture(new inlineHelpFixtures().text());
		await expect(elem).to.be.accessible();
	});

});
