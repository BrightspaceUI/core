import '../button.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';

const normalFixture = html`<d2l-button>Normal Button</d2l-button>`;
const primaryFixture = html`<d2l-button primary>Primary Button</d2l-button>`;

describe('d2l-button', () => {

	it('normal', async() => {
		const el = await fixture(normalFixture);
		await expect(el).to.be.accessible();
	});

	it('normal + disabled', async() => {
		const el = await fixture(html`<d2l-button disabled>Disabled Button</d2l-button>`);
		await expect(el).to.be.accessible();
	});

	it('normal + disabled + disabled-tooltip', async() => {
		const el = await fixture(html`<d2l-button disabled disabled-tooltip="tooltip text">Disabled Button</d2l-button>`);
		await expect(el).to.be.accessible();
	});

	it('normal + focused', async() => {
		const el = await fixture(normalFixture);
		setTimeout(() => el.focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

	it('primary', async() => {
		const el = await fixture(primaryFixture);
		await expect(el).to.be.accessible();
	});

	it('primary + disabled', async() => {
		const el = await fixture(html`<d2l-button disabled primary>Disabled Primary Button</d2l-button>`);
		await expect(el).to.be.accessible();
	});

	it('primary + focused', async() => {
		const el = await fixture(primaryFixture);
		setTimeout(() => el.focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

	it('description', async() => {
		const el = await fixture(html`<d2l-button description="secondary">primary</d2l-button>`);
		await expect(el).to.be.accessible();

		const btnElem = el.shadowRoot.querySelector('button');
		const description = el.shadowRoot.querySelector(`#${btnElem.getAttribute('aria-describedby')}`);
		expect(description.innerText).to.equal('secondary');
	});

});
