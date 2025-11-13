import '../button.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-button', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button');
		});

	});

	describe('properties', () => {

		it('should not set aria-describedby when no description', async() => {
			const el = await fixture(html`<d2l-button>Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.hasAttribute('aria-describedby')).to.be.false;
		});

		it('should set disabled property', async() => {
			const el = await fixture(html`<d2l-button disabled>Disabled Button</d2l-button>`);
			expect(el.disabled).to.be.true;
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.disabled).to.be.true;
		});

		it('should set aria-disabled when disabledTooltip is set', async() => {
			const el = await fixture(html`<d2l-button disabled disabled-tooltip="tooltip text">Disabled Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.getAttribute('aria-disabled')).to.equal('true');
			expect(btn.disabled).to.be.false;
		});

		it('should set expanded property', async() => {
			const el = await fixture(html`<d2l-button expanded="true">Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.getAttribute('aria-expanded')).to.equal('true');
		});

		it('should set aria-label property', async() => {
			const el = await fixture(html`<d2l-button aria-label="Custom Label">Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.getAttribute('aria-label')).to.equal('Custom Label');
		});

		it('should set aria-haspopup property', async() => {
			const el = await fixture(html`<d2l-button aria-haspopup="menu">Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.getAttribute('aria-haspopup')).to.equal('menu');
		});

		it('should set autofocus property', async() => {
			const el = await fixture(html`<d2l-button autofocus>Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.autofocus).to.be.true;
		});

		it('should default type to button', async() => {
			const el = await fixture(html`<d2l-button>Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.type).to.equal('button');
		});

		it('should set type to submit', async() => {
			const el = await fixture(html`<d2l-button type="submit">Submit</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.type).to.equal('submit');
		});

		it('should set type to reset', async() => {
			const el = await fixture(html`<d2l-button type="reset">Reset</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.type).to.equal('reset');
		});

		it('should default to button type for invalid type', async() => {
			const el = await fixture(html`<d2l-button type="invalid">Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.type).to.equal('button');
		});

		it('should set form property', async() => {
			const el = await fixture(html`<d2l-button form="my-form">Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.getAttribute('form')).to.equal('my-form');
		});

		it('should set formaction property', async() => {
			const el = await fixture(html`<d2l-button formaction="/submit">Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.getAttribute('formaction')).to.equal('/submit');
		});

		it('should set formenctype property', async() => {
			const el = await fixture(html`<d2l-button formenctype="multipart/form-data">Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.getAttribute('formenctype')).to.equal('multipart/form-data');
		});

		it('should set formmethod property', async() => {
			const el = await fixture(html`<d2l-button formmethod="post">Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.getAttribute('formmethod')).to.equal('post');
		});

		it('should set formnovalidate property', async() => {
			const el = await fixture(html`<d2l-button formnovalidate="formnovalidate">Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.hasAttribute('formnovalidate')).to.be.true;
		});

		it('should set formtarget property', async() => {
			const el = await fixture(html`<d2l-button formtarget="_blank">Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.getAttribute('formtarget')).to.equal('_blank');
		});

		it('should set name property', async() => {
			const el = await fixture(html`<d2l-button name="my-button">Button</d2l-button>`);
			const btn = el.shadowRoot.querySelector('button');
			expect(btn.getAttribute('name')).to.equal('my-button');
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button>Normal Button</d2l-button>`);
			clickElem(el);
			await oneEvent(el, 'click');
		});

	});

});
