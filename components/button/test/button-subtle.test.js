import '../button-subtle.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const normalFixture = html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`;
const iconFixture = html`<d2l-button-subtle text="Subtle Button with Icon" icon="d2l-tier1:gear"></d2l-button-subtle>`;

describe('d2l-button', () => {

	describe('accessibility', () => {

		it('passes all aXe tests (normal)', async() => {
			const el = await fixture(normalFixture);
			await expect(el).to.be.accessible();
		});

		it('passes all aXe tests (normal, disabled)', async() => {
			const el = await fixture(html`<d2l-button-subtle disabled text="Disabled Subtle Button"></d2l-button-subtle>`);
			await expect(el).to.be.accessible();
		});

		it('passes all aXe tests (normal, focused)', async() => {
			const el = await fixture(normalFixture);
			setTimeout(() => el.shadowRoot.querySelector('button').focus());
			await oneEvent(el, 'focus');
			await expect(el).to.be.accessible();
		});

		it('passes all aXe tests (icon)', async() => {
			const el = await fixture(iconFixture);
			await expect(el).to.be.accessible();
		});

		it('passes all aXe tests (icon, disabled)', async() => {
			const el = await fixture(html`<d2l-button-subtle disabled text="Subtle Button with Icon" icon="d2l-tier1:gear"></d2l-button-subtle>`);
			await expect(el).to.be.accessible();
		});

		it('passes all aXe tests (icon, focused)', async() => {
			const el = await fixture(iconFixture);
			setTimeout(() => el.shadowRoot.querySelector('button').focus());
			await oneEvent(el, 'focus');
			await expect(el).to.be.accessible();
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(normalFixture);
			setTimeout(() => el.click());
			await oneEvent(el, 'click');
		});

	});

});
