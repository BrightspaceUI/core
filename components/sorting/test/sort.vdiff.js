import { aTimeout, clickElem, expect, fixture, focusElem } from '@brightspace-ui/testing';
import { sortFixtures } from './sort-fixtures.js';

describe('d2l-sort', () => {

	it('closed', async() => {
		const elem = await fixture(sortFixtures.closed);
		await expect(elem).to.be.golden();
	});

	it('disabled', async() => {
		const elem = await fixture(sortFixtures.disabled);
		await expect(elem).to.be.golden();
	});

	it('focused', async() => {
		const elem = await fixture(sortFixtures.closed);
		await focusElem(elem);
		await expect(elem).to.be.golden();
	});

	it('opened', async() => {
		const elem = await fixture(sortFixtures.opened);
		await expect(elem).to.be.golden();
	});

});
