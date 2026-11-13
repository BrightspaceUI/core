import { expect, fixture } from '@brightspace-ui/testing';
import { buttonToggleFixtures } from './button-toggle-fixtures.js';

describe('d2l-button-toggle', () => {

	it('not pressed', async() => {
		const el = await fixture(buttonToggleFixtures.iconNotPressed);
		await expect(el).to.be.accessible();
	});

	it('pressed', async() => {
		const el = await fixture(buttonToggleFixtures.iconPressed);
		await expect(el).to.be.accessible();
	});

	it('disabled', async() => {
		const el = await fixture(buttonToggleFixtures.iconDisabled);
		await expect(el).to.be.accessible();
	});

});
