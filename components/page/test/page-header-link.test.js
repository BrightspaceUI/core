import '../page-header-link.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';

describe('d2l-page-header-link', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-page-header-link');
		});
	});

	describe('errors', () => {

		it('throws error when no href', async() => {
			const el = await fixture(html`<d2l-page-header-link icon="tier1:gear" text="Settings"></d2l-page-header-link>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'href'));
		});

		it('throws error when no icon', async() => {
			const el = await fixture(html`<d2l-page-header-link href="/settings" text="Settings"></d2l-page-header-link>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'icon'));
		});

		it('throws error when no text', async() => {
			const el = await fixture(html`<d2l-page-header-link href="/settings" icon="tier1:gear"></d2l-page-header-link>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'text'));
		});

	});

});
