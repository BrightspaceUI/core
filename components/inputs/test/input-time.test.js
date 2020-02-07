import '../input-time.js';
import { aTimeout, expect, fixture, oneEvent } from '@open-wc/testing';

const basicFixture = '<d2l-input-time label="label text"></d2l-input-time>';
const labelHiddenFixture = '<d2l-input-time label="label text" label-hidden></d2l-input-time>';


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

describe('d2l-input-time', () => {

	describe('accessibility', () => {

		it('passes all axe tests', async() => {
			const elem = await fixture(basicFixture);
			expect(elem).to.be.accessible();
		});

		it('passes all axe tests when label is hidden', async() => {
			const elem = await fixture(labelHiddenFixture);
			expect(elem).to.be.accessible();
		});

		it('passes all axe tests when disabled', async() => {
			const elem = await fixture('<d2l-input-time label="label text" disabled></d2l-input-time>');
			expect(elem).to.be.accessible();
		});

		it('passes all axe tests when focused', async() => {
			const elem = await fixture(basicFixture);
			setTimeout(() => getInput(elem).focus());
			await oneEvent(elem, 'focus');
			expect(elem).to.be.accessible();
		});
	});

	describe('labelling', () => {

		function getLabel(elem) {
			return elem.shadowRoot.querySelector('.d2l-input-label');
		}

		it('should display visible label', async() => {
			const elem = await fixture(basicFixture);
			expect(getLabel(elem).innerText).to.equal('label text');
		});

		it('should put hidden label on "aria-label"', async() => {
			const elem = await fixture(labelHiddenFixture);
			expect(getLabel(elem)).to.be.null;
			expect(getInput(elem).getAttribute('aria-label')).to.equal('label text');
		});
	});

	describe('value', () => {

		it('should fire uncomposed "change" event when input value changes', async() => {
			const elem = await fixture(basicFixture);
			getInput(elem).value = '11:22AM';
			dispatchEvent(elem, 'change', false);
			await oneEvent(elem, 'change');
		});

		it('should not fire "change" event when input value is invalid', async() => {
			const elem = await fixture(basicFixture);
			let fired = false;
			elem.addEventListener('change', () => {
				fired = true;
			});
			getInput(elem).value = 'invalid input text';
			dispatchEvent(elem, 'change', false);
			await aTimeout(1);
			expect(fired).to.be.false;
		});

		it('should change "value" property when input value changes', async() => {
			const elem = await fixture(basicFixture);
			getInput(elem).value = '11:22AM';
			dispatchEvent(elem, 'change', false);
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('11:22:00');
		});

		it('should provide a time object with hour, minute and second', async() => {
			const elem = await fixture('<d2l-input-time value="11:22 AM"></d2l-input-time>');
			expect(elem.getTime()).to.deep.equal({ hour: 11, minute: 22, second: 0 });
		});

		it('should default to 12 AM', async() => {
			const elem = await fixture(basicFixture);
			expect(elem.value).to.equal('0:00:00');
		});

		it('should not save input seconds after time changes', async() => {
			const elem = await fixture('<d2l-input-time value="11:22:33 AM"></d2l-input-time>');
			expect(elem.getTime().second).to.equal(33);
			getInput().value = '11:45 AM';
			dispatchEvent(elem, 'change', false);
			await oneEvent(elem, 'change');
			expect(elem.value).to.equal('11:45:00');
		});

	});

});
