import { clickElem, expect, fixture, focusElem, oneEvent } from '@brightspace-ui/testing';
import { hide, show } from '../animate.js';
import { html, LitElement } from 'lit';
import { getComposedActiveElement } from '../../../helpers/focus.js';

class FocusTestElem extends LitElement {

	static get properties() {
		return {
			animate: { type: Boolean }
		};
	}

	render() {
		const animateValue = this.animate ? hide() : undefined;
		return html`
			<button id="first" .animate="${animateValue}" @d2l-animate-complete="${this._dispatchEvent}">first</button>
			<button id="second">second</button>
		`;
	}

	_dispatchEvent() {
		this.dispatchEvent(new CustomEvent('d2l-animate-test-focus-animate-complete'));
	}

}
customElements.define('d2l-animate-test-focus', FocusTestElem);

describe('animate directive', () => {

	describe('events', () => {

		it('should fire "complete" event with show()', async() => {
			const elem = await fixture(html`<div .animate="${show()}">hello world</div>`);
			await oneEvent(elem, 'd2l-animate-complete');
		});

		it('should fire "complete" event with hide()', async() => {
			const elem = await fixture(html`<div .animate="${hide()}">hello world</div>`);
			await oneEvent(elem, 'd2l-animate-complete');
		});

	});

	describe('host element state', () => {

		it('should restore inline style attribute', async() => {

			const elem = await fixture(html`<div style="position: absolute; opacity: 0.5;" .animate="${show()}">hello world</div>`);
			await oneEvent(elem, 'd2l-animate-complete');

			expect(elem.getAttribute('style')).to.equal('position: absolute; opacity: 0.5;');

			const style = window.getComputedStyle(elem);
			expect(style.position).to.equal('absolute');
			expect(style.opacity).to.equal('0.5');

		});

		it('should add the "hidden" attribute', async() => {
			const elem = await fixture(html`<div .animate="${hide()}">hello world</div>`);
			await oneEvent(elem, 'd2l-animate-complete');
			expect(elem.hasAttribute('hidden')).to.be.true;
		});

		it('should remove the "hidden" attribute', async() => {
			const elem = await fixture(html`<div .animate="${show()}" hidden>hello world</div>`);
			await oneEvent(elem, 'd2l-animate-complete');
			expect(elem.hasAttribute('hidden')).to.be.false;
		});

	});

	describe('focus management', () => {

		it('should move focus when element with visible focus is hidden', async() => {

			const elem = await fixture(html`<d2l-animate-test-focus></d2l-animate-test-focus>`);
			await focusElem(elem.shadowRoot.querySelector('#first'));
			elem.animate = true;
			await oneEvent(elem, 'd2l-animate-test-focus-animate-complete');

			expect(getComposedActiveElement()).to.equal(elem.shadowRoot.querySelector('#second'));

		});

		it('should not move focus when element with non-visible focus is hidden', async() => {

			const elem = await fixture(html`<d2l-animate-test-focus></d2l-animate-test-focus>`);
			await clickElem(elem.shadowRoot.querySelector('#first'));
			elem.animate = true;
			await oneEvent(elem, 'd2l-animate-test-focus-animate-complete');

			expect(getComposedActiveElement()).to.not.equal(elem.shadowRoot.querySelector('#second'));
		});

	});

});
