import { clickElem, defineCE, expect, fixture, oneEvent } from '@brightspace-ui/testing';
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

	describe('default property values', () => {

		it('should default "type" property to "button"', async() => {
			const el = await fixture(`<${tagName}></${tagName}>`);
			expect(el.type).to.equal('button');
		});

		it('should default "disabled" property to false', async() => {
			const el = await fixture(`<${tagName}></${tagName}>`);
			expect(el.disabled).to.be.false;
		});

		it('should default "autofocus" property to false', async() => {
			const el = await fixture(`<${tagName}></${tagName}>`);
			expect(el.autofocus).to.be.false;
		});

	});

	describe('properties', () => {

		describe('expanded', () => {

			it('should sync expanded from ariaExpanded', async() => {
				const el = await fixture(`<${tagName} aria-expanded="true"></${tagName}>`);
				expect(el.expanded).to.equal('true');
			});

			it('should sync expanded from ariaExpanded when different', async() => {
				const el = await fixture(`<${tagName} aria-expanded="false" expanded="true"></${tagName}>`);
				expect(el.expanded).to.equal('false');
			});

			it('should not sync expanded when ariaExpanded is undefined', async() => {
				const el = await fixture(`<${tagName} expanded="true"></${tagName}>`);
				expect(el.expanded).to.equal('true');
			});
		});

	});

	describe('static properties', () => {

		it('should have focusElementSelector return "button"', () => {
			const el = document.createElement(tagName);
			expect(el.constructor.focusElementSelector).to.equal('button');
		});

	});

	describe('getters', () => {

		it('should have isButtonMixin return true', async() => {
			const el = await fixture(`<${tagName}></${tagName}>`);
			expect(el.isButtonMixin).to.be.true;
		});

	});

	describe('protected methods', () => {

		describe('_getType', () => {
			it('should return "submit" when type is "submit"', async() => {
				const el = await fixture(`<${tagName} type="submit"></${tagName}>`);
				expect(el._getType()).to.equal('submit');
			});

			it('should return "reset" when type is "reset"', async() => {
				const el = await fixture(`<${tagName} type="reset"></${tagName}>`);
				expect(el._getType()).to.equal('reset');
			});

			it('should return "button" when type is "button"', async() => {
				const el = await fixture(`<${tagName} type="button"></${tagName}>`);
				expect(el._getType()).to.equal('button');
			});

			it('should return "button" for any other type value', async() => {
				const el = await fixture(`<${tagName} type="custom"></${tagName}>`);
				expect(el._getType()).to.equal('button');
			});
		});

	});

	describe('disabled button events', () => {

		let documentClickHandler;

		beforeEach(() => {
			documentClickHandler = () => {
				throw new Error('click event propagated to document');
			};
			document.addEventListener('click', documentClickHandler, { once: true });
		});

		afterEach(() => {
			document.removeEventListener('click', documentClickHandler, { once: true });
		});

		it('should stop propagation of click events if button is disabled', async() => {
			const el = await fixture(`<${tagName} disabled></${tagName}>`);
			expect(() => clickElem(el)).to.not.throw();
		});

		it('should stop propagation of click events if button is disabled with disabled-tooltip', async() => {
			const el = await fixture(`<${tagName} disabled disabled-tooltip="tooltip text"></${tagName}>`);
			expect(() => clickElem(el)).to.not.throw();
		});

	});

	describe('events', () => {

		it('should allow click event propagation when not disabled', async() => {
			const el = await fixture(`<${tagName}></${tagName}>`);
			clickElem(el);
			await oneEvent(el, 'click');
		});

	});

});
