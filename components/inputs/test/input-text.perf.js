import '../input-text.js';
import { expect, html } from '@open-wc/testing';

describe('d2l-input-text', () => {

	it('normal', async() => {
		await expect(html`<d2l-input-text label="label"></d2l-input-text>`)
			.to.be.performant(1500);
	});

	it('slots', async() => {
		await expect(html`<d2l-input-text label="label">
			<span slot="left">left</span>
			<span slot="right">right</span>
			<span slot="after">after</span>
		</d2l-input-text>`).to.be.performant(1500);
	});

	it('unit', async() => {
		await expect(html`<d2l-input-text label="label" unit="%"></d2l-input-text>`)
			.to.be.performant(1500);
	});

});
