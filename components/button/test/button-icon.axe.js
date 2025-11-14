import '../button-icon.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

describe('d2l-button-icon', () => {

	it('normal', async() => {
		const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
		await expect(el).to.be.accessible();
	});

	it('disabled', async() => {
		const el = await fixture(html`<d2l-button-icon disabled icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
		await expect(el).to.be.accessible();
	});

	it('disabled-tooltip', async() => {
		const el = await fixture(html`<d2l-button-icon disabled disabled-tooltip="tooltip text" icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
		await expect(el).to.be.accessible();
	});

	it('focused', async() => {
		const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
		setTimeout(() => el.focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

	it('description', async() => {
		const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" description="Additional context"></d2l-button-icon>`);
		await expect(el).to.be.accessible();
	});

	it('custom icon', async() => {
		const el = await fixture(html`
			<d2l-button-icon text="Custom Icon Button">
				<d2l-icon-custom slot="icon">
					<svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
						<path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
					</svg>
				</d2l-icon-custom>
			</d2l-button-icon>
		`);
		await expect(el).to.be.accessible();
	});

	it('aria-label', async() => {
		const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" aria-label="Custom Label"></d2l-button-icon>`);
		await expect(el).to.be.accessible();
	});

	it('expanded', async() => {
		const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" expanded="true"></d2l-button-icon>`);
		await expect(el).to.be.accessible();
	});

	it('aria-expanded', async() => {
		const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" aria-expanded="false"></d2l-button-icon>`);
		await expect(el).to.be.accessible();
	});

	it('aria-haspopup', async() => {
		const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" aria-haspopup="menu"></d2l-button-icon>`);
		await expect(el).to.be.accessible();
	});

});
