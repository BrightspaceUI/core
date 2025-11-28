import '../button-subtle.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

describe('d2l-button-subtle', () => {

	it('normal', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('normal + disabled', async() => {
		const el = await fixture(html`<d2l-button-subtle disabled text="Disabled Subtle Button"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('normal + disabled + disabled-tooltip', async() => {
		const el = await fixture(html`<d2l-button-subtle disabled disabled-tooltip="tooltip text" text="Disabled Subtle Button"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('normal + focused', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
		setTimeout(() => el.focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

	it('icon', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button with Icon" icon="tier1:gear"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('icon + disabled', async() => {
		const el = await fixture(html`<d2l-button-subtle disabled text="Subtle Button with Icon" icon="tier1:gear"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('icon + focused', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button with Icon" icon="tier1:gear"></d2l-button-subtle>`);
		setTimeout(() => el.focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

	it('description', async() => {
		const el = await fixture(html`<d2l-button-subtle text="primary" description="secondary"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();

		const btnElem = el.shadowRoot.querySelector('button');
		const description = el.shadowRoot.querySelector(`#${btnElem.getAttribute('aria-describedby')}`);
		expect(description.innerText).to.equal('secondary');
	});

	it('aria-label', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button" aria-label="Custom Label"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('expanded', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button" expanded="true"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('aria-expanded', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button" aria-expanded="false"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('aria-haspopup', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button" aria-haspopup="menu"></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('custom icon', async() => {
		const el = await fixture(html`
			<d2l-button-subtle text="Subtle Button">
				<d2l-icon-custom slot="icon">
					<svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
						<path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
					</svg>
				</d2l-icon-custom>
			</d2l-button-subtle>
		`);
		await expect(el).to.be.accessible();
	});

	it('slim', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button" slim></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('icon-right', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button" icon="tier1:gear" icon-right></d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

	it('slot content', async() => {
		const el = await fixture(html`<d2l-button-subtle text="Subtle Button">Slot Content</d2l-button-subtle>`);
		await expect(el).to.be.accessible();
	});

});
