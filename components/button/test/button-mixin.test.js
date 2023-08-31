import { defineCE, expect, fixture } from '@brightspace-ui/testing';
import { html, LitElement } from 'lit';
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

	describe('default property values', () => {

		it('should default "type" property to "button"', async() => {
			const el = await fixture(`<${tagName}></${tagName}>`);
			expect(el.type).to.equal('button');
		});

	});

	describe('events', () => {

		it('should stop propagation of click events if button is disabled', async() => {
			const el = await fixture(`<${tagName} disabled></${tagName}>`);
			expect(() => el.click()).to.not.throw();
		});

		it('should stop propagation of click events if button is disabled with disabled-tooltip', async() => {
			const el = await fixture(`<${tagName} disabled disabled-tooltip="tooltip text"></${tagName}>`);
			expect(() => el.click()).to.not.throw();
		});

	});

});
