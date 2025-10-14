import '../button-copy.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';
import { stub } from 'sinon';

const clickAction = async(elem) => {
	setTimeout(() => clickElem(elem));
	const { detail } = await oneEvent(elem, 'click');
	return detail.writeText('donuts are yummy!');
};

describe('button-copy', () => {

	let writeTextStub;

	beforeEach(() => writeTextStub = stub(navigator.clipboard, 'writeText').resolves());
	afterEach(() => writeTextStub.restore());

	[
		{ category: 'normal', template: html`<d2l-button-copy></d2l-button-copy>` }
	].forEach(({ category, template }) => {

		describe(category, () => {

			[
				{ name: 'normal' },
				{ name: 'hover', action: hoverElem },
				{ name: 'focus', action: focusElem },
				{ name: 'click', action: clickAction, scope: document },
				{ name: 'disabled', action: elem => elem.disabled = true },
				{ name: 'disabled hover', action: elem => {
					elem.disabled = true;
					return hoverElem(elem);
				} }
			].forEach(({ action, name, scope }) => {
				it(name, async() => {
					const elem = await fixture(template, { viewport: { width: 700, height: 200 } });
					if (action) await action(elem);
					await expect(scope || elem).to.be.golden();
				});
			});
		});

	});

});
