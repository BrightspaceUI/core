import { buttonIteratorFixtures, focusNext, focusPrevious, hoverNext, hoverPrevious } from './button-iterator-fixtures.js';
import { expect, fixture } from '@brightspace-ui/testing';

describe('button-iterator', () => {
	[
		{ name: 'default', template: buttonIteratorFixtures.default },
		{ name: 'default-next-focus', template: buttonIteratorFixtures.default, action: focusNext },
		{ name: 'default-next-hover', template: buttonIteratorFixtures.default, action: hoverNext },
		{ name: 'default-prev-focus', template: buttonIteratorFixtures.default, action: focusPrevious },
		{ name: 'default-prev-hover', template: buttonIteratorFixtures.default, action: hoverPrevious },
		{ name: 'custom-next-focus', template: buttonIteratorFixtures.custom, action: focusNext },
		{ name: 'custom-next-hover', template: buttonIteratorFixtures.custom, action: hoverNext },
		{ name: 'custom-prev-focus', template: buttonIteratorFixtures.custom, action: focusPrevious },
		{ name: 'custom-prev-hover', template: buttonIteratorFixtures.custom, action: hoverPrevious },
		{ name: 'description', template: buttonIteratorFixtures.description },
		{ name: 'disabled', template: buttonIteratorFixtures.disabled },
		{ name: 'disabled-next-hover', template: buttonIteratorFixtures.disabled, action: hoverNext },
		{ name: 'disabled-prev-hover', template: buttonIteratorFixtures.disabled, action: hoverPrevious },
		{ name: 'next-only', template: buttonIteratorFixtures.nextOnly }
	].forEach(({ name, template, action }) => {
		it(name, async() => {
			const elem = await fixture(template);
			if (action) await action(elem);
			await expect(elem).to.be.golden();
		});
	});
});
