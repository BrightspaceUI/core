import '../input-text.js';
import { aTimeout, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';

const normalFixture = html`<d2l-input-text label="label"></d2l-input-text>`;

function dispatchEvent(elem, eventType, composed) {
	const e = new Event(
		eventType,
		{ bubbles: true, cancelable: false, composed: composed }
	);
	getInput(elem).dispatchEvent(e);
}

function getInput(elem) {
	return elem.shadowRoot.querySelector('.d2l-input');
}

function getLabel(elem) {
	return elem.shadowRoot.querySelector('.d2l-input-label');
}

function pressEnter(elem) {
	const event = new CustomEvent('keypress', {
		detail: 0,
		bubbles: true,
		cancelable: true,
		composed: true
	});
	event.keyCode = 13;
	event.code = 13;
	getInput(elem).dispatchEvent(event);
}

describe('d2l-input-text', () => {

	describe('accessibility', () => {

		it('should pass all aXe tests (normal)', async() => {
			const elem = await fixture(normalFixture);
			await expect(elem).to.be.accessible;
		});

		it('should pass all aXe tests (with value)', async() => {
			const elem = await fixture(html`<d2l-input-text label="label" value="hello"></d2l-input-text>`);
			await expect(elem).to.be.accessible;
		});

		it('should pass all aXe tests (disabled)', async() => {
			const elem = await fixture(html`<d2l-input-text label="label" disabled></d2l-input-text>`);
			await expect(elem).to.be.accessible;
		});

		it('should pass all aXe tests (invalid)', async() => {
			const elem = await fixture(html`<d2l-input-text label="label" aria-invalid="true"></d2l-input-text>`);
			await expect(elem).to.be.accessible;
		});

		it('should pass all aXe tests (focused)', async() => {
			const elem = await fixture(normalFixture);
			elem.focus();
			await expect(elem).to.be.accessible();
		});

		it('should pass all aXe tests (hidden label)', async() => {
			const elem = await fixture(html`<d2l-input-text label="label" label-hidden></d2l-input-text>`);
			await expect(elem).to.be.accessible;
		});

	});

	describe('attribute reflection', () => {
		['disabled', 'required'].forEach((name) => {
			it(`should reflect "${name}" property to attribute`, async() => {
				const elem = await fixture(normalFixture);
				elem[name] = true;
				await elem.updateComplete;
				expect(elem.hasAttribute(name)).to.be.true;
			});
		});
	});

	describe('default property values', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(normalFixture);
		});

		['autofocus', 'disabled', 'labelHidden', 'preventSubmit', 'readonly', 'required'].forEach((name) => {
			it(`should default "${name}" property to "false" when unset`, async() => {
				expect(elem[name]).to.be.false;
			});
		});

		it('should default "type" property to "text" when unset', () => {
			expect(elem.type).to.equal('text');
		});

		it('should default "value" property to empty when unset', () => {
			expect(elem.value).to.equal('');
		});

		it('should default unrecognized "type" to "text"', () => {
			elem.setAttribute('type', 'silly');
			expect(getInput(elem).type).to.equal('text');
		});

	});

	describe('focus management', () => {

		it('should delegate focus to underlying input', async() => {
			const elem = await fixture(normalFixture);
			elem.focus();
			const activeElement = getComposedActiveElement();
			expect(activeElement).to.equal(getInput(elem));
		});

		it('should focus even if component has not rendered', async() => {
			const container = await fixture(html`<div></div>`);
			const newInput = document.createElement('d2l-input-text');
			container.appendChild(newInput);
			await newInput.focus();
			const activeElement = getComposedActiveElement();
			expect(activeElement).to.equal(getInput(newInput));
		});

	});

	describe('labelling', () => {

		it('should display visible label', async() => {
			const elem = await fixture(normalFixture);
			expect(getLabel(elem).innerText).to.equal('label');
		});

		it('should put hidden label on "aria-label"', async() => {
			const elem = await fixture(html`<d2l-input-text label="label" label-hidden></d2l-input-text>`);
			expect(getLabel(elem)).to.be.null;
			expect(getInput(elem).getAttribute('aria-label')).to.equal('label');
		});

		it('should fall back to using "aria-label" for backwards compatibility', async() => {
			const elem = await fixture(html`<d2l-input-text aria-label="new label"></d2l-input-text>`);
			expect(getLabel(elem)).to.be.null;
			expect(getInput(elem).getAttribute('aria-label')).to.equal('new label');
		});

	});

	describe('property binding', () => {

		it('should bind "value" attribute to input property', async() => {
			const elem = await fixture(html`<d2l-input-text label="label" value="hello"></d2l-input-text>`);
			expect(getInput(elem).value).to.equal('hello');
		});

		it('should bind "required" attribute to input "aria-required"', async() => {
			const elem = await fixture(html`<d2l-input-text label="label" required></d2l-input-text>`);
			const input = getInput(elem);
			expect(input.required).to.be.false;
			expect(input.getAttribute('aria-required')).to.equal('true');
		});

		[
			{name: 'aria-invalid', propName: 'ariaInvalid', value: 'true'},
			/*{name: 'autocomplete', value: 'email'}, bug in Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1583957 */
			{name: 'autofocus', value: true},
			{name: 'disabled', value: true},
			{name: 'max', value: '5'},
			{name: 'maxlength', propName: 'maxLength', value: 10},
			{name: 'min', value: '1'},
			{name: 'minLength', propName: 'minLength', value: 3},
			{name: 'name', value: 'jim'},
			{name: 'pattern', value: '[A-Za-z]+'},
			{name: 'placeholder', value: 'enter something'},
			{name: 'readonly', propName: 'readOnly', value: true},
			{name: 'size', value: 20},
			{name: 'step', value: '2'},
			{name: 'type', value: 'email'}
		].forEach((attr) => {
			attr.propName = attr.propName || attr.name;
			it(`should bind "${attr.name}" to input`, async() => {
				const elem = await fixture(normalFixture);
				if (typeof attr.value === 'boolean') {
					elem.setAttribute(attr.name, attr.name);
				} else {
					elem.setAttribute(attr.name, attr.value.toString());
				}
				await elem.updateComplete;
				const input = getInput(elem);
				if (typeof attr.value === 'boolean') {
					expect(input.hasAttribute(attr.name)).to.be.true;
					expect(input[attr.propName]).to.equal(attr.value);
				} else {
					expect(input.getAttribute(attr.name)).to.equal(attr.value.toString());
					if (attr.name.indexOf('aria-') === -1) {
						expect(input[attr.propName]).to.equal(attr.value);
					}
				}
			});
		});

	});

	describe('submit prevention', () => {

		it('should allow ENTER keypress event by default', async() => {
			const elem = await fixture(normalFixture);
			setTimeout(() => pressEnter(elem));
			const { defaultPrevented } = await oneEvent(elem, 'keypress');
			expect(defaultPrevented).to.be.false;
		});

		it('should preventDefault on ENTER when "prevent-submit"', async() => {
			const elem = await fixture(html`<d2l-input-text label="label" prevent-submit></d2l-input-text>`);
			setTimeout(() => pressEnter(elem));
			const { defaultPrevented } = await oneEvent(elem, 'keypress');
			expect(defaultPrevented).to.be.true;
		});

	});

	describe('value', () => {

		it('should fire uncomposed "change" event when input value changes', async() => {
			const elem = await fixture(normalFixture);
			setTimeout(() => dispatchEvent(elem, 'change', false));
			const { composed } = await oneEvent(elem, 'change');
			expect(composed).to.be.false;
		});

		it('should fire "input" event when input value changes', async() => {
			const elem = await fixture(normalFixture);
			setTimeout(() => dispatchEvent(elem, 'input', true));
			await oneEvent(elem, 'input');
		});

		it('should change "value" property when input value changes', async() => {
			const elem = await fixture(normalFixture);
			getInput(elem).value = 'hello';
			dispatchEvent(elem, 'input', true);
			expect(elem.value).to.equal('hello');
		});

		it('should change "value" property when input value changes because of blur event on edge', async() => {
			const browserType = window.navigator.userAgent;
			if (!(browserType.indexOf('Trident') > -1 || browserType.indexOf('Edge') > -1)) return;

			const elem = await fixture(normalFixture);
			getInput(elem).value = 'hello';
			setTimeout(() => dispatchEvent(elem, 'blur', true));
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('hello');
		});

		it('should NOT change "value" property when input value changes because of blur event on non-edge', async() => {
			const browserType = window.navigator.userAgent;
			if ((browserType.indexOf('Trident') > -1 || browserType.indexOf('Edge') > -1)) return;

			const elem = await fixture(normalFixture);
			let fired = false;
			elem.addEventListener('change', () => {
				fired = true;
			});
			getInput(elem).value = 'hello';
			setTimeout(() => dispatchEvent(elem, 'blur', true));
			await aTimeout(1);
			expect(fired).to.be.false;
			expect(elem.value).to.not.equal('hello');
		});

	});

});
