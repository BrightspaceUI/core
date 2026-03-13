import '../button-subtle-copy.js';
import { clickElem, expect, fixture, oneEvent } from '@brightspace-ui/testing';
import { stub, useFakeTimers } from 'sinon';
import { html } from 'lit';

const clickAction = async(elem) => {
	clickElem(elem);
	const { detail } = await oneEvent(elem, 'click');
	return detail.writeTextToClipboard('donuts are yummy!');
};

describe('button-subtle-copy', () => {

	const template = html`<d2l-button-subtle-copy text="Copy text"></d2l-button-subtle-copy>`;

	let writeTextStub;

	afterEach(() => writeTextStub?.restore());

	it('normal', async() => {
		const elem = await fixture(template, { viewport: { width: 500, height: 200 } });
		await expect(elem).to.be.golden();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-button-subtle-copy text="Copy text" disabled></d2l-button-subtle-copy>`, { viewport: { width: 500, height: 200 } });
		await expect(elem).to.be.golden();
	});

	it('click', async() => {
		writeTextStub = stub(navigator.clipboard, 'writeText').resolves();
		const elem = await fixture(template, { viewport: { width: 500, height: 200 } });
		await clickAction(elem);
		await expect(document).to.be.golden();
	});

	it('error', async() => {
		writeTextStub = stub(navigator.clipboard, 'writeText').rejects('NotAllowedError');
		const elem = await fixture(template, { viewport: { width: 700, height: 200 } });
		await clickAction(elem);
		await expect(document).to.be.golden();
	});

	describe('timeout', () => {
		let clock;
		beforeEach(() => {
			clock = useFakeTimers({ toFake: ['clearTimeout', 'setTimeout'] });
		});

		afterEach(() => {
			clock?.restore();
		});

		it('icon reverts to copy after timeout', async() => {
			writeTextStub = stub(navigator.clipboard, 'writeText').resolves();
			const elem = await fixture(template, { viewport: { width: 500, height: 200 } });
			await clickAction(elem);

			clock.tick(4000);
			await elem.updateComplete;

			await expect(elem).to.be.golden();
		});

	});

});
