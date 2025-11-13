import '../button-icon.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';

describe('d2l-button-icon', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-icon');
		});

	});

	describe('errors', () => {

		it('throws error when no icon', async() => {
			const el = await fixture(html`<d2l-button-icon text="Icon Button"></d2l-button-icon>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'icon'));
		});

		it('throws error when no text', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear"></d2l-button-icon>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'text'));
		});

		it('does not throw error when custom icon is provided', async() => {
			const el = await fixture(html`
				<d2l-button-icon text="Icon Button">
					<d2l-icon-custom slot="icon">
						<svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
							<path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
							<path fill="#494c4e" d="M13.85 3.15l-2.99-3A.507.507 0 0 0 10.5 0H5.4A1.417 1.417 0 0 0 4 1.43v11.14A1.417 1.417 0 0 0 5.4 14h7.2a1.417 1.417 0 0 0 1.4-1.43V3.5a.47.47 0 0 0-.15-.35zM7 2h1a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm4 10H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm0-4H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z"/>
						</svg>
					</d2l-icon-custom>
				</d2l-button-icon>
			`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.not.throw();
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
			clickElem(el);
			await oneEvent(el, 'click');
		});

		it('prevents click when disabled', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" disabled></d2l-button-icon>`);
			let clicked = false;
			el.addEventListener('click', () => clicked = true);
			clickElem(el);
			expect(clicked).to.be.false;
		});

	});

	describe('button properties', () => {

		it('should set form attribute', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" form="my-form"></d2l-button-icon>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('form')).to.equal('my-form');
		});

		it('should set formaction attribute', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" formaction="/submit"></d2l-button-icon>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('formaction')).to.equal('/submit');
		});

		it('should set formenctype attribute', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" formenctype="multipart/form-data"></d2l-button-icon>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('formenctype')).to.equal('multipart/form-data');
		});

		it('should set formmethod attribute', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" formmethod="post"></d2l-button-icon>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('formmethod')).to.equal('post');
		});

		it('should set formnovalidate attribute', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" formnovalidate="formnovalidate"></d2l-button-icon>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.hasAttribute('formnovalidate')).to.be.true;
		});

		it('should set formtarget attribute', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" formtarget="_blank"></d2l-button-icon>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('formtarget')).to.equal('_blank');
		});

		it('should set name attribute', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" name="my-button"></d2l-button-icon>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('name')).to.equal('my-button');
		});

		it('should default to type="button"', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('type')).to.equal('button');
		});

		it('should set type="submit"', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" type="submit"></d2l-button-icon>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('type')).to.equal('submit');
		});

		it('should set type="reset"', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" type="reset"></d2l-button-icon>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('type')).to.equal('reset');
		});

		it('should set autofocus attribute', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" autofocus></d2l-button-icon>`);
			const button = el.shadowRoot.querySelector('button');
			expect(button.hasAttribute('autofocus')).to.be.true;
		});

		describe('accessibility', () => {

			it('should set description and aria-describedby', async() => {
				const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" description="Additional context"></d2l-button-icon>`);
				const button = el.shadowRoot.querySelector('button');
				const describedById = button.getAttribute('aria-describedby');
				expect(describedById).to.not.be.null;
				const descriptionSpan = el.shadowRoot.querySelector(`#${describedById}`);
				expect(descriptionSpan.textContent).to.equal('Additional context');
			});

			it('should not set aria-describedby when description is not provided', async() => {
				const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.hasAttribute('aria-describedby')).to.be.false;
			});

			it('should use ariaLabel when provided instead of text for aria-label', async() => {
				const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" aria-label="Custom Label"></d2l-button-icon>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.getAttribute('aria-label')).to.equal('Custom Label');
			});

			it('should use text for aria-label when ariaLabel is not provided', async() => {
				const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.getAttribute('aria-label')).to.equal('Icon Button');
			});

			it('should set title attribute from text', async() => {
				const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.getAttribute('title')).to.equal('Icon Button');
			});

			it('should set aria-disabled when disabled with disabledTooltip', async() => {
				const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" disabled disabled-tooltip="Cannot perform action"></d2l-button-icon>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.getAttribute('aria-disabled')).to.equal('true');
				expect(button.hasAttribute('disabled')).to.be.false;
			});

			it('should set disabled attribute when disabled without disabledTooltip', async() => {
				const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" disabled></d2l-button-icon>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.hasAttribute('disabled')).to.be.true;
				expect(button.hasAttribute('aria-disabled')).to.be.false;
			});

			it('should set aria-expanded from expanded property', async() => {
				const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" expanded="true"></d2l-button-icon>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.getAttribute('aria-expanded')).to.equal('true');
			});

			it('should set aria-expanded from ariaExpanded property', async() => {
				const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" aria-expanded="false"></d2l-button-icon>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.getAttribute('aria-expanded')).to.equal('false');
			});

			it('should set aria-haspopup', async() => {
				const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" aria-haspopup="menu"></d2l-button-icon>`);
				const button = el.shadowRoot.querySelector('button');
				expect(button.getAttribute('aria-haspopup')).to.equal('menu');
			});

			it('should reflect hAlign attribute', async() => {
				const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" h-align="text"></d2l-button-icon>`);
				expect(el.getAttribute('h-align')).to.equal('text');
			});

			it('should reflect translucent attribute', async() => {
				const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button" translucent></d2l-button-icon>`);
				expect(el.hasAttribute('translucent')).to.be.true;
			});

		});

	});

});
