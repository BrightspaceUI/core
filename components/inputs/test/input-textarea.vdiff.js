import '../input-textarea.js';
import { expect, fixture, focusElem, hoverElem, hoverElemAt, html } from '@brightspace-ui/testing';
import { inlineHelpFixtures } from './input-shared-content.js';

const viewport = { width: 376 };

describe('d2l-input-textarea', () => {

	const defaultFixture = html`<d2l-input-textarea label="Label" value="text"></d2l-input-textarea>`;
	const placeholderFixture = html`<d2l-input-textarea label="Label" placeholder="placeholder"></d2l-input-textarea>`;
	const invalidFixture = html`<d2l-input-textarea label="Label" value="invalid" aria-invalid="true"></d2l-input-textarea>`;
	const noBorderPaddingFixture = html`<d2l-input-textarea label="Label" value="text" no-border no-padding></d2l-input-textarea>`;
	const customWidthFixture = html`<d2l-input-textarea label="Custom Width Longer Than Input" input-width="80px"></d2l-input-textarea>`;
	[
		{ name: 'default', allColorModes: true, template: defaultFixture },
		{ name: 'default-focus', allColorModes: true, template: defaultFixture, action: async(elem) => await focusElem(elem) },
		{ name: 'disabled', allColorModes: true, template: html`<d2l-input-textarea label="Label" value="text disabled" disabled></d2l-input-textarea>` },
		{ name: 'custom-width-hover-label', template: customWidthFixture, action: async(elem) => await hoverElem(elem.shadowRoot.querySelector('label')) },
		{ name: 'custom-width-hover-input', template: customWidthFixture, action: async(elem) => await hoverElem(elem.shadowRoot.querySelector('textarea')) },
		{ name: 'custom-width-hover-empty', template: customWidthFixture, action: async(elem) => await hoverElemAt(elem, 100, 50) },
		{ name: 'label-hidden', template: html`<d2l-input-textarea label="Label" label-hidden value="text"></d2l-input-textarea>` },
		{ name: 'wrapping', template: html`<d2l-input-textarea label="Label" value="Deadlights jack lad schooner scallywag dance the hempen jig carouser broadside cable strike colors. Bring a spring upon her cable holystone blow the man down spanker." min-height="none"></d2l-input-textarea>` },
		{ name: 'placeholder', allColorModes: true, template: placeholderFixture },
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
		{ name: 'invalid', allColorModes: true, template: invalidFixture },
		{ name: 'invalid-focus', allColorModes: true, template: invalidFixture, action: async(elem) => focusElem(elem) },
		{ name: 'invalid-disabled', template: html`<d2l-input-textarea label="Label" value="invalid disabled" aria-invalid="true" disabled></d2l-input-textarea>` },
		{ name: 'invalid-rtl', template: invalidFixture, rtl: true },
		{ name: 'skeleton', allColorModes: true, template: html`<d2l-input-textarea label="Label" value="text" skeleton></d2l-input-textarea>` },
		{ name: 'no-border-padding', template: noBorderPaddingFixture },
		{ name: 'no-border-padding-focus', template: noBorderPaddingFixture, action: async(elem) => focusElem(elem) },
		{ name: 'custom-width', template: html`<d2l-input-textarea label="Label" value="text" input-width="100px"></d2l-input-textarea>` },
		{ name: 'custom-width-skeleton', template: html`<d2l-input-textarea label="Label" value="text" input-width="100px" skeleton></d2l-input-textarea>` },
		{ name: 'inline-help', allColorModes: true, template: new inlineHelpFixtures().textArea() },
		{
			name: 'inline-help-rtl',
			template: new inlineHelpFixtures().textArea(),
			rtl: true
		},
		{
			name: 'inline-help-multiline',
			template: new inlineHelpFixtures({ multiline: true }).textArea()
		},
		{
			name: 'inline-help-skeleton',
			template: new inlineHelpFixtures({ skeleton: true }).textArea()
		},
		{
			name: 'inline-help-skeleton-multiline',
			template: new inlineHelpFixtures({ multiline: true, skeleton: true }).textArea()
		},
		{
			name: 'inline-help-disabled',
			template: new inlineHelpFixtures({ disabled: true }).textArea()
		}
	].forEach(({ name, template, action, allColorModes, rtl }) => {

		it(name, async() => {
			const elem = await fixture(template, { rtl, viewport });
			if (action) await action(elem);
			await expect(elem).to.be.golden({ allColorModes });
		});

	});

});
