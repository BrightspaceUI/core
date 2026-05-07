import '../skip-nav-custom.js';
import { clickElem, expect, fixture, focusElem, html, oneEvent, sendKeysElem } from '@brightspace-ui/testing';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';
import { getComposedActiveElement } from '../../../helpers/focus.js';

const customFixture = html`<d2l-skip-nav-custom text="Skip to custom place"></d2l-skip-nav-custom>`;

describe('d2l-skip-nav-custom', () => {

	it('should throw if text is not provided', async() => {
		const elem = await fixture(html`<d2l-skip-nav-custom></d2l-skip-nav-custom>`);
		expect(() => elem.flushRequiredPropertyErrors())
			.to.throw(TypeError, createMessage(elem, 'text'));
	});

	describe('events', () => {

		let elem, anchor;
		beforeEach(async() => {
			elem = await fixture(customFixture);
			anchor = elem.shadowRoot.querySelector('a');
		});

		it('should fire click event when clicked with mouse', async() => {
			const p = oneEvent(elem, 'click');
			await focusElem(anchor);
			clickElem(anchor);
			await p;
		});

		it('should fire click event when ENTER is pressed', async() => {
			const p = oneEvent(elem, 'click');
			sendKeysElem(anchor, 'press', 'Enter');
			await p;
		});

		it('should delegate focus to anchor', async() => {
			await focusElem(elem);
			expect(getComposedActiveElement()).to.equal(anchor);
		});

	});

});
