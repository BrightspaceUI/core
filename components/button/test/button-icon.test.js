import '../button-icon.js';
import { expect, fixture, oneEvent } from '@open-wc/testing';

const basicFixture = '<d2l-button-icon icon="d2l-tier1:gear" text="Icon Button"></d2l-button-icon>';
const disabledFixture = '<d2l-button-icon disabled icon="d2l-tier1:gear" text="Icon Button"></d2l-button-icon>';

describe('d2l-button-icon', () => {

	it('dispatches click event when clicked', async() => {
		const el = await fixture(basicFixture);
		setTimeout(() => el.click());
		await oneEvent(el, 'click');
	});

	it('passes all axe tests', async() => {
		const el = await fixture(basicFixture);
		expect(el).to.be.accessible();
	});

	it('passes all axe tests when disabled', async() => {
		const el = await fixture(disabledFixture);
		expect(el).to.be.accessible();
	});

	it('passes all axe tests when focused', async() => {
		const el = await fixture(basicFixture);
		setTimeout(() => el.shadowRoot.querySelector('button').focus());
		await oneEvent(el, 'focus');
	});

});
