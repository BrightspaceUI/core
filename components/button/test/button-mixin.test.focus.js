import { defineCE, fixture, oneEvent } from '@open-wc/testing';
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
		document.addEventListener('click', documentClickHandler, { once: true });
	});

	after(() => {
		document.removeEventListener('click', documentClickHandler, { once: true });
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
