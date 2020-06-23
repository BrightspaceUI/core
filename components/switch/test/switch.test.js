import '../switch.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

describe('d2l-switch', () => {

	it('should construct', () => {
		runConstructor('d2l-switch');
	});

	it('dispatches change event', async() => {
		const elem = await fixture(html`<d2l-switch text="some text"></d2l-switch>`);
		setTimeout(() => elem.on = true);
		const { target } = await oneEvent(elem, 'change');
		expect(target).to.equal(elem);
	});

	it('renders focusable element if enabled', async() => {
		const elem = await fixture(html`<d2l-switch text="some text"></d2l-switch>`);
		expect(elem.shadowRoot.querySelector('[role="switch"]').getAttribute('tabindex')).to.equal('0');
	});

	it('renders non-focusable element if disabled', async() => {
		const elem = await fixture(html`<d2l-switch text="some text" disabled></d2l-switch>`);
		expect(elem.shadowRoot.querySelector('[role="switch"]').hasAttribute('tabindex')).to.equal(false);
	});

	it('delegates focus to underlying focusable', async() => {
		const elem = await fixture(html`<d2l-switch text="some text"></d2l-switch>`);
		elem.focus();
		const activeElement = getComposedActiveElement();
		expect(activeElement).to.equal(elem.shadowRoot.querySelector('[role="switch"]'));
	});

});
