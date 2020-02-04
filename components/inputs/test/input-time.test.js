import '../input-time.js';
import { expect, fixture, oneEvent, aTimeout } from '@open-wc/testing';

const basicFixture = '<d2l-input-time label="label text"></d2l-input-time>';

describe('d2l-input-time', () => {

	let elem;

	beforeEach(async() => {
		elem = await fixture(basicFixture);
	});

	function getInput() {
		return elem.shadowRoot.querySelector('.d2l-input');
	}

	describe('accessibility', () => {

		it('passes all axe tests', () => {
			expect(elem).to.be.accessible();
		});

		it('passes all axe tests when label is hidden', () => {
			elem.setAttribute('label-hidden', 'label-hidden');
			expect(elem).to.be.accessible();
		});

		it('passes all axe tests when disabled', () => {
			elem.setAttribute('disabled', 'disabled');
			expect(elem).to.be.accessible();
		});

		it('passes all axe tests when focused', async() => {
			setTimeout(() => getInput(elem).focus());
			await oneEvent(elem, 'focus');
		});
	});

	describe('attribute reflection', () => {
		it(`should reflect disabled property to attribute`, async() => {
			elem.setAttribute('disabled', 'disabled');
			await elem.updateComplete;
			expect(elem.hasAttribute('disabled')).to.be.true;
		});
	});

	describe('labelling', () => {

		function getLabel() {
			return elem.shadowRoot.querySelector('.d2l-input-label');
		};

		it('should display visible label', async() => {
			expect(getLabel().innerText).to.equal('label text');
		});

		it('should put hidden label on "aria-label"', async() => {
			elem.setAttribute('label-hidden', 'label-hidden');
			await elem.updateComplete;
			expect(getLabel()).to.be.null;
			expect(getInput().getAttribute('aria-label')).to.equal('label text');
		});

		it('should fall back to using "aria-label" for backwards compatibility', async() => {
			elem.removeAttribute('label');
			elem.setAttribute('aria-label', 'new label');
			await elem.updateComplete;
			expect(getLabel()).to.be.null;
			expect(getInput().getAttribute('aria-label')).to.equal('new label');
		});

	});

	describe('value', () => {

		function dispatchEvent(eventType, composed) {
			const e = new Event(
				eventType,
				{ bubbles: true, cancelable: false, composed: composed }
			);
			getInput().dispatchEvent(e);
		}

		it('should fire uncomposed "d2l-time-input-changed" event when input value changes', async() => {
			getInput().value = '11:22AM';
			dispatchEvent('change', false);
			await oneEvent(elem, 'd2l-time-input-changed');
		});

		it('should not fire "d2l-time-input-changed" event when input value is invalid', async() => {
			let fired = false;
			elem.addEventListener('d2l-time-input-changed', () => {
				fired = true;
			});
			getInput().value = 'invalid input text';
			dispatchEvent('change', false);
			await aTimeout(500);
			expect(fired).to.be.false;
		});

		it('should change "value" property when input value changes', async() => {
			getInput().value = '11:22AM';
			dispatchEvent('change', false);
			await oneEvent(elem, 'd2l-time-input-changed');
			expect(elem.value).to.equal('11:22:00');
		});

		it('should provide a time object with hour, minute and second', async() => {
			getInput().value = "11:22 AM";
			dispatchEvent('change', false);
			await oneEvent(elem, 'd2l-time-input-changed');
			expect(elem.getTime()).to.deep.equal({ hour: 11, minute: 22, second: 0 });
		});

		it('should not save input seconds', async() => {
			//The seconds property is exclusely for the end-of-day value
			getInput().value = '11:22:33 AM';
			dispatchEvent('change', false);
			await oneEvent(elem, 'd2l-time-input-changed');
			expect(elem.value).to.equal('11:22:00');
		});

		it('should default to 12 AM', async() => {
			expect(elem.value).to.equal('0:00:00');
		});

	});

});
