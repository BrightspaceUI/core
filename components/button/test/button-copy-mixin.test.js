import { clickElem, defineCE, expect, fixture, oneEvent } from '@brightspace-ui/testing';
import { html, LitElement } from 'lit';
import { ButtonCopyMixin } from '../button-copy-mixin.js';
import { stub } from 'sinon';

const tagName = defineCE(class extends ButtonCopyMixin(LitElement) {
	render() {
		return html`
			<button @click=${this._handleClick}>
					Test Button
			</button>
			${this._renderToast()}
		`;
	}
});

describe('ButtonCopyMixin', () => {

	describe('default property values', () => {

		it('should default "disabled" property to false', async() => {
			const el = await fixture(`<${tagName}></${tagName}>`);
			expect(el.disabled).to.be.false;
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
				const el = await fixture(`<${tagName}></${tagName}>`);
				clickElem(el);
				const { detail } = await oneEvent(el, 'click');
				const copied = await detail.writeTextToClipboard(info.text);
				if (info.called) {
					expect(writeTextStub).to.have.been.calledOnceWith(info.clipboardValue);
					expect(copied).to.be.true;
					expect(el._toastState).to.equal('copied');
					expect(el._recentCopySuccessful).to.be.true;
				} else {
					expect(writeTextStub).to.not.have.been.called;
					expect(copied).to.be.false;
					expect(el._toastState).to.be.undefined;
					expect(el._recentCopySuccessful).to.be.false;
				}
			});
		});

	});

});
