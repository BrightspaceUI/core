import '../button-copy.js';
import { clickElem, expect, fixture, html, oneEvent, waitUntil } from '@brightspace-ui/testing';
import { stub } from 'sinon';

const clickAction = async(elem) => {
	clickElem(elem);
	const { detail } = await oneEvent(elem, 'click');
	return detail.writeTextToClipboard('donuts are yummy!');
};

describe('button-copy', () => {

	const template = html`<d2l-button-copy></d2l-button-copy>`;

	let writeTextStub;

	afterEach(() => writeTextStub?.restore());

	it('normal', async() => {
		const elem = await fixture(template, { viewport: { width: 700, height: 200 } });
		await expect(elem).to.be.golden();
	});

	it('click', async() => {
		writeTextStub = stub(navigator.clipboard, 'writeText').resolves();
		const elem = await fixture(template, { viewport: { width: 700, height: 200 } });
		await clickAction(elem);
		await expect(document).to.be.golden();
	});

	it('error', async() => {
		writeTextStub = stub(navigator.clipboard, 'writeText').rejects('NotAllowedError');
		const elem = await fixture(template, { viewport: { width: 700, height: 200 } });
		await clickAction(elem);
		await expect(document).to.be.golden();
	});

	it('icon reverts to copy after timeout', async() => {
		writeTextStub = stub(navigator.clipboard, 'writeText').resolves();
		const elem = await fixture(template, { viewport: { width: 700, height: 200 } });
		await clickAction(elem);

		await waitUntil(() => {
			const buttonIcon = elem.shadowRoot.querySelector('d2l-button-icon');
			return buttonIcon.icon === 'tier1:copy';
		}, 'icon did not revert to copy', { timeout: 3000 });

		await expect(elem).to.be.golden();
	});

});
