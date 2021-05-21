import '../filter-dimension-set-value.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import { spy } from 'sinon';

const valuefixture = html`
	<d2l-filter-dimension-set-value key="value" text="Value"></d2l-filter-dimension-set-value>
`;

describe('d2l-filter-dimension-set-value', () => {

	it('should construct', () => {
		runConstructor('d2l-filter-dimension-set-value');
	});

	describe('data change', () => {
		it('fires data change event when its data changes', async() => {
			const elem = await fixture(valuefixture);
			const eventSpy = spy(elem, 'dispatchEvent');
			elem.text = 'Test';

			const e = await oneEvent(elem, 'd2l-filter-dimension-set-value-data-change');
			expect(e.detail.valueKey).to.equal('value');
			expect(e.detail.changes.size).to.equal(1);
			expect(e.detail.changes.get('text')).to.equal('Test');
			expect(eventSpy).to.be.calledOnce;
		});
	});
});
