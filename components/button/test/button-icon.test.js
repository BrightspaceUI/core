import '../button-icon.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const normalFixture = html`<d2l-button-icon icon="d2l-tier1:gear" text="Icon Button"></d2l-button-icon>`;
const labelFixture = html`<d2l-button-icon icon="d2l-tier1:gear" aria-label="Icon Button"></d2l-button-icon>`;
const labelAndTextFixture = html`<d2l-button-icon icon="d2l-tier1:gear" aria-label="Icon Button" text="This is the rest"></d2l-button-icon>`;

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

		it('should be labelled-by its tooltip when text is present', async() => {
			const el = await fixture(normalFixture);
			const innerButton = el.shadowRoot.querySelector('button');
			expect(innerButton.hasAttribute('aria-label')).to.be.false;
			expect(innerButton.hasAttribute('aria-labelledby')).to.be.true;
		});

		it('should be labelled-by its tooltip when aria-label is present', async() => {
			const el = await fixture(labelFixture);
			const innerButton = el.shadowRoot.querySelector('button');
			expect(innerButton.hasAttribute('aria-label')).to.be.false;
			expect(innerButton.hasAttribute('aria-labelledby')).to.be.true;
		});

		it('should be described-by its tooltip and have a label when text and an aria-label are present', async() => {
			const el = await fixture(labelAndTextFixture);
			const innerButton = el.shadowRoot.querySelector('button');
			expect(innerButton.getAttribute('aria-label')).to.equal(el.getAttribute('aria-label'));
			expect(innerButton.hasAttribute('aria-describedby')).to.be.true;
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
