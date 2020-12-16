import '../input-checkbox.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const uncheckedFixture = html`<d2l-input-checkbox aria-label="basic"></d2l-input-checkbox>`;

function getInput(elem) {
	return elem.shadowRoot.querySelector('input.d2l-input-checkbox');
}

describe('d2l-input-checkbox', () => {

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

});
