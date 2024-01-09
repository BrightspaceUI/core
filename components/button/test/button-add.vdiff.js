import '../button-add.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';

describe('button-add', () => {
	['icon', 'icon-and-text', 'icon-when-interacted'].forEach((mode) => {
		describe(`mode ${mode}`, () => {
			[
				{ category: 'basic', template: html`<d2l-button-add mode="${mode}"></d2l-button-add>` },
				{ category: 'text', template: html`<d2l-button-add mode="${mode}" text="Custom Text"></d2l-button-add>` }
			].forEach(({ category, template }) => {
				describe(category, () => {
					[
						{ name: 'normal' },
						{ name: 'hover', action: hoverElem },
						{ name: 'focus', action: focusElem },
						{ name: 'click', action: clickElem }
					].forEach(({ action, name }) => {
						it(name, async() => {
							const elem = await fixture(template);
							if (action) await action(elem);
							if ((name === 'hover' || name === 'focus') && mode !== 'icon-and-text') await oneEvent(elem, 'd2l-tooltip-show');
							await expect(elem).to.be.golden();
						});
					});
				});
			});
		});
	});
});
