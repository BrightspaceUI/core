import '../input-textarea.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';
import { loadSass, unloadSass } from '../../../test/load-sass.js';

const viewport = { width: 376 };

describe('d2l-input-textarea', () => {

	const defaultFixture = html`<d2l-input-textarea label="Label" value="text"></d2l-input-textarea>`;
	const placeholderFixture = html`<d2l-input-textarea label="Label" placeholder="placeholder"></d2l-input-textarea>`;
	const invalidFixture = html`<d2l-input-textarea label="Label" value="invalid" aria-invalid="true"></d2l-input-textarea>`;
	const noBorderPaddingFixture = html`<d2l-input-textarea label="Label" value="text" no-border no-padding></d2l-input-textarea>`;
	const inlineHelpComponents = {
		normal: html`
			<d2l-input-textarea label="Description">
				<div slot="inline-help">
					Help text <b>right here</b>!
				</div>
			</d2l-input-textarea>
		`,
		multiline: html`
			<d2l-input-textarea label="Description">
				<div slot="inline-help">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit,
					sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
					Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
					nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
					reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
					pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
					qui officia deserunt mollit anim id est laborum.
				</div>
			</d2l-input-textarea>
		`
	};
	[
		{ name: 'default', template: defaultFixture },
		{ name: 'default-focus', template: defaultFixture, action: async(elem) => await focusElem(elem) },
		{ name: 'disabled', template: html`<d2l-input-textarea label="Label" value="text disabled" disabled></d2l-input-textarea>` },
		{ name: 'label-hidden', template: html`<d2l-input-textarea label="Label" label-hidden value="text"></d2l-input-textarea>` },
		{ name: 'wrapping', template: html`<d2l-input-textarea label="Label" value="Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker." min-height="none"></d2l-input-textarea>` },
		{ name: 'placeholder', template: placeholderFixture },
		{ name: 'placeholder-focus', template: placeholderFixture, action: async(elem) => focusElem(elem) },
		{ name: 'placeholder-disabled', template: html`<d2l-input-textarea label="Label" placeholder="placeholder disabled" disabled></d2l-input-textarea>` },
		{ name: 'rows', template: html`<d2l-input-textarea label="Label" value="text" rows="2"></d2l-input-textarea>` },
		{
			name: 'max-rows',
			template: html`<d2l-input-textarea label="Label" max-rows="4"></d2l-input-textarea>`,
			action: async(elem) => {
				elem.value = 'line 1\nline 2\nline 3\nline 4\nline 5\nline 6';
				await elem.updateComplete;
			},
		},
		{ name: 'required', template: html`<d2l-input-textarea label="Label" value="text" required></d2l-input-textarea>` },
		{ name: 'invalid', template: invalidFixture },
		{ name: 'invalid-focus', template: invalidFixture, action: async(elem) => focusElem(elem) },
		{ name: 'invalid-disabled', template: html`<d2l-input-textarea label="Label" value="invalid disabled" aria-invalid="true" disabled></d2l-input-textarea>` },
		{ name: 'invalid-rtl', template: invalidFixture, rtl: true },
		{ name: 'skeleton', template: html`<d2l-input-textarea label="Label" value="text" skeleton></d2l-input-textarea>` },
		{ name: 'no-border-padding', template: noBorderPaddingFixture },
		{ name: 'no-border-padding-focus', template: noBorderPaddingFixture, action: async(elem) => focusElem(elem) },
		{ name: 'inline-help', template: inlineHelpComponents.normal, action: async(elem) => focusElem(elem) },
		{ name: 'inline-help-multiline', template: inlineHelpComponents.multiline, action: async(elem) => focusElem(elem) }
	].forEach(({ name, template, action, rtl }) => {

		it(name, async() => {
			const elem = await fixture(template, { rtl, viewport });
			if (action) await action(elem);
			await expect(elem).to.be.golden();
		});

	});

	describe('sass', () => {

		before(loadSass);
		after(unloadSass);

		const sassBasicFixture = html`<textarea class="d2l-test-input-textarea">text</textarea>`;
		const sassPlaceholderFixture = html`<textarea class="d2l-test-input-textarea" placeholder="placeholder"></textarea>`;
		const sassInvalidFixture = html`<textarea class="d2l-test-input-textarea" aria-invalid="true">invalid</textarea>`;

		[
			{ name: 'basic', template: sassBasicFixture },
			{ name: 'basic-focus', template: sassBasicFixture, action: async(elem) => focusElem(elem) },
			{ name: 'disabled', template: html`<textarea class="d2l-test-input-textarea" disabled>text disabled</textarea>` },
			{ name: 'placeholder', template: sassPlaceholderFixture },
			{ name: 'placeholder-focus', template: sassPlaceholderFixture, action: async(elem) => focusElem(elem) },
			{ name: 'placeholder-disabled', template: html`<textarea class="d2l-test-input-textarea" disabled placeholder="placeholder disabled"></textarea>` },
			{ name: 'invalid', template: sassInvalidFixture },
			{ name: 'invalid-focus', template: sassInvalidFixture, action: async(elem) => focusElem(elem) },
			{ name: 'invalid-disabled', template: html`<textarea class="d2l-test-input-textarea" disabled aria-invalid="true">invalid disabled</textarea>` },
			{ name: 'invalid-rtl', template: sassInvalidFixture, rtl: true }
		].forEach(({ name, template, action, rtl }) => {

			it(name, async() => {
				const elem = await fixture(template, { rtl, viewport });
				if (action) await action(elem);
				await expect(elem).to.be.golden();
			});

		});

		it('mirror does not add additional container height', async() => {
			const elem = await fixture(html`
				<div style="border: 1px solid; max-height: 300px; overflow: scroll;">
					<d2l-input-textarea label="Label" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."></d2l-input-textarea>
				</div>
			`, { viewport });
			// scroll to bottom
			elem.scrollTop = elem.scrollHeight;
			await expect(elem).to.be.golden();
		});

	});

});
