import '../input-checkbox.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const uncheckedFixture = html`<d2l-input-checkbox aria-label="basic"></d2l-input-checkbox>`;
const indeterminateCheckedFixture = html`<d2l-input-checkbox indeterminate checked></d2l-input-checkbox>`;
const indeterminateUncheckedFixture = html`<d2l-input-checkbox indeterminate></d2l-input-checkbox>`;

function getInput(elem) {
	return elem.shadowRoot.querySelector('input.d2l-input-checkbox');
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
			elem = await fixture(uncheckedFixture);
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

		let elem;
		beforeEach(async() => {
			elem = await fixture(uncheckedFixture);
		});

		it('should fire "change" event when input element is clicked', async() => {
			setTimeout(() => getInput(elem).click());
			const { target } = await oneEvent(elem, 'change');
			expect(target).to.equal(elem);
		});

		it('should reflect that a previously unchecked input is now checked', async() => {
			setTimeout(() => getInput(elem).click());
			const { target } = await oneEvent(elem, 'change');
			expect(target.checked).to.equal(true);
		});

	});

	describe('focus management', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(uncheckedFixture);
		});

		it('should fire "focus" event when input element is focussed', async() => {
			setTimeout(() => getInput(elem).focus());
			const { target } = await oneEvent(elem, 'focus');
			expect(target).to.equal(elem);
		});

		it('should fire "focus" event when custom element is focussed', async() => {
			setTimeout(() => elem.focus());
			const { target } = await oneEvent(elem, 'focus');
			expect(target).to.equal(elem);
		});

	});

	describe('indeterminate', () => {

		it('should set aria-checked to "mixed" when indeterminate and checked', async() => {
			const elem = await fixture(indeterminateCheckedFixture);
			expect(getInput(elem).getAttribute('aria-checked')).to.equal('mixed');
		});

		it('should set aria-checked to "mixed" when indeterminate and unchecked', async() => {
			const elem = await fixture(indeterminateUncheckedFixture);
			expect(getInput(elem).getAttribute('aria-checked')).to.equal('mixed');
		});

		it('should clear "indeterminate" when checked interderminate clicked', async() => {
			const elem = await fixture(indeterminateCheckedFixture);
			getInput(elem).click();
			await elem.updateComplete;
			expect(elem.checked).to.be.false;
			expect(elem.indeterminate).to.be.false;
			expect(getInput(elem).hasAttribute('aria-checked')).to.be.false;
		});

		it('should fire "change" event when input element is clicked', async() => {
			const elem = await fixture(indeterminateCheckedFixture);
			setTimeout(() => getInput(elem).click());
			const { target } = await oneEvent(elem, 'change');
			expect(target.checked).to.equal(false);
			expect(target.indeterminate).to.equal(false);
		});

		it('should clear "indeterminate" when unchecked indeterminate clicked', async() => {
			const elem = await fixture(indeterminateUncheckedFixture);
			getInput(elem).click();
			await elem.updateComplete;
			expect(elem.checked).to.be.true;
			expect(elem.indeterminate).to.be.false;
			expect(getInput(elem).hasAttribute('aria-checked')).to.be.false;
		});

	});

	describe('not tabbable', () => {

		it('should not put a tabindex on the checkbox by default', async() => {
			const elem = await fixture(uncheckedFixture);
			expect(getInput(elem).hasAttribute('tabindex')).to.be.false;
		});

		it('should apply -1 tabindex when set', async() => {
			const elem = await fixture(html`<d2l-input-checkbox not-tabbable aria-label="not-tabbable"></d2l-input-checkbox>`);
			expect(getInput(elem).getAttribute('tabindex')).to.equal('-1');
		});

	});

	describe('property binding', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(uncheckedFixture);
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
			input.click();
			expect(input.checked).to.be.true;
			expect(elem.checked).to.be.true;
			await elem.updateComplete;
			elem.checked = false; // eslint-disable-line require-atomic-updates
			await elem.updateComplete;
			expect(input.checked).to.be.false;
		});

		[
			{ name: 'aria-label', propName: 'ariaLabel', value: 'hello' },
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

	describe('simulateClick', () => {

		it('should set checked property and trigger an event', async() => {
			const elem = await fixture(uncheckedFixture);
			setTimeout(() => elem.simulateClick());
			await oneEvent(elem, 'change');
			expect(elem.checked).to.be.true;
		});

	});

});
