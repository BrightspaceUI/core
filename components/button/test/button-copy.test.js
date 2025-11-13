import '../button-copy.js';
import { clickElem, expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { stub } from 'sinon';

describe('d2l-button-copy', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-copy');
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button-copy></d2l-button-copy>`);
			clickElem(el);
			await oneEvent(el, 'click');
		});

		it('does not dispatch click event when disabled', async() => {
			const el = await fixture(html`<d2l-button-copy disabled></d2l-button-copy>`);
			let dispatched = false;
			el.addEventListener('click', () => dispatched = true);
			await clickElem(el);
			expect(dispatched).to.be.false;
		});

		it('stops propagation when clicked', async() => {
			const el = await fixture(html`<d2l-button-copy></d2l-button-copy>`);
			let propagated = false;
			el.parentElement.addEventListener('click', () => propagated = true);
			const buttonIcon = el.shadowRoot.querySelector('d2l-button-icon');
			clickElem(buttonIcon);
			await oneEvent(el, 'click');
			expect(propagated).to.be.false;
		});

	});

	describe('writeTextToClipboard', () => {

		let writeTextStub;

		beforeEach(() => writeTextStub = stub(navigator.clipboard, 'writeText').resolves());
		afterEach(() => writeTextStub.restore());

		[
			{ name: 'writes text to clipboard', text: 'donuts are yummy!', called: true, clipboardValue: 'donuts are yummy!' },
			{ name: 'writes trimmed text to clipboard', text: '\n donuts are yummy! \t', called: true, clipboardValue: 'donuts are yummy!' },
			{ name: 'does not write empty string to clipboard', text: '', called: false },
			{ name: 'does not write null to clipboard', text: null, called: false },
			{ name: 'does not write undefined to clipboard', text: undefined, called: false },
			{ name: 'does not write whitespace to clipboard', text: '\n \t', called: false }
		].forEach(info => {
			it(`${info.name}`, async() => {
				const el = await fixture(html`<d2l-button-copy></d2l-button-copy>`);
				clickElem(el);
				const { detail } = await oneEvent(el, 'click');
				const copied = await detail.writeTextToClipboard(info.text);
				if (info.called) {
					expect(writeTextStub).to.have.been.calledOnceWith(info.clipboardValue);
					expect(copied).to.be.true;
				} else {
					expect(writeTextStub).to.not.have.been.called;
					expect(copied).to.be.false;
				}
			});
		});

	});

	describe('icon state', () => {

		it('clears previous timeout on multiple clicks', async() => {
			const writeTextStub = stub(navigator.clipboard, 'writeText').resolves();
			const el = await fixture(html`<d2l-button-copy></d2l-button-copy>`);

			// First click
			clickElem(el);
			let event = await oneEvent(el, 'click');
			await event.detail.writeTextToClipboard('first');
			await el.updateComplete;

			const firstTimeoutId = el._iconCheckTimeoutId;

			// Second click before timeout expires
			clickElem(el);
			event = await oneEvent(el, 'click');
			await event.detail.writeTextToClipboard('second');
			await el.updateComplete;

			const secondTimeoutId = el._iconCheckTimeoutId;

			expect(firstTimeoutId).to.not.equal(secondTimeoutId);
			writeTextStub.restore();
		});

	});

});
