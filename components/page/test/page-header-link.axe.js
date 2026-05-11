import { expect, fixture, focusElem } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { pageHeaderLinkFixtures } from './page-header-link-fixtures.js';

describe('d2l-page-header-link', () => {

	it('icon text', async() => {
		const el = await fixture(pageHeaderLinkFixtures.iconText);
		await expect(el).to.be.accessible();
	});

	it('text hidden', async() => {
		const el = await fixture(pageHeaderLinkFixtures.textHidden);
		await expect(el).to.be.accessible();
	});

	it('focused', async() => {
		const el = await fixture(pageHeaderLinkFixtures.iconText);
		await focusElem(el);
		const activeElem = getComposedActiveElement();
		expect(activeElem).to.equal(el.shadowRoot.querySelector('a'));
		await expect(el).to.be.accessible();
	});

});
