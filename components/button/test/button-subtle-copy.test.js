import '../button-subtle-copy.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-button-subtle-copy', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-subtle-copy');
		});

	});

	describe('attributes', () => {

		it('disabled attribute disables the button', async() => {
			const el = await fixture(html`<d2l-button-subtle-copy disabled></d2l-button-subtle-copy>`);
			const buttonSubtle = el.shadowRoot.querySelector('d2l-button-subtle');
			expect(buttonSubtle.disabled).to.be.true;
		});

		it('text attribute is required for accessibility', async() => {
			const el = await fixture(html`<d2l-button-subtle-copy text="Copy this!"></d2l-button-subtle-copy>`);
			const buttonSubtle = el.shadowRoot.querySelector('d2l-button-subtle');
			expect(buttonSubtle.text).to.equal('Copy this!');
		});

		it('slim attribute makes the button slimmer', async() => {
			const el = await fixture(html`<d2l-button-subtle-copy slim></d2l-button-subtle-copy>`);
			const buttonSubtle = el.shadowRoot.querySelector('d2l-button-subtle');
			expect(buttonSubtle.slim).to.be.true;
		});

		it('description attribute is added to the button for accessibility', async() => {
			const el = await fixture(html`<d2l-button-subtle-copy description="This is a description."></d2l-button-subtle-copy>`);
			const buttonSubtle = el.shadowRoot.querySelector('d2l-button-subtle');
			expect(buttonSubtle.description).to.equal('This is a description.');
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button-subtle-copy text="Copy"></d2l-button-subtle-copy>`);
			clickElem(el);
			await oneEvent(el, 'click');
		});

		it('does not dispatch click event when disabled', async() => {
			const el = await fixture(html`<d2l-button-subtle-copy disabled text="Copy"></d2l-button-subtle-copy>`);
			let dispatched = false;
			el.addEventListener('click', () => dispatched = true);
			await clickElem(el);
			expect(dispatched).to.be.false;
		});

		it('stops propagation when clicked', async() => {
			const el = await fixture(html`<d2l-button-subtle-copy text="Copy"></d2l-button-subtle-copy>`);
			let propagated = false;
			el.parentElement.addEventListener('click', () => propagated = true);
			const buttonSubtle = el.shadowRoot.querySelector('d2l-button-subtle');
			clickElem(buttonSubtle);
			await oneEvent(el, 'click');
			expect(propagated).to.be.false;
		});

	});

});
