import { expect, fixture } from '@brightspace-ui/testing';
import { radioFixtures } from './input-radio-fixtures.js';

describe('d2l-input-radio-group', () => {
	[
		{ name: 'labelled', template: radioFixtures.secondChecked },
		{ name: 'label hidden', template: radioFixtures.labelHidden },
		{ name: 'none checked', template: radioFixtures.noneChecked },
		{ name: 'required', template: radioFixtures.requiredNoneChecked },
		{ name: 'required (invalid)', template: radioFixtures.requiredNoneChecked, validate: true },
		{ name: 'disabled', template: radioFixtures.disabledAllSecondChecked },
		{ name: 'description', template: radioFixtures.description }
	].forEach(({ name, template, validate }) => {
		it(name, async() => {
			const elem = await fixture(template);
			if (validate) await elem.validate();
			await expect(elem).to.be.accessible();
		});
	});
});
