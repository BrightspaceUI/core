import '../button-icon.js';
import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { createMessage } from '../../../mixins/property-required/property-required-mixin.js';

describe('d2l-button-icon', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-button-icon');
		});

	});

	describe('errors', () => {

		it('throws error when no icon', async() => {
			const el = await fixture(html`<d2l-button-icon text="Icon Button"></d2l-button-icon>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'icon'));
		});

		it('throws error when no text', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear"></d2l-button-icon>`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.throw(TypeError, createMessage(el, 'text'));
		});

		it('does not throw error when custom icon is provided', async() => {
			const el = await fixture(html`
				<d2l-button-icon text="Icon Button">
					<d2l-icon-custom slot="icon">
						<svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
							<path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
							<path fill="#494c4e" d="M13.85 3.15l-2.99-3A.507.507 0 0 0 10.5 0H5.4A1.417 1.417 0 0 0 4 1.43v11.14A1.417 1.417 0 0 0 5.4 14h7.2a1.417 1.417 0 0 0 1.4-1.43V3.5a.47.47 0 0 0-.15-.35zM7 2h1a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm4 10H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm0-4H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z"/>
						</svg>
					</d2l-icon-custom>
				</d2l-button-icon>
			`);
			expect(() => el.flushRequiredPropertyErrors())
				.to.not.throw();
		});

	});

	describe('events', () => {

		it('dispatches click event when clicked', async() => {
			const el = await fixture(html`<d2l-button-icon icon="tier1:gear" text="Icon Button"></d2l-button-icon>`);
			setTimeout(() => el.click());
			await oneEvent(el, 'click');
		});

	});

});
