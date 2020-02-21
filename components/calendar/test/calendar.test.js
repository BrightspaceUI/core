import '../calendar.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const normalFixture = html`<d2l-calendar selected-value="2015-09-02T12:00Z"></d2l-calendar>`;

describe('d2l-calendar', () => {

	it('passes all axe tests', async() => {
		const calendar = await fixture(normalFixture);
		await expect(calendar).to.be.accessible();
	});

	it('dispatches event when date clicked', async() => {
		const calendar = await fixture(normalFixture);
		const el = calendar.shadowRoot.querySelector('div[data-date="1"]');
		setTimeout(() => el.click());
		const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
		expect(detail.date).to.equal('2015-9-1');
	});

	it('dispatches event when date in previous month clicked', async() => {
		const calendar = await fixture(normalFixture);
		const el = calendar.shadowRoot.querySelector('div[data-date="31"][data-month="7"]');
		setTimeout(() => el.click());
		const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
		expect(detail.date).to.equal('2015-8-31');
	});

	it('dispatches event when date in next month clicked', async() => {
		const calendar = await fixture(normalFixture);
		const el = calendar.shadowRoot.querySelector('div[data-date="1"][data-month="9"]');
		setTimeout(() => el.click());
		const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
		expect(detail.date).to.equal('2015-10-1');
	});

	it('dispatches event when enter key pressed on date', async() => {
		const calendar = await fixture(normalFixture);
		const el = calendar.shadowRoot.querySelector('div[data-date="20"]');
		setTimeout(() => dispatchKeyEvent(el, 13));
		const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
		expect(detail.date).to.equal('2015-9-20');
	});

	it('dispatches event when space key pressed on date', async() => {
		const calendar = await fixture(normalFixture);
		const el = calendar.shadowRoot.querySelector('div[data-date="2"]');
		setTimeout(() => dispatchKeyEvent(el, 32));
		const { detail } = await oneEvent(calendar, 'd2l-calendar-selected');
		expect(detail.date).to.equal('2015-9-2');
	});

	function dispatchKeyEvent(el, key) {
		const eventObj = document.createEvent('Events');
		eventObj.initEvent('keydown', true, true);
		eventObj.which = key;
		eventObj.keyCode = key;
		el.dispatchEvent(eventObj);
	}

});
