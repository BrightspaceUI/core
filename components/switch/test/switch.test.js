import '../switch.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import { sendKeysElem } from '@brightspace-ui/testing';

const switchFixture = html`<d2l-switch text="some text"></d2l-switch>`;

describe('d2l-switch', () => {

	it('should construct', () => {
		runConstructor('d2l-switch');
	});

	it('dispatches change event', async() => {
		const elem = await fixture(switchFixture);
		const clickTarget = elem.shadowRoot.querySelector('.d2l-switch-container');
		setTimeout(() => clickTarget.click());
		const { target } = await oneEvent(elem, 'change');
		expect(target).to.equal(elem);
	});

	it('renders focusable element if enabled', async() => {
		const elem = await fixture(switchFixture);
		expect(elem.shadowRoot.querySelector('[role="switch"]').getAttribute('tabindex')).to.equal('0');
	});

	it('renders non-focusable element if disabled', async() => {
		const elem = await fixture(html`<d2l-switch text="some text" disabled></d2l-switch>`);
		expect(elem.shadowRoot.querySelector('[role="switch"]').hasAttribute('tabindex')).to.equal(false);
	});

	it('delegates focus to underlying focusable', async() => {
		const elem = await fixture(switchFixture);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		const activeElement = getComposedActiveElement();
		expect(activeElement).to.equal(elem.shadowRoot.querySelector('[role="switch"]'));
	});

	['Space', 'Enter'].forEach((key) => {
		it(`should toggle when ${key} is pressed`, async() => {
			const elem = await fixture(switchFixture);
			setTimeout(() => sendKeysElem('press', key, elem));
			await oneEvent(elem, 'change');
			expect(elem.on).to.be.true;
		});
	});

});
