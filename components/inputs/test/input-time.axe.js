import '../input-time.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { inlineHelpFixtures } from './input-shared-content.js';

describe('d2l-input-time', () => {

	it('normal', async() => {
		const elem = await fixture(html`<d2l-input-time label="label text" time-interval="sixty"></d2l-input-time>`);
		await expect(elem).to.be.accessible();
	});

	it('label is hidden', async() => {
		const elem = await fixture(html`<d2l-input-time label="label text" label-hidden time-interval="sixty"></d2l-input-time>`);
		await expect(elem).to.be.accessible({ ignoredRules: ['color-contrast'] }); //Color-contrast is slow and hidden label uses the same colors as default
	});

	it('labelled-by', async() => {
		const elem = await fixture(html`<div>
			<d2l-input-time labelled-by="label" time-interval="sixty"></d2l-input-time>
			<span id="label">label text</span>
		</div>`);
		await expect(elem).to.be.accessible({ ignoredRules: ['color-contrast'] }); //Color-contrast is slow and hidden label uses the same colors as default
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-input-time label="label text" time-interval="sixty" disabled></d2l-input-time>`);
		await expect(elem).to.be.accessible();
	});

	it('focused', async() => {
		const elem = await fixture(html`<d2l-input-time label="label text" time-interval="sixty"></d2l-input-time>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		await expect(elem).to.be.accessible();
	});

	it('required', async() => {
		const elem = await fixture(html`<d2l-input-time label="label text" required></d2l-input-time>`);
		await expect(elem).to.be.accessible();
	});

	it('inline-help', async() => {
		const elem = await fixture(new inlineHelpFixtures().time());
		await expect(elem).to.be.accessible();
	});
});
