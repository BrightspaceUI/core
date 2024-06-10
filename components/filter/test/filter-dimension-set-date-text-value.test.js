import '../filter-dimension-set-date-text-value.js';
import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { spy, useFakeTimers } from 'sinon';
import { getDocumentLocaleSettings } from '@brightspace-ui/intl/lib/common.js';

const valuefixture = html`
	<d2l-filter-dimension-set-date-text-value key="value" range="24hours"></d2l-filter-dimension-set-date-text-value>
`;

describe('d2l-filter-dimension-set-date-text-value', () => {
	const documentLocaleSettings = getDocumentLocaleSettings();
	documentLocaleSettings.timezone.identifier = 'America/Toronto';

	it('should construct', () => {
		runConstructor('d2l-filter-dimension-set-date-text-value');
	});

	describe('data change', () => {
		[
			{ property: 'disabled', value: true },
			{ property: 'selected', value: true },
			{ property: 'text', value: 'Test' },
			{ property: 'rangeType', value: 'days' },
			{ property: 'rangeNum', value: 30 },
		].forEach(condition => {
			it(`fires data change event when its ${condition.property} data changes`, async() => {
				const elem = await fixture(valuefixture);
				const eventSpy = spy(elem, 'dispatchEvent');
				if (condition.property === 'disabled'
					|| condition.property === 'selected'
					|| condition.property === 'text'
					|| condition.property === 'rangeType'
					|| condition.property === 'rangeNum')
					elem[condition.property] = condition.value;

				const e = await oneEvent(elem, 'd2l-filter-dimension-set-value-data-change');
				expect(e.detail.valueKey).to.equal('value');
				expect(e.detail.changes.size).to.equal(1);
				expect(e.detail.changes.get(condition.property)).to.equal(condition.value);
				expect(eventSpy).to.be.calledOnce;
			});
		});

		it('sets startValue and endValue when initially selected', async() => {
			const newToday = new Date('2018-02-12T20:00:00Z');
			const clock = useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });

			const elem = await fixture(html`<d2l-filter-dimension-set-date-text-value key="my-key" range="lastHour" selected></d2l-filter-dimension-set-date-text-value>`);
			expect(elem.startValue).to.equal('2018-02-12T19:00:00.000Z');
			expect(elem.endValue).to.equal('2018-02-12T20:00:00.000Z');

			clock.restore();
		});

		it('does not set startValue and endValue when not selected', async() => {
			const elem = await fixture(valuefixture);
			expect(elem.startValue).to.be.undefined;
			expect(elem.endValue).to.be.undefined;
		});

		it('updates text when "rangeType" changes', async() => {
			const elem = await fixture(valuefixture);
			elem.rangeType = 'days';
			await elem.updateComplete;
			expect(elem.text).to.equal('Last 24 days');
		});

		it('updates text when "rangeNum" changes', async() => {
			const elem = await fixture(valuefixture);
			elem.rangeNum = 30;
			await elem.updateComplete;
			expect(elem.text).to.equal('Last 30 hours');
		});
	});

	describe('_handleRange', () => {
		[
			{ range: 'today', expected: { text: 'Today', startValue: '2018-02-12T05:00:00.000Z', endValue: '2018-02-13T04:59:59.000Z' } },
			{ range: 'lastHour', expected: { text: 'Last hour', startValue: '2018-02-12T19:00:00.000Z', endValue: '2018-02-12T20:00:00.000Z' } },
			{ range: '24hours', expected: { text: 'Last 24 hours', startValue: '2018-02-11T20:00:00.000Z', endValue: '2018-02-12T20:00:00.000Z' } },
			{ range: '7days', expected: { text: 'Last 7 days', startValue: '2018-02-05T20:00:00.000Z', endValue: '2018-02-12T20:00:00.000Z' } },
			{ range: '6months', expected: { text: 'Last 6 months', startValue: '2017-08-12T19:00:00.000Z', endValue: '2018-02-12T20:00:00.000Z' } }
		].forEach(range => {
			it(`sets text, startValue, and endValue for range=${range.range}`, async() => {
				const newToday = new Date('2018-02-12T20:00:00Z');
				const clock = useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });

				const elem = await fixture(html`<d2l-filter-dimension-set-date-text-value key="my-key" range="${range.range}" selected></d2l-filter-dimension-set-date-text-value>`);
				Object.keys(range.expected).forEach((key) => {
					expect(elem[key]).to.equal(range.expected[key]);
				});

				clock.restore();
			});
		});
	});
});
