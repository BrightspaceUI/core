import { expect, fixture } from '@brightspace-ui/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { pageHeaderButtonFixtures } from './page-header-button-fixtures.js';

describe('d2l-page-header-button', () => {

	it('default', async() => {
		const el = await fixture(pageHeaderButtonFixtures.iconText);
		await expect(el).to.be.accessible();
	});

	it('text hidden', async() => {
		const el = await fixture(pageHeaderButtonFixtures.textHidden);
		await expect(el).to.be.accessible();
	});

	it('disabled', async() => {
		const el = await fixture(pageHeaderButtonFixtures.disabled);
		await expect(el).to.be.accessible();
	});

	it('focused', async() => {
		const el = await fixture(pageHeaderButtonFixtures.iconText);
		el.focus();
		const activeElem = getComposedActiveElement();
		expect(activeElem).to.equal(el.shadowRoot.querySelector('button'));
		await expect(el).to.be.accessible();
	});

});
