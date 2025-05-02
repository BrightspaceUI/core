import { clickElem, expect, fixture, focusElem } from '@brightspace-ui/testing';
import { radioFixtures } from './input-radio-fixtures.js';

describe('d2l-input-radio', () => {
	[
		{ name: 'labelled', template: radioFixtures.secondChecked },
		{ name: 'labelled-focus', template: radioFixtures.secondChecked, focus: true },
		{ name: 'label-hidden', template: radioFixtures.labelHidden },
		{ name: 'required', template: radioFixtures.requiredSecondChecked },
		{ name: 'required-invalid', template: radioFixtures.requiredNoneChecked, validate: true },
		{ name: 'disabled', template: radioFixtures.disabledAllSecondChecked },
		{ name: 'inline-help', template: radioFixtures.inlineHelp },
		{ name: 'supporting-hidden', template: radioFixtures.supporting },
		{
			name: 'supporting',
			template: radioFixtures.supporting,
			action: async(elem) => {
				await clickElem(elem.querySelector('d2l-input-radio[label="Other"]'));
				await elem.updateComplete;
			}
		}
	].forEach(({ name, template, focus, validate, action }) => {
		it(name, async() => {
			const elem = await fixture(template, { viewport: { width: 300 } });
			if (action) await action(elem);
			if (focus) await focusElem(elem);
			if (validate) await elem.validate();
			await expect(elem).to.be.golden();
		});
	});
});
