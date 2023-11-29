import '../button-add.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';

describe('button-add', () => {
	[ 'always', 'nearby', 'hover-focus', undefined ].forEach((hintTiming) => {
		describe(`visibility-condition ${hintTiming}`, () => {
			describe('text-visible false', () => {
				[
					{ category: 'basic', template: html`<d2l-button-add visibility-condition="${hintTiming}"></d2l-button-add>` },
					{ category: 'text', template: html`<d2l-button-add text="Custom Text" visibility-condition="${hintTiming}"></d2l-button-add>` },
					{ category: 'dashed line', template: html`<d2l-button-add style="--d2l-button-add-line-style: dashed;" visibility-condition="${hintTiming}"></d2l-button-add>` }
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
								if ((name === 'hover' || name === 'focus') && !elem.textVisible) await oneEvent(elem, 'd2l-tooltip-show');
								await expect(elem).to.be.golden();
							});
						});
					});
				});
			});
		});
	});
	describe('text-visible true', () => {
		[
			{ category: 'basic', template: html`<d2l-button-add text-visible></d2l-button-add>` },
			{ category: 'text', template: html`<d2l-button-add text="Custom Text" text-visible></d2l-button-add>` },
			{ category: 'dashed line', template: html`<d2l-button-add style="--d2l-button-add-line-style: dashed;" text-visible></d2l-button-add>` }
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
						if ((name === 'hover' || name === 'focus') && !elem.textVisible) await oneEvent(elem, 'd2l-tooltip-show');
						await expect(elem).to.be.golden();
					});
				});
			});
		});
	});
});
