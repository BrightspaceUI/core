import '../button-copy.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-button-copy', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-copy');
		});

	});

	describe('attributes', () => {

		it('disabled attribute disables the button', async() => {
			const el = await fixture(html`<d2l-button-copy disabled></d2l-button-copy>`);
			const buttonIcon = el.shadowRoot.querySelector('d2l-button-icon');
			expect(buttonIcon.disabled).to.be.true;
		});

		it('button text defaults to localized "Copy" string', async() => {
			const el = await fixture(html`<d2l-button-copy></d2l-button-copy>`);
			const buttonIcon = el.shadowRoot.querySelector('d2l-button-icon');
			expect(buttonIcon.text).to.equal(el.localize('intl-common:actions:copy'));
		});

		it('button text can be set via text attribute', async() => {
			const el = await fixture(html`<d2l-button-copy text="Custom text!"></d2l-button-copy>`);
			const buttonIcon = el.shadowRoot.querySelector('d2l-button-icon');
			expect(buttonIcon.text).to.equal('Custom text!');
		});
	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button-copy></d2l-button-copy>`);
			clickElem(el);
			await oneEvent(el, 'click');
		});

		it('does not dispatch click event when disabled', async() => {
			const el = await fixture(html`<d2l-button-copy disabled></d2l-button-copy>`);
			let dispatched = false;
			el.addEventListener('click', () => dispatched = true);
			await clickElem(el);
			expect(dispatched).to.be.false;
		});

		it('stops propagation when clicked', async() => {
			const el = await fixture(html`<d2l-button-copy></d2l-button-copy>`);
			let propagated = false;
			el.parentElement.addEventListener('click', () => propagated = true);
			const buttonIcon = el.shadowRoot.querySelector('d2l-button-icon');
			clickElem(buttonIcon);
			await oneEvent(el, 'click');
			expect(propagated).to.be.false;
		});

	});

});
