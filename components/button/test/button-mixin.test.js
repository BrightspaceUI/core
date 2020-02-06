import { defineCE, expect, fixture, oneEvent } from '@open-wc/testing';
import { html, LitElement } from 'lit-element/lit-element.js';
import { ButtonMixin } from '../button-mixin.js';

const tagName = defineCE(
	class extends ButtonMixin(LitElement) {
		render() {
			return html`
				<button>Test Button</button>
			`;
		}
	}
);

describe('ButtonMixin', () => {

	let documentClickHandler;

	before(() => {
		documentClickHandler = () => {
			throw new Error('click event propagated to document');
		};
		document.addEventListener('click', documentClickHandler, {once: true});
	});

	after(() => {
		document.removeEventListener('click', documentClickHandler);
	});

	describe('default property values', () => {

		it('should default "type" property to "button"', async() => {
			const el = await fixture(`<${tagName}></${tagName}`);
			expect(el.type).to.equal('button');
		});

	});

	describe('events', () => {

		it('should stop propagation of click events if button is disabled', async() => {
			const el = await fixture(`<${tagName} disabled></${tagName}`);
			expect(() => el.click()).to.not.throw();
		});

	});

	describe('focus management', () => {

		it('should delegate focus to button', async() => {
			const el = await fixture(`<${tagName}></${tagName}`);
			const buttonEl = el.shadowRoot.querySelector('button');
			setTimeout(() => el.focus());
			await oneEvent(buttonEl, 'focus');
		});

	});

});
