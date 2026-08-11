import { buttonToggleFixtures, clickActiveButton, getActiveButton } from './button-toggle-fixtures.js';
import { expect, fixture, focusElem, hoverElem, sendKeysElem } from '@brightspace-ui/testing';

describe('button-toggle', () => {
	[
		{ category: 'button-icon', template: buttonToggleFixtures.iconNotPressed },
		{ category: 'button-icon-pressed', template: buttonToggleFixtures.iconPressed },
		{ category: 'button-subtle', template: buttonToggleFixtures.subtleNotPressed },
		{ category: 'button-subtle-pressed', template: buttonToggleFixtures.subtlePressed },
		{ category: 'button-subtle-disabled', template: buttonToggleFixtures.subtleDisabled }
	].forEach(({ category, template }) => {
		describe(category, () => {
			[
				{ name: 'normal' },
				{ name: 'hover', action: hoverElem },
				{ name: 'focus', action: focusElem },
				{ name: 'click', action: elem => clickActiveButton(elem) },
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
