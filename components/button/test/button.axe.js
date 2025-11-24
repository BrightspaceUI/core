import '../button.js';
import { expect, fixture, focusElem, html, oneEvent } from '@brightspace-ui/testing';

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

	it('aria-label', async() => {
		const el = await fixture(html`<d2l-button aria-label="Custom Button Label">Button</d2l-button>`);
		await expect(el).to.be.accessible();
	});

	it('aria-haspopup', async() => {
		const el = await fixture(html`<d2l-button aria-haspopup="menu">Menu Button</d2l-button>`);
		await expect(el).to.be.accessible();
	});

	it('expanded', async() => {
		const el = await fixture(html`<d2l-button expanded="true">Expandable Button</d2l-button>`);
		await expect(el).to.be.accessible();
	});

	it('aria-haspopup and expanded', async() => {
		const el = await fixture(html`<d2l-button aria-haspopup="menu" expanded="true">Menu Button</d2l-button>`);
		await expect(el).to.be.accessible();
	});

	it('focused', async() => {
		const el = await fixture(html`<d2l-button>Button</d2l-button>`);
		await focusElem(el);
		await expect(el).to.be.accessible();
	});

});
