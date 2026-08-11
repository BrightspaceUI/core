import { clickElem, expect, fixture, focusElem, hoverElem, sendKeysElem } from '@brightspace-ui/testing';
import { buttonToggleFixtures } from './button-toggle-fixtures.js';

describe('button-toggle', () => {

	[
		{ category: 'button-icon', template: buttonToggleFixtures.iconNotPressed },
		{ category: 'button-icon-pressed', template: buttonToggleFixtures.iconPressed },
		{ category: 'button-subtle', template: buttonToggleFixtures.subtleNotPressed },
		{ category: 'button-subtle-pressed', template: buttonToggleFixtures.subtlePressed },
		{ category: 'button-subtle-disabled', template: buttonToggleFixtures.subtleDisabled }
	].forEach(({ category, template }) => {

		const getActiveButton = elem => {
			if (elem.pressed) return elem.querySelector('[slot="pressed"]');
			else return elem.querySelector('[slot="not-pressed"]');
		};

		describe(category, () => {
			[
				{ name: 'normal' },
				{ name: 'hover', action: hoverElem },
				{ name: 'focus', action: focusElem },
				{ name: 'click', action: elem => clickElem(getActiveButton(elem)) },
				{ name: 'enter', action: elem => sendKeysElem(getActiveButton(elem), 'press', 'Enter') }
			].forEach(({ action, name }) => {
				it(name, async() => {
					const elem = await fixture(template);
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});
		});

	});

});
