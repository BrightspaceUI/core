import { expect, fixture } from '@brightspace-ui/testing';
import { buttonIteratorFixtures } from './button-iterator-fixtures.js';

describe('d2l-button-iterator', () => {

	Object.entries(buttonIteratorFixtures).forEach(([name, template]) => {
		it(name, async() => {
			const el = await fixture(template);
			await expect(el).to.be.accessible();
		});
	});

});
