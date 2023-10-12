import '../input-color.js';
import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';

describe('d2l-input-color', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-input-color');
		});

	});

	describe('default property values', () => {

		it('should default "value" to "#000000" when type is "foreground" and "disallow-none"', async() => {
			const elem = await fixture(html`<d2l-input-color type="foreground" disallow-none></d2l-input-color>`);
			expect(elem.value).to.equal('#000000');
		});

		it('should default "value" to "#000000" when type is "custom" and "disallow-none"', async() => {
			const elem = await fixture(html`<d2l-input-color type="custom" disallow-none></d2l-input-color>`);
			expect(elem.value).to.equal('#000000');
		});

		it('should default "value" to "#FFFFFF" when type is "background" and "disallow-none"', async() => {
			const elem = await fixture(html`<d2l-input-color type="background" disallow-none></d2l-input-color>`);
			expect(elem.value).to.equal('#FFFFFF');
		});

		it('should default "value" to "undefined" when type is "foreground" and none is allowed', async() => {
			const elem = await fixture(html`<d2l-input-color type="foreground"></d2l-input-color>`);
			expect(elem.value).to.be.undefined;
		});

		it('should default "value" to "undefined" when type is "background" and none is allowed', async() => {
			const elem = await fixture(html`<d2l-input-color type="background"></d2l-input-color>`);
			expect(elem.value).to.be.undefined;
		});

		it('should default "value" to "undefined" when type is "custom" and none is allowed', async() => {
			const elem = await fixture(html`<d2l-input-color type="custom"></d2l-input-color>`);
			expect(elem.value).to.be.undefined;
		});

	});

	describe('formValue reflection', () => {

		it('should reflect default "value" to "formValue"', async() => {
			const elem = await fixture(html`<d2l-input-color></d2l-input-color>`);
			expect(elem.formValue).to.be.undefined;
		});

		it('should reflect default "value" to "formValue" when "disallow-none"', async() => {
			const elem = await fixture(html`<d2l-input-color disallow-none></d2l-input-color>`);
			expect(elem.formValue).to.equal('#000000');
		});

		it('should reflect initial "value" to "formValue"', async() => {
			const elem = await fixture(html`<d2l-input-color value="#ff0000"></d2l-input-color>`);
			expect(elem.formValue).to.equal('#FF0000');
		});

		it('should reflect updated "value" to "formValue"', async() => {
			const elem = await fixture(html`<d2l-input-color value="#ff0000"></d2l-input-color>`);
			elem.value = '#00ff00';
			await elem.updateComplete;
			expect(elem.formValue).to.equal('#00FF00');
		});

	});

	describe('events', () => {

		it('should fire "change" event when value is changed', async() => {
			const elem = await fixture(html`<d2l-input-color launch-type="dropdown" type="background" value="#FF0000"><div id="a"></div></d2l-input-color>`);
			setTimeout(() => {
				elem.querySelector('div').dispatchEvent(new CustomEvent(
					'd2l-input-color-dropdown-close', { bubbles: true, composed: false, detail: { newValue: '#00ff00' } }
				));
			});
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('#00FF00');
		});

		it('should not fire "change" event when value does not change', async() => {
			const elem = await fixture(html`<d2l-input-color launch-type="dropdown" type="background" value="#FF0000"><div id="a"></div></d2l-input-color>`);
			let fail = false;
			elem.addEventListener('change', () => fail = true);
			elem.querySelector('div').dispatchEvent(new CustomEvent(
				'd2l-input-color-dropdown-close', { bubbles: true, composed: false, detail: { newValue: '#FF0000' } }
			));
			expect(fail).to.be.false;
		});

		it('should not fire "change" event when only casing of value changes', async() => {
			const elem = await fixture(html`<d2l-input-color launch-type="dropdown" type="background" value="#FF0000"><div id="a"></div></d2l-input-color>`);
			let fail = false;
			elem.addEventListener('change', () => fail = true);
			elem.querySelector('div').dispatchEvent(new CustomEvent(
				'd2l-input-color-dropdown-close', { bubbles: true, composed: false, detail: { newValue: '#ff0000' } }
			));
			expect(fail).to.be.false;
		});

		it('should not fire "change" event when launch-type is dialog', async() => {
			const elem = await fixture(html`<d2l-input-color launch-type="dialog" type="background" value="#FF0000"><div id="a"></div></d2l-input-color>`);
			let fail = false;
			elem.addEventListener('change', () => fail = true);
			elem.querySelector('div').dispatchEvent(new CustomEvent(
				'd2l-input-color-dropdown-close', { bubbles: true, composed: false, detail: { newValue: '#00FF00' } }
			));
			expect(fail).to.be.false;
			expect(elem.value).to.equal('#FF0000');
		});

		it('should not fire "change" event when no new value is provided', async() => {
			const elem = await fixture(html`<d2l-input-color launch-type="dropdown" type="background" value="#FF0000"><div id="a"></div></d2l-input-color>`);
			let fail = false;
			elem.addEventListener('change', () => fail = true);
			elem.querySelector('div').dispatchEvent(new CustomEvent(
				'd2l-input-color-dropdown-close', { bubbles: true, composed: false }
			));
			expect(fail).to.be.false;
			expect(elem.value).to.equal('#FF0000');
		});

	});

});
