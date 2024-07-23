import '../button.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';

describe('button', () => {
	[
		{ category: 'normal', template: html`<d2l-button>Normal Button</d2l-button>` },
		{ category: 'primary', template: html`<d2l-button primary>Primary Button</d2l-button>` }
	].forEach(({ category, template }) => {

		describe(category, () => {
			[
				{ name: 'normal' },
				{ name: 'hover', action: hoverElem },
				{ name: 'focus', action: focusElem },
				{ name: 'click', action: clickElem },
				{ name: 'disabled', action: elem => elem.disabled = true }
			].forEach(({ action, name }) => {
				it(name, async() => {
					const elem = await fixture(template);
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});
		});
	});

	it('disabled-tooltip', async() => {
		const elem = await fixture(html`<d2l-button disabled disabled-tooltip="Disabled Tooltip">Disabled Button</d2l-button>`);
		hoverElem(elem);
		await oneEvent(elem, 'd2l-tooltip-show');
		await expect(elem).to.be.golden();
	});

});
