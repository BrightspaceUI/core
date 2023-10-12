import '../input-text.js';
import { aTimeout, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

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

		it('should set aria-describedby when description', async() => {
			const elem = await fixture(html`<d2l-input-text label="label" description="text description"></d2l-input-text>`);
			const description = elem.shadowRoot.querySelector('div.d2l-offscreen');
			expect(getInput(elem).hasAttribute('aria-describedby')).to.be.true;
			expect(description.textContent).to.equal('text description');
		});

		it('should not set aria-describedby when no description', async() => {
			const elem = await fixture(normalFixture);
			expect(getInput(elem).hasAttribute('aria-describedby')).to.be.false;
		});

		it('should append unit to the label when label is visible', async() => {
			const elem = await fixture(html`<d2l-input-text label="label" unit="%"></d2l-input-text>`);
			expect(getLabel(elem).textContent).to.equal('label %');
		});

		it('should append unit to the aria-label when label is hidden', async() => {
			const elem = await fixture(html`<d2l-input-text label="label" label-hidden unit="%"></d2l-input-text>`);
			expect(getInput(elem).getAttribute('aria-label')).to.equal('label %');
		});

		it('should prefer unit-label over unit', async() => {
			const elem = await fixture(html`<d2l-input-text label="grade" label-hidden unit="/5" unit-label="out of 5"></d2l-input-text>`);
			expect(getInput(elem).getAttribute('aria-label')).to.equal('grade out of 5');
		});

	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-text');
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

		it('should put labelled-by label on "aria-label"', async() => {
			const elem = await fixture(html`
				<d2l-input-text labelled-by="label"></d2l-input-text>
				<span id="label">label</span>
			`);
			await aTimeout(100); // for Safari
			expect(getLabel(elem)).to.be.null;
			expect(getInput(elem).getAttribute('aria-label')).to.equal('label');
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
			expect(input.required).to.be.true;
			expect(input.getAttribute('aria-required')).to.equal('true');
		});

		[
			{ name: 'aria-invalid', propName: 'ariaInvalid', value: 'true' },
			/*{name: 'autocomplete', value: 'email'}, bug in Firefox: https://bugzilla.mozilla.org/show_bug.cgi?id=1583957 */
			{ name: 'autofocus', value: true },
			{ name: 'disabled', value: true },
			{ name: 'max', value: '5' },
			{ name: 'maxlength', propName: 'maxLength', value: 10 },
			{ name: 'min', value: '1' },
			{ name: 'minlength', propName: 'minLength', value: 3 },
			{ name: 'name', value: 'jim' },
			{ name: 'pattern', value: '[A-Za-z]+' },
			{ name: 'placeholder', value: 'enter something' },
			{ name: 'readonly', propName: 'readOnly', value: true },
			{ name: 'size', value: 20 },
			{ name: 'step', value: '2' },
			{ name: 'type', value: 'email' }
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
			await elem.updateComplete;

			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should be invalid when length is less than min length', async() => {
			const elem = await fixture(normalFixture);
			elem.minlength = 10;
			elem.value = 'only nine';
			await elem.updateComplete;

			const errors = await elem.validate();
			expect(errors).to.contain('label must be at least 10 characters');
		});

		it('should be valid when length is greater than or equal to min length', async() => {
			const elem = await fixture(normalFixture);
			elem.minlength = 10;
			elem.value = 'more than nine';
			await elem.updateComplete;

			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should be valid with min length when empty', async() => {
			const elem = await fixture(normalFixture);
			elem.minlength = 10;

			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should be invalid when the url is invalid', async() => {
			const elem = await fixture(normalFixture);
			elem.type = 'url';
			elem.value = 'not a url';
			await elem.updateComplete;

			const errors = await elem.validate();
			expect(errors).to.contain('URL is not valid');
		});

		it('should be valid when the url is valid', async() => {
			const elem = await fixture(normalFixture);
			elem.type = 'url';
			elem.value = 'https://aurl.ataninvalidtldthatdoesntactuallyexist';
			await elem.updateComplete;

			const errors = await elem.validate();
			expect(errors).to.empty;
		});

		it('should be invalid when the email is invalid', async() => {
			const elem = await fixture(normalFixture);
			elem.type = 'email';
			elem.value = 'not an email';
			await elem.updateComplete;

			const errors = await elem.validate();
			expect(errors).to.contain('Email is not valid');
		});

		it('should be valid when the email is valid', async() => {
			const elem = await fixture(normalFixture);
			elem.type = 'email';
			elem.value = 'anemail@somedomain.ataninvalidtldthatdoesntactuallyexist';
			await elem.updateComplete;

			const errors = await elem.validate();
			expect(errors).to.empty;
		});

		it('should be invalid when value is below the min', async() => {
			const elem = await fixture(normalFixture);
			elem.type = 'number';
			elem.min = '10';
			elem.value = '9';
			await elem.updateComplete;

			const errors = await elem.validate();
			expect(errors).to.contain('Number must be greater than or equal to 10.');
		});

		it('should be invalid when value is above the max', async() => {
			const elem = await fixture(normalFixture);
			elem.type = 'number';
			elem.max = '100';
			elem.value = '110';
			await elem.updateComplete;

			const errors = await elem.validate();
			expect(errors).to.contain('Number must be less than or equal to 100.');
		});

		it('should be valid when value is between min and max', async() => {
			const elem = await fixture(normalFixture);
			elem.type = 'number';
			elem.min = '10';
			elem.max = '100';
			elem.value = '55';
			await elem.updateComplete;

			const errors = await elem.validate();
			expect(errors).to.be.empty;
		});

		it('should validate when input value changes', async() => {
			const elem = await fixture(html`<d2l-input-text label="label" minlength="5" value="123456"></d2l-input-text>`);
			getInput(elem).value = '123';
			dispatchEvent(elem, 'input', true);
			const errors = await elem.validate();
			expect(errors).to.contain('label must be at least 5 characters');
		});

	});

	describe('value', () => {

		it('should update after other properties are updated', async() => {
			const elem = await fixture(html`<d2l-input-text label="label" type="number" value="1"></d2l-input-text>`);
			const input = getInput(elem);
			elem.type = 'text';
			elem.value = 'Text';
			expect(input.type).to.equal('number');
			expect(input.value).to.equal('1');
			await elem.updateComplete;
			expect(input.type).to.equal('text');
			expect(input.value).to.equal('Text');
		});

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

		it('should change "value" property when input value is removed by type change', async() => {
			const elem = await fixture(normalFixture);
			elem.value = 'hello';
			elem.type = 'number';
			await elem.updateComplete;
			await aTimeout(1);
			expect(elem.value).to.equal('');
		});

		it('should NOT fire "change" event because of blur event', async() => {
			const elem = await fixture(normalFixture);
			let fired = false;
			elem.addEventListener('change', () => {
				fired = true;
			});
			getInput(elem).value = 'hello';
			setTimeout(() => {
				dispatchEvent(elem, 'input', true);
				dispatchEvent(elem, 'blur', true);
			});
			await aTimeout(1);
			expect(fired).to.be.false;
		});

	});

	describe('events', () => {

		it('should suppress keypress events from slots', async() => {

			const elem = await fixture(html`<d2l-input-text label="label"><div slot="left"></div><div slot="right"></div></d2l-input-text>`);
			const left = elem.querySelector('div[slot="left"]');
			const right = elem.querySelector('div[slot="right"]');

			let fired = false;
			elem.addEventListener('keypress', () => {
				fired = true;
			});

			setTimeout(() => {
				const e = new Event(
					'keypress',
					{ bubbles: true, cancelable: true, composed: true }
				);
				left.dispatchEvent(e);
				right.dispatchEvent(e);
			});
			await aTimeout(1);

			expect(fired).to.be.false;

		});

	});

});
