import '../filter-dimension-set-value.js';
import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import { spy } from 'sinon';

const valuefixture = html`
	<d2l-filter-dimension-set-value key="value" text="Value" count="100"></d2l-filter-dimension-set-value>
`;

describe('d2l-filter-dimension-set-value', () => {

	it('should construct', () => {
		runConstructor('d2l-filter-dimension-set-value');
	});

	describe('data change', () => {
		[
			{ property: 'count', value: 1 },
			{ property: 'disabled', value: true },
			{ property: 'selected', value: true },
			{ property: 'text', value: 'Test' }
		].forEach(condition => {
			it(`fires data change event when its ${condition.property} data changes`, async() => {
				const elem = await fixture(valuefixture);
				const eventSpy = spy(elem, 'dispatchEvent');
				if (condition.property === 'count' || condition.property === 'disabled' || condition.property === 'selected' || condition.property === 'text') elem[condition.property] = condition.value;

				const e = await oneEvent(elem, 'd2l-filter-dimension-set-value-data-change');
				expect(e.detail.valueKey).to.equal('value');
				expect(e.detail.changes.size).to.equal(1);
				expect(e.detail.changes.get(condition.property)).to.equal(condition.value);
				expect(eventSpy).to.be.calledOnce;
			});
		});
	});

	describe('validation of invalid data inputs for count', () => {
		[
			{ type: 'negative', value: -12, result: 0 },
			{ type: 'decimal', value: 12.35, result: 12 },
			{ type: 'string', value: 'Test', result: undefined }
		].forEach(condition => {
			it(`checks validation for ${condition.type} inputs`, async() => {
				const elem = await fixture(valuefixture);
				const eventSpy = spy(elem, 'dispatchEvent');
				elem.count = condition.value;

				const e = await oneEvent(elem, 'd2l-filter-dimension-set-value-data-change');
				expect(e.detail.valueKey).to.equal('value');
				expect(e.detail.changes.size).to.equal(1);
				expect(e.detail.changes.get('count')).to.equal(condition.result);
				expect(eventSpy).to.be.calledOnce;
			});
		});
	});
});
