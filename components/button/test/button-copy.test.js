import '../button-copy.js';
import { clickElem, expect, fixture, html, nextFrame, oneEvent, runConstructor } from '@brightspace-ui/testing';
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
			setTimeout(() => clickElem(el));
			await oneEvent(el, 'click');
		});

		it('does not dispatch click event when disabled', async() => {
			const el = await fixture(html`<d2l-button-copy disabled></d2l-button-copy>`);
			let dispatched = false;
			el.addEventListener('click', () => dispatched = true);
			setTimeout(() => clickElem(el));
			await nextFrame();
			expect(dispatched).to.be.false;
		});

	});

	describe('writeText', () => {

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
				setTimeout(() => clickElem(el));
				const { detail } = await oneEvent(el, 'click');
				await detail.writeText(info.text);
				if (info.called) expect(writeTextStub).to.have.been.calledOnceWith(info.clipboardValue);
				else expect(writeTextStub).to.not.have.been.called;
			});
		});

	});

});
