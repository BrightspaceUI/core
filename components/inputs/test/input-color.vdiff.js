import '../input-color.js';
import { expect, fixture, focusElem, html, oneEvent } from '@brightspace-ui/testing';
import { inlineHelpFixtures } from './input-shared-content.js';

describe('d2l-input-color', () => {

	[
		{ name: 'background', template: html`<d2l-input-color type="background" value="#ff0000"></d2l-input-color>` },
		{ name: 'background-none', template: html`<d2l-input-color type="background"></d2l-input-color>` },
		{ name: 'background-disabled', template: html`<d2l-input-color type="background" value="#ff0000" disabled></d2l-input-color>` },
		{ name: 'background-readonly', template: html`<d2l-input-color type="background" value="#ff0000" readonly></d2l-input-color>` },
		{ name: 'foreground', template: html`<d2l-input-color type="foreground" value="#00ff00"></d2l-input-color>` },
		{ name: 'foreground-none', template: html`<d2l-input-color type="foreground"></d2l-input-color>` },
		{ name: 'foreground-disabled', template: html`<d2l-input-color type="foreground" value="#00ff00" disabled></d2l-input-color>` },
		{ name: 'foreground-readonly', template: html`<d2l-input-color type="foreground" value="#00ff00" readonly></d2l-input-color>` },
		{ name: 'custom', template: html`<d2l-input-color type="custom" label="Custom Fun Color" value="#0000ff"></d2l-input-color>` },
		{ name: 'custom-none', template: html`<d2l-input-color type="custom" label="Custom Fun Color"></d2l-input-color>` },
		{ name: 'custom-disabled', template: html`<d2l-input-color type="custom" label="Custom Fun Color" value="#0000ff" disabled></d2l-input-color>` },
		{ name: 'custom-readonly', template: html`<d2l-input-color type="custom" label="Custom Fun Color" value="#0000ff" readonly></d2l-input-color>` },
		{ name: 'label-hidden', template: html`<d2l-input-color type="custom" label="Custom Fun Color" label-hidden value="#0000ff"></d2l-input-color>` },
		{ name: 'inline-help', template: inlineHelpFixtures.color.normal },
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
		it(`${name}-focus`, async() => {
			const elem = await fixture(template);
			focusElem(elem);
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});
	});

});
