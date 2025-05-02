import { expect, fixture } from '@brightspace-ui/testing';
import { radioFixtures } from './input-radio-fixtures.js';

describe('d2l-input-radio', () => {

	it('normal', async() => {
		const elem = await fixture(radioFixtures.secondChecked);
		await expect(elem).to.be.accessible();
	});

	it('none checked', async() => {
		const elem = await fixture(radioFixtures.noneChecked);
		await expect(elem).to.be.accessible();
	});

	it('required', async() => {
		const elem = await fixture(radioFixtures.requiredNoneChecked);
		await expect(elem).to.be.accessible();
	});

	it('required (invalid)', async() => {
		const elem = await fixture(radioFixtures.requiredNoneChecked);
		await elem.validate();
		await expect(elem).to.be.accessible();
	});

	it('disabled', async() => {
		const elem = await fixture(radioFixtures.disabledAllSecondChecked);
		await expect(elem).to.be.accessible();
	});

});
