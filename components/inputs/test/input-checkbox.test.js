import '../input-checkbox.js';
import { clickElem, expect, fixture, focusElem, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { checkboxFixtures } from './input-checkbox-fixtures.js';

function getInput(elem) {
	return elem.shadowRoot.querySelector('input.d2l-input-checkbox');
}

function getText(elem) {
	const text = elem.shadowRoot.querySelector('.d2l-input-checkbox-text').innerText;
	return text + elem.shadowRoot.querySelector('slot')
		.assignedNodes({ flatten: true })
		.map(node => (node.textContent ? node.textContent : ''))
		.join('');
}

describe('d2l-input-checkbox', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-checkbox');
		});

	});

	describe('default property values', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(checkboxFixtures.unchecked);
		});

		['checked', 'disabled', 'indeterminate', 'notTabbable'].forEach((name) => {
			it(`should default "${name}" property to "false"`, () => {
				expect(elem[name]).to.be.false;
			});
		});

		it('should default "name" property to empty when unset', () => {
			expect(elem.name).to.equal('');
		});

		it('should default "value" property to "on" when unset', () => {
			expect(elem.value).to.equal('on');
		});

	});

	describe('events', () => {

		it('should fire "change" event when input element is clicked', async() => {
			const elem = await fixture(checkboxFixtures.unchecked);
			clickElem(getInput(elem));
			const { target } = await oneEvent(elem, 'change');
			expect(target).to.equal(elem);
		});

		it('should reflect that a previously unchecked input is now checked', async() => {
			const elem = await fixture(checkboxFixtures.unchecked);
			clickElem(getInput(elem));
			const { target } = await oneEvent(elem, 'change');
			expect(target.checked).to.equal(true);
		});

		it('should prevent "change" events inside supporting slot from propagating', async() => {
			const elem = await fixture(html`
				<d2l-input-checkbox aria-label="label">
					<d2l-input-checkbox aria-label="nested" slot="supporting"></d2l-input-checkbox>
				</d2l-input-checkbox>
			`);
			const nestedElem = elem.querySelector('[aria-label="nested"]');
			let eventFired = false;
			elem.addEventListener('change', () => eventFired = true);
			await clickElem(getInput(nestedElem));
			expect(eventFired).to.be.false;
		});

	});

	describe('focus management', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(checkboxFixtures.unchecked);
		});

		it('should fire "focus" event when input element is focussed', async() => {
			focusElem(getInput(elem));
			const { target } = await oneEvent(elem, 'focus');
			expect(target).to.equal(elem);
		});

		it('should fire "focus" event when custom element is focussed', async() => {
			focusElem(elem);
			const { target } = await oneEvent(elem, 'focus');
			expect(target).to.equal(elem);
		});

	});

	describe('indeterminate', () => {

		it('should set aria-checked to "mixed" when indeterminate and checked', async() => {
			const elem = await fixture(checkboxFixtures.indeterminateChecked);
			expect(getInput(elem).getAttribute('aria-checked')).to.equal('mixed');
		});

		it('should set aria-checked to "mixed" when indeterminate and unchecked', async() => {
			const elem = await fixture(checkboxFixtures.indeterminateUnchecked);
			expect(getInput(elem).getAttribute('aria-checked')).to.equal('mixed');
		});

		it('should clear "indeterminate" when checked interderminate clicked', async() => {
			const elem = await fixture(checkboxFixtures.indeterminateChecked);
			await clickElem(getInput(elem));
			expect(elem.checked).to.be.false;
			expect(elem.indeterminate).to.be.false;
			expect(getInput(elem).hasAttribute('aria-checked')).to.be.false;
		});

		it('should fire "change" event when input element is clicked', async() => {
			const elem = await fixture(checkboxFixtures.indeterminateChecked);
			clickElem(getInput(elem));
			const { target } = await oneEvent(elem, 'change');
			expect(target.checked).to.equal(false);
			expect(target.indeterminate).to.equal(false);
		});

		it('should clear "indeterminate" when unchecked indeterminate clicked', async() => {
			const elem = await fixture(checkboxFixtures.indeterminateUnchecked);
			await clickElem(getInput(elem));
			expect(elem.checked).to.be.true;
			expect(elem.indeterminate).to.be.false;
			expect(getInput(elem).hasAttribute('aria-checked')).to.be.false;
		});

	});

	describe('not tabbable', () => {

		it('should not put a tabindex on the checkbox by default', async() => {
			const elem = await fixture(checkboxFixtures.unchecked);
			expect(getInput(elem).hasAttribute('tabindex')).to.be.false;
		});

		it('should apply -1 tabindex when set', async() => {
			const elem = await fixture(html`<d2l-input-checkbox not-tabbable label="not-tabbable"></d2l-input-checkbox>`);
			expect(getInput(elem).getAttribute('tabindex')).to.equal('-1');
		});

	});

	describe('property binding', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(checkboxFixtures.unchecked);
		});

		it('should bind "value" attribute to input property', async() => {
			elem.setAttribute('value', 'hello');
			await elem.updateComplete;
			expect(getInput(elem).value).to.equal('hello');
		});

		it('should bind "indeterminate" attribute to input property', async() => {
			elem.setAttribute('indeterminate', 'indeterminate');
			await elem.updateComplete;
			expect(getInput(elem).indeterminate).to.be.true;
		});

		it('should bind "checked" attribute to input property', async() => {
			elem.setAttribute('checked', 'checked');
			await elem.updateComplete;
			expect(getInput(elem).checked).to.be.true;
		});

		it('should bind "checked" property to input property', async() => {
			elem.checked = true;
			await elem.updateComplete;
			expect(getInput(elem).checked).to.be.true;
		});

		it('should continue to bind "checked" property after interaction', async() => {
			const input = getInput(elem);
			await clickElem(input);
			expect(input.checked).to.be.true;
			expect(elem.checked).to.be.true;
			elem.checked = false;
			await elem.updateComplete;
			expect(input.checked).to.be.false;
		});

		[
			{ name: 'disabled', value: true },
			{ name: 'name', value: 'jim' }
		].forEach((attr) => {
			attr.propName = attr.propName || attr.name;
			it(`should bind "${attr.name}" to input`, async() => {
				if (typeof attr.value === 'boolean') {
					elem.setAttribute(attr.name, attr.name);
				} else {
					elem.setAttribute(attr.name, attr.value);
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

	describe('labels', () => {

		it('should set aria-label when label-hidden', async() => {
			const elem = await fixture(checkboxFixtures.labelHidden);
			expect(getInput(elem).getAttribute('aria-label')).to.equal('label hidden');
			expect(getText(elem)).to.equal('');
		});

		it('should set aria-label when aria-label', async() => {
			const elem = await fixture(checkboxFixtures.labelAria);
			expect(elem.label).to.equal('label aria');
			expect(elem.labelHidden).to.be.true;
			expect(getInput(elem).getAttribute('aria-label')).to.equal('label aria');
			expect(getText(elem)).to.equal('');
		});

		it('should use visible label when not label-hidden', async() => {
			const elem = await fixture(checkboxFixtures.labelNormal);
			expect(getInput(elem).hasAttribute('aria-label')).to.be.false;
			expect(getText(elem)).to.equal('label normal');
		});

		it('should use slotted label when slotted', async() => {
			const elem = await fixture(checkboxFixtures.labelSlotted);
			expect(getInput(elem).hasAttribute('aria-label')).to.be.false;
			expect(getText(elem)).to.equal('label slotted');
		});

		it('should combine label with slotted label', async() => {
			const elem = await fixture(html`<d2l-input-checkbox label="label">label slotted</d2l-input-checkbox>`);
			expect(getInput(elem).hasAttribute('aria-label')).to.be.false;
			expect(getText(elem)).to.equal('labellabel slotted');
		});

	});

	describe('simulateClick', () => {

		it('should set checked property and trigger an event', async() => {
			const elem = await fixture(checkboxFixtures.unchecked);
			setTimeout(() => elem.simulateClick());
			await oneEvent(elem, 'change');
			expect(elem.checked).to.be.true;
		});

	});

	describe('disabled', () => {

		it('should not be toggleable when disabled without tooltip', async() => {
			const elem = await fixture(checkboxFixtures.disabled);
			await clickElem(getInput(elem));
			expect(elem.checked).to.be.false;
		});

		it('should not be toggleable when disabled with tooltip', async() => {
			const elem = await fixture(checkboxFixtures.disabledTooltip);
			await clickElem(getInput(elem));
			expect(elem.checked).to.be.false;
		});

	});

});
