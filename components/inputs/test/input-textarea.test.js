import '../input-textarea.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const normalFixture = html`<d2l-input-textarea label="label"></d2l-input-textarea>`;

function dispatchEvent(elem, eventType, composed) {
	const e = new Event(
		eventType,
		{ bubbles: true, cancelable: false, composed: composed }
	);
	getTextArea(elem).dispatchEvent(e);
}

function getTextArea(elem) {
	return elem.shadowRoot.querySelector('textarea');
}

function getLabel(elem) {
	return elem.shadowRoot.querySelector('.d2l-input-label');
}

describe('d2l-input-textarea', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-textarea');
		});

	});

	describe('accessibility', () => {

		it('should display visible label', async() => {
			const elem = await fixture(normalFixture);
			expect(getLabel(elem).innerText).to.equal('label');
		});

		it('should put hidden label on "aria-label"', async() => {
			const elem = await fixture(html`<d2l-input-textarea label="label" label-hidden></d2l-input-textarea>`);
			expect(getLabel(elem)).to.be.null;
			expect(getTextArea(elem).getAttribute('aria-label')).to.equal('label');
		});

		it('should set aria-describedby when description', async() => {
			const elem = await fixture(html`<d2l-input-textarea label="label" description="text description"></d2l-input-textarea>`);
			const description = elem.shadowRoot.querySelector('div.d2l-offscreen');
			expect(getTextArea(elem).hasAttribute('aria-describedby')).to.be.true;
			expect(description.textContent).to.equal('text description');
		});

		it('should not set aria-describedby when no description', async() => {
			const elem = await fixture(normalFixture);
			expect(getTextArea(elem).hasAttribute('aria-describedby')).to.be.false;
		});

		it('should set aria-required when required', async() => {
			const elem = await fixture(html`<d2l-input-textarea label="label" required></d2l-input-textarea>`);
			const textarea = getTextArea(elem);
			expect(textarea.required).to.be.true;
			expect(textarea.getAttribute('aria-required')).to.equal('true');
		});

	});

	describe('validation', () => {

		it('should be invalid when empty and required', async() => {
			const elem = await fixture(normalFixture);
			elem.required = true;

			const errors = await elem.validate();
			expect(errors).to.contain('label is required.');
		});

		it('should be valid when required has value', async() => {
			const elem = await fixture(normalFixture);
			elem.required = true;
			elem.value = 'hi';

			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should be invalid when length is less than min length', async() => {
			const elem = await fixture(normalFixture);
			elem.minlength = 10;
			elem.value = 'only nine';

			const errors = await elem.validate();
			expect(errors).to.contain('label must be at least 10 characters');
		});

		it('should be valid when length is greater than or equal to min length', async() => {
			const elem = await fixture(normalFixture);
			elem.minlength = 10;
			elem.value = 'more than nine';

			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should be valid with min length when empty', async() => {
			const elem = await fixture(normalFixture);
			elem.minlength = 10;

			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

	});

	describe('value', () => {

		it('should dispatch uncomposed "change" event when textarea changes', async() => {
			const elem = await fixture(normalFixture);
			setTimeout(() => dispatchEvent(elem, 'change', false));
			const { composed } = await oneEvent(elem, 'change');
			expect(composed).to.be.false;
		});

		it('should dispatch "input" event when textarea changes', async() => {
			const elem = await fixture(normalFixture);
			setTimeout(() => dispatchEvent(elem, 'input', true));
			await oneEvent(elem, 'input');
		});

	});

});
