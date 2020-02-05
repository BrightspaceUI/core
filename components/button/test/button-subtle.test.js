import '../button-subtle.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const normalFixture = html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`;
const disabledFixture = html`<d2l-button-subtle disabled text="Disabled Subtle Button"></d2l-button-subtle>`;
const iconFixture = html`<d2l-button-subtle text="Subtle Button with Icon" icon="d2l-tier1:gear"></d2l-button-subtle>`;
const iconDisabledFixture = html`<d2l-button-subtle disabled text="Subtle Button with Icon" icon="d2l-tier1:gear"></d2l-button-subtle>`;

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

	it('passes all axe tests (icon)', async() => {
		const el = await fixture(iconFixture);
		await expect(el).to.be.accessible();
	});

	it('passes all axe tests (icon, disabled)', async() => {
		const el = await fixture(iconDisabledFixture);
		await expect(el).to.be.accessible();
	});

	it('passes all axe tests (icon, focused)', async() => {
		const el = await fixture(iconFixture);
		setTimeout(() => el.shadowRoot.querySelector('button').focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

});
