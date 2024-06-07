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
			{ property: 'startValue', value: '2024-06-06T13:39:13.519Z' },
			{ property: 'endValue', value: '2024-06-07T13:39:13.519Z' }
		].forEach(condition => {
			it(`fires data change event when its ${condition.property} data changes`, async() => {
				const elem = await fixture(valuefixture);
				const eventSpy = spy(elem, 'dispatchEvent');
				if (condition.property === 'count'
					|| condition.property === 'disabled'
					|| condition.property === 'selected'
					|| condition.property === 'text'
					|| condition.property === 'startValue'
					|| condition.property === 'endValue')
					elem[condition.property] = condition.value;

				const e = await oneEvent(elem, 'd2l-filter-dimension-set-value-data-change');
				expect(e.detail.valueKey).to.equal('value');
				expect(e.detail.changes.size).to.equal(1);
				expect(e.detail.changes.get(condition.property)).to.equal(condition.value);
				expect(eventSpy).to.be.calledOnce;
			});
		});
	});

	describe('_handleRange', () => {
		[
			{ range: 'today', expected: { text: 'Today', startValue: '2018-02-12T05:00:00.000Z', endValue: '2018-02-13T04:59:59.000Z' } },
			{ range: '24hours', expected: { text: '24 Hours', startValue: '2018-02-11T20:00:00.000Z', endValue: '2018-02-12T20:00:00.000Z' } },
			{ range: '7days', expected: { text: '7 Days', startValue: '2018-02-05T20:00:00.000Z', endValue: '2018-02-12T20:00:00.000Z' } },
			{ range: '6months', expected: { text: '6 Months', startValue: '2017-08-12T19:00:00.000Z', endValue: '2018-02-12T20:00:00.000Z' } }
		].forEach(range => {
			it(`sets text, startValue, and endValue for range=${range.range}`, async() => {
				const newToday = new Date('2018-02-12T20:00:00Z');
				const clock = useFakeTimers({ now: newToday.getTime(), toFake: ['Date'] });

				const elem = await fixture(html`<d2l-filter-dimension-set-date-text-value key="my-key" range="${range.range}"></d2l-filter-dimension-set-date-text-value>`);
				await elem.updateComplete;
				Object.keys(range.expected).forEach((key) => {
					expect(elem[key]).to.equal(range.expected[key]);
				});
				clock.restore();
			});
		});
	});
});
