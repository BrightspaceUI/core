import { defineCE, expect, fixture, nextFrame, oneDefaultPreventedEvent, oneEvent, sendKeys } from '@brightspace-ui/testing';
import { html, LitElement } from 'lit';
import { DialogMixin } from '../dialog-mixin.js';

const tagName = defineCE(
	class extends DialogMixin(LitElement) {
		render() {
			return this._render(html`
				<div class="d2l-dialog-inner"><div class="d2l-dialog-content"></div></div>
			`, {});
		}
	}
);

describe('dialog-mixin', () => {

	describe('events', () => {

		it('should fire the open event when the opened attribute is set to true', async() => {
			const elem = await fixture(`<${tagName} opened></${tagName}>`);
			await oneEvent(elem, 'd2l-dialog-open');
		});

		it('should fire the open event when open() is called', async() => {
			const elem = await fixture(`<${tagName}></${tagName}>`);
			elem.open();
			await oneEvent(elem, 'd2l-dialog-open');
		});

		it('should fire the close event when opened attribute is set to false', async() => {
			const elem = await fixture(`<${tagName} opened></${tagName}>`);
			await oneEvent(elem, 'd2l-dialog-open');
			elem.opened = false;
			await oneEvent(elem, 'd2l-dialog-close');
		});

		it('should fire the close event when escape is pressed', async() => {
			const elem = await fixture(`<${tagName} opened></${tagName}>`);
			await oneEvent(elem, 'd2l-dialog-open');
			sendKeys('press', 'Escape');
			await oneEvent(elem, 'd2l-dialog-close');
		});

		it('should fire the close event when _close() is called', async() => {
			const elem = await fixture(`<${tagName} opened></${tagName}>`);
			await oneEvent(elem, 'd2l-dialog-open');
			setTimeout(() => elem._close());
			await oneEvent(elem, 'd2l-dialog-close');
		});

		it('should first fire the before-close event to allow prevention of the dialog close', async() => {
			const elem = await fixture(`<${tagName} opened></${tagName}>`);
			await oneEvent(elem, 'd2l-dialog-open');
			setTimeout(() => elem._close());

			await oneDefaultPreventedEvent(elem, 'd2l-dialog-before-close');
			await nextFrame();
			expect(elem.opened).to.be.true;
		});

		it('should fire close event when before-close event\'s closeDialog() is called', async() => {
			const elem = await fixture(`<${tagName} opened></${tagName}>`);
			await oneEvent(elem, 'd2l-dialog-open');
			setTimeout(() => elem._close());

			const event = await oneDefaultPreventedEvent(elem, 'd2l-dialog-before-close');
			setTimeout(() => {
				expect(elem.opened).to.be.true;
				event.detail.closeDialog();
			}, 10);
			await oneEvent(elem, 'd2l-dialog-close');
			expect(elem.opened).to.be.false;
		});

	});

});
