import '../button-add.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';

describe('button-add', () => {
	[ true, false ].forEach((visibleText) => {
		describe(`visible-text="${visibleText}"`, () => {
			[
				{ category: 'basic', template: html`<d2l-button-add ?visible-text="${visibleText}"></d2l-button-add>` },
				{ category: 'label', template: html`<d2l-button-add label="Custom Label" ?visible-text="${visibleText}"></d2l-button-add>` },
				{ category: 'text', template: html`<d2l-button-add text="Custom Text" ?visible-text="${visibleText}"></d2l-button-add>` },
				{ category: 'dashed line', template: html`<d2l-button-add style="--d2l-button-add-line-style: dashed;" ?visible-text="${visibleText}"></d2l-button-add>` }
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
	});
});
