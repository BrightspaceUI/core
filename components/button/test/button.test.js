import '../button.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const normalFixture = html`<d2l-button>Normal Button</d2l-button>`;
const disabledFixture = html`<d2l-button disabled>Disabled Button</d2l-button>`;
const primaryFixture = html`<d2l-button primary>Primary Button</d2l-button>`;
const primaryDisabledFixture = html`<d2l-button disabled primary>Disabled Primary Button</d2l-button>`;

describe('d2l-button', () => {

	it('dispatches click event when clicked', async() => {
		const el = await fixture(normalFixture);
		setTimeout(() => el.click());
		await oneEvent(el, 'click');
	});

	it('passes all axe tests (normal)', async() => {
		const el = await fixture(normalFixture);
		await expect(el).to.be.accessible();
	});

	it('passes all axe tests (normal, disabled)', async() => {
		const el = await fixture(disabledFixture);
		await expect(el).to.be.accessible();
	});

	it('passes all axe tests (normal, focused)', async() => {
		const el = await fixture(normalFixture);
		setTimeout(() => el.shadowRoot.querySelector('button').focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

	it('passes all axe tests (primary)', async() => {
		const el = await fixture(primaryFixture);
		await expect(el).to.be.accessible();
	});

	it('passes all axe tests (primary, disabled)', async() => {
		const el = await fixture(primaryDisabledFixture);
		await expect(el).to.be.accessible();
	});

	it('passes all axe tests (primary, focused)', async() => {
		const el = await fixture(primaryFixture);
		setTimeout(() => el.shadowRoot.querySelector('button').focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

});
