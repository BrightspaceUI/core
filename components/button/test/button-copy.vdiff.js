import '../button-copy.js';
import { clickElem, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { stub, useFakeTimers } from 'sinon';

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
			const elem = await fixture(template, { viewport: { width: 700, height: 200 } });
			await clickAction(elem);

			clock.tick(2000);
			await elem.updateComplete;

			await expect(elem).to.be.golden();
		});

		it('clears previous timeout on multiple clicks', async() => {
			writeTextStub = stub(navigator.clipboard, 'writeText').resolves();
			const elem = await fixture(template, { viewport: { width: 700, height: 200 } });

			// First click - icon should be check
			await clickAction(elem);

			// Advance time partway through timeout
			clock.tick(1000);

			// Second click before timeout expires - icon should still be check but timeout resets
			await clickAction(elem);
			await elem.updateComplete;

			// Advance only 1500ms more (not enough if first timeout was still active)
			clock.tick(1500);
			await elem.updateComplete;
			// Icon should still be check because second timeout hasn't expired yet
			await expect(elem).to.be.golden();
		});

	});

});
