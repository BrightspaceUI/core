import { expect } from '@brightspace-ui/testing';

export function runButtonPropertyTests(getFixture) {

	describe('form attributes', () => {

		it('should set form attribute', async() => {
			const el = await getFixture({ form: 'my-form' });
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('form')).to.equal('my-form');
		});

		it('should set formaction attribute', async() => {
			const el = await getFixture({ formaction: '/submit' });
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('formaction')).to.equal('/submit');
		});

		it('should set formenctype attribute', async() => {
			const el = await getFixture({ formenctype: 'multipart/form-data' });
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('formenctype')).to.equal('multipart/form-data');
		});

		it('should set formmethod attribute', async() => {
			const el = await getFixture({ formmethod: 'post' });
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('formmethod')).to.equal('post');
		});

		it('should set formnovalidate attribute', async() => {
			const el = await getFixture({ formnovalidate: 'formnovalidate' });
			const button = el.shadowRoot.querySelector('button');
			expect(button.hasAttribute('formnovalidate')).to.be.true;
		});

		it('should set formtarget attribute', async() => {
			const el = await getFixture({ formtarget: '_blank' });
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('formtarget')).to.equal('_blank');
		});

		it('should set name attribute', async() => {
			const el = await getFixture({ name: 'my-button' });
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('name')).to.equal('my-button');
		});

	});

	describe('type attribute', () => {

		it('should default to type="button"', async() => {
			const el = await getFixture({});
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('type')).to.equal('button');
		});

		it('should set type="submit"', async() => {
			const el = await getFixture({ type: 'submit' });
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('type')).to.equal('submit');
		});

		it('should set type="reset"', async() => {
			const el = await getFixture({ type: 'reset' });
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('type')).to.equal('reset');
		});

	});

	describe('aria attributes', () => {

		it('should set aria-expanded from expanded property', async() => {
			const el = await getFixture({ expanded: 'true' });
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-expanded')).to.equal('true');
		});

		it('should set aria-expanded from ariaExpanded property', async() => {
			const el = await getFixture({ ariaExpanded: 'false' });
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-expanded')).to.equal('false');
		});

		it('should set aria-haspopup', async() => {
			const el = await getFixture({ ariaHaspopup: 'menu' });
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-haspopup')).to.equal('menu');
		});

		it('should not set aria-describedby when description is not provided', async() => {
			const el = await getFixture({});
			const button = el.shadowRoot.querySelector('button');
			expect(button.hasAttribute('aria-describedby')).to.be.false;
		});

		it('should set description and aria-describedby', async() => {
			const el = await getFixture({ description: 'Additional context' });
			const button = el.shadowRoot.querySelector('button');
			const describedById = button.getAttribute('aria-describedby');
			expect(describedById).to.not.be.null;
			const descriptionSpan = el.shadowRoot.querySelector(`#${describedById}`);
			expect(descriptionSpan.textContent).to.equal('Additional context');
		});

	});

	describe('disabled states', () => {

		it('should set aria-disabled when disabled with disabledTooltip', async() => {
			const el = await getFixture({ disabled: true, disabledTooltip: 'Cannot perform action' });
			const button = el.shadowRoot.querySelector('button');
			expect(button.getAttribute('aria-disabled')).to.equal('true');
			expect(button.hasAttribute('disabled')).to.be.false;
		});

		it('should set disabled attribute when disabled without disabledTooltip', async() => {
			const el = await getFixture({ disabled: true });
			const button = el.shadowRoot.querySelector('button');
			expect(button.hasAttribute('disabled')).to.be.true;
			expect(button.hasAttribute('aria-disabled')).to.be.false;
		});

	});

	describe('other attributes', () => {

		it('should set autofocus attribute', async() => {
			const el = await getFixture({ autofocus: true });
			const button = el.shadowRoot.querySelector('button');
			expect(button.hasAttribute('autofocus')).to.be.true;
		});

	});

}
