import '../button-add.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';

describe('button-add', () => {
	[
		{ category: 'default', template: html`<d2l-button-add></d2l-button-add>` },
		{ category: 'label', template: html`<d2l-button-add label="Custom Label"></d2l-button-add>` },
		{ category: 'text', template: html`<d2l-button-add text="Custom Text"></d2l-button-add>` },
		{ category: 'visible text', template: html`<d2l-button-add visible-text></d2l-button-add>` },
		{ category: 'visible text with custom text', template: html`<d2l-button-add visible-text text="Custom Text"></d2l-button-add>` },
		{ category: 'dashed line', template: html`<d2l-button-add style="--d2l-button-add-line-style: dashed;"></d2l-button-add>` },
		{ category: 'visible text with dashed line', template: html`<d2l-button-add visible-text style="--d2l-button-add-line-style: dashed;"></d2l-button-add>` }
	].forEach(({ category, template }) => {

		describe(category, () => {
			[
				{ name: 'normal' },
				{ name: 'hover', action: hoverElem },
				{ name: 'focus', action: focusElem },
				{ name: 'click', action: clickElem }
			].forEach(({ action, name }) => {
				it(name, async() => {
					let elem = await fixture(template);
					if (elem.tagName !== 'D2L-BUTTON-ADD') elem = elem.querySelector('d2l-button-add');
					if (action) await action(elem);
					if ((name === 'hover' || name === 'focus') && !elem.visibleText) await oneEvent(elem, 'd2l-tooltip-show');
					await expect(elem).to.be.golden();
				});
			});
		});
	});
});
