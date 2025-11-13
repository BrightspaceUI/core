import '../button-subtle.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';

describe('d2l-button-subtle', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-subtle');
		});

	});

	describe('errors', () => {

		// enable when PropertyRequiredMixin is used
		it.skip('throws error when no text', async() => {
			const el = await fixture(html`<d2l-button-subtle></d2l-button-subtle>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'text'));
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
			clickElem(el);
			await oneEvent(el, 'click');
		});

	});

	describe('button properties', () => {

		it('should set form attribute', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button" form="my-form"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('form')).to.equal('my-form');
		});

		it('should set formaction attribute', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button" formaction="/submit"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('formaction')).to.equal('/submit');
		});

		it('should set formenctype attribute', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button" formenctype="multipart/form-data"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('formenctype')).to.equal('multipart/form-data');
		});

		it('should set formmethod attribute', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button" formmethod="post"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('formmethod')).to.equal('post');
		});

		it('should set formnovalidate attribute', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button" formnovalidate="formnovalidate"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.hasAttribute('formnovalidate')).to.be.true;
		});

		it('should set formtarget attribute', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button" formtarget="_blank"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('formtarget')).to.equal('_blank');
		});

		it('should set name attribute', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button" name="my-button"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('name')).to.equal('my-button');
		});

		it('should default to type="button"', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('type')).to.equal('button');
		});

		it('should set type="submit"', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button" type="submit"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('type')).to.equal('submit');
		});

		it('should set type="reset"', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button" type="reset"></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('type')).to.equal('reset');
		});

		it('should set autofocus attribute', async() => {
			const el = await fixture(html`<d2l-button-subtle text="Subtle Button" autofocus></d2l-button-subtle>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.hasAttribute('autofocus')).to.be.true;
		});

		describe('accessibility', () => {

			it('should not set aria-describedby when description is not provided', async() => {
				const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.hasAttribute('aria-describedby')).to.be.false;
			});

			it('should use ariaLabel when provided for aria-label', async() => {
				const el = await fixture(html`<d2l-button-subtle text="Subtle Button" aria-label="Custom Label"></d2l-button-subtle>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.getAttribute('aria-label')).to.equal('Custom Label');
			});

			it('should not set aria-label when ariaLabel is not provided', async() => {
				const el = await fixture(html`<d2l-button-subtle text="Subtle Button"></d2l-button-subtle>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.hasAttribute('aria-label')).to.be.false;
			});

			it('should set aria-disabled and render tooltip when disabled with disabledTooltip', async() => {
				const el = await fixture(html`<d2l-button-subtle text="Subtle Button" disabled disabled-tooltip="Cannot perform action"></d2l-button-subtle>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.getAttribute('aria-disabled')).to.equal('true');
				expect(button.hasAttribute('disabled')).to.be.false;
			});

			it('should set disabled attribute when disabled without disabledTooltip', async() => {
				const el = await fixture(html`<d2l-button-subtle text="Subtle Button" disabled></d2l-button-subtle>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.hasAttribute('disabled')).to.be.true;
				expect(button.hasAttribute('aria-disabled')).to.be.false;
			});

			it('should set aria-expanded from expanded property', async() => {
				const el = await fixture(html`<d2l-button-subtle text="Subtle Button" expanded="true"></d2l-button-subtle>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.getAttribute('aria-expanded')).to.equal('true');
			});

			it('should set aria-expanded from ariaExpanded property', async() => {
				const el = await fixture(html`<d2l-button-subtle text="Subtle Button" aria-expanded="false"></d2l-button-subtle>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.getAttribute('aria-expanded')).to.equal('false');
			});

			it('should set aria-haspopup', async() => {
				const el = await fixture(html`<d2l-button-subtle text="Subtle Button" aria-haspopup="menu"></d2l-button-subtle>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.getAttribute('aria-haspopup')).to.equal('menu');
			});

		});

	});

});
