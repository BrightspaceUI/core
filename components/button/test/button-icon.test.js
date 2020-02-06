import '../button-icon.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const normalFixture = html`<d2l-button-icon icon="d2l-tier1:gear" text="Icon Button"></d2l-button-icon>`;
const disabledFixture = html`<d2l-button-icon disabled icon="d2l-tier1:gear" text="Icon Button"></d2l-button-icon>`;

describe('d2l-button-icon', () => {

	it('dispatches click event when clicked', async() => {
		const el = await fixture(normalFixture);
		setTimeout(() => el.click());
		await oneEvent(el, 'click');
	});

	it('passes all axe tests (normal)', async() => {
		const el = await fixture(normalFixture);
		await expect(el).to.be.accessible();
	});

	it('passes all axe tests (disabled)', async() => {
		const el = await fixture(disabledFixture);
		await expect(el).to.be.accessible();
	});

	it('passes all axe tests (focused)', async() => {
		const el = await fixture(normalFixture);
		setTimeout(() => el.shadowRoot.querySelector('button').focus());
		await oneEvent(el, 'focus');
		await expect(el).to.be.accessible();
	});

});
