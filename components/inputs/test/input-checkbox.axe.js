import '../input-checkbox.js';
import { expect, fixture, focusElem } from '@brightspace-ui/testing';
import { checkboxFixtures } from './input-checkbox-fixtures.js';
import { inlineHelpFixtures } from './input-shared-content.js';

describe('d2l-input-checkbox', () => {

	[
		{ name: 'unchecked', template: checkboxFixtures.unchecked },
		{ name: 'checked', template: checkboxFixtures.checked },
		{ name: 'slotted label', template: checkboxFixtures.labelSlotted },
		{ name: 'normal label', template: checkboxFixtures.labelNormal },
		{ name: 'label hidden', template: checkboxFixtures.labelHidden },
		{ name: 'aria-label', template: checkboxFixtures.labelAria },
		{ name: 'disabled', template: checkboxFixtures.disabled },
		{ name: 'focused', template: checkboxFixtures.unchecked, action: async elem => await focusElem(elem) },
		{ name: 'inline-help', template: new inlineHelpFixtures().checkbox() }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.accessible();
		});
	});

});
