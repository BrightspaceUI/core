import '../filter-dimension-set-value.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import { spy } from 'sinon';

const valuefixture = html`
	<d2l-filter-dimension-set-value key="value" text="Value" count="0"></d2l-filter-dimension-set-value>
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

				const e = await oneEvent(elem, 'd2l-filter-dimension-set-value-data-change');
				expect(e.detail.valueKey).to.equal('value');
				expect(e.detail.changes.size).to.equal(1);
				expect(e.detail.changes.get(condition.property)).to.equal(condition.value);
				expect(eventSpy).to.be.calledOnce;
			});
		});
	});
});
