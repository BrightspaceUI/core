import { expect, fixture, html } from '@brightspace-ui/testing';
import { createElementErrorMessage } from '../error.js';

describe('error', () => {

	describe('createElementErrorMessage', () => {

		it('should default with no composed path', async() => {
			const elem = await fixture(html`<input type="text">`);
			const message = createElementErrorMessage('TestThing', elem, 'Test message');
			expect(message).to.equal('<input>: Test message. (@brightspace-ui/core:TestThing)');
		});

		it('should include composed path', async() => {
			const parent = await fixture(html`<main><section><div><span class="elem"></span></div></section></main>`);
			const elem = parent.querySelector('.elem');
			const message = createElementErrorMessage('TestThing', elem, 'Test message', { composedPath: true });
			expect(message).to.equal('<span>: Test message. 4 parent nodes: "div, section, main, div". (@brightspace-ui/core:TestThing)');
		});

		it('should truncate composed path at 10 elements', async() => {
			const parent = await fixture(html`<p-11><p-10><p-9><p-8><p-7><p-6><p-5><p-4><p-3><p-2><p-1><span class="elem"></span></p-1></p-2></p-3></p-4></p-5></p-6></p-7></p-8></p-9></p-10></p-11>`);
			const elem = parent.querySelector('.elem');
			const message = createElementErrorMessage('TestThing', elem, 'Test message', { composedPath: true });
			expect(message).to.equal('<span>: Test message. 10 parent nodes: "p-1, p-2, p-3, p-4, p-5, p-6, p-7, p-8, p-9, p-10". (@brightspace-ui/core:TestThing)');
		});

	});

});
