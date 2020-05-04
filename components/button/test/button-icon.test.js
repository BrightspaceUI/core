import '../button-icon.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const normalFixture = html`<d2l-button-icon icon="d2l-tier1:gear" text="Icon Button"></d2l-button-icon>`;

describe('d2l-button-icon', () => {

	describe('accessibility', () => {

		it('passes all aXe tests (normal)', async() => {
			const el = await fixture(normalFixture);
			await expect(el).to.be.accessible();
		});

		it('passes all aXe tests (disabled)', async() => {
			const el = await fixture(html`<d2l-button-icon disabled icon="d2l-tier1:gear" text="Icon Button"></d2l-button-icon>`);
			await expect(el).to.be.accessible();
		});

		it('passes all aXe tests (focused)', async() => {
			const el = await fixture(normalFixture);
			setTimeout(() => el.shadowRoot.querySelector('button').focus());
			await oneEvent(el, 'focus');
			await expect(el).to.be.accessible();
		});

	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-icon');
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
