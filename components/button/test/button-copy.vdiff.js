import '../button-copy.js';
import { clickElem, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { stub } from 'sinon';

const clickAction = async(elem) => {
	clickElem(elem);
	const { detail } = await oneEvent(elem, 'click');
	return detail.writeTextToClipboard('donuts are yummy!');
};

describe('button-copy', () => {

	const template = html`<d2l-button-copy></d2l-button-copy>`;

	let writeTextStub;

	beforeEach(() => writeTextStub = stub(navigator.clipboard, 'writeText').resolves());
	afterEach(() => writeTextStub.restore());

	[
		{ name: 'normal' },
		{ name: 'click', action: clickAction, scope: document }
	].forEach(({ action, name, scope }) => {
		it(name, async() => {
			const elem = await fixture(template, { viewport: { width: 700, height: 200 } });
			if (action) await action(elem);
			await expect(scope || elem).to.be.golden();
		});
	});

});
