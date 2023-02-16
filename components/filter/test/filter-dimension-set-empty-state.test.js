import '../filter-dimension-set-empty-state.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import { spy } from 'sinon';

const emptyStateFixture = html`
	<d2l-filter-dimension-set-empty-state action-href="https://d2l.com" action-text="Link text" description="Empty state description"></d2l-filter-dimension-set-empty-state>
`;

describe('d2l-filter-dimension-set-empty-state', () => {

	it('should construct', () => {
		runConstructor('d2l-filter-dimension-set-empty-state');
	});

	describe('empty-state change', () => {
		[
			{ property: 'actionHref', value: 'https://google.ca' },
			{ property: 'actionText', value: 'Click me' },
			{ property: 'description', value: 'Changed empty state description' }
		].forEach(condition => {
			it(`fires data change event when its ${condition.property} data changes`, async() => {
				const elem = await fixture(emptyStateFixture);
				const eventSpy = spy(elem, 'dispatchEvent');
				if (condition.property === 'actionHref' || condition.property === 'actionText' || condition.property === 'description') elem[condition.property] = condition.value;

				const e = await oneEvent(elem, 'd2l-filter-dimension-set-empty-state-change');
				expect(e.detail.changes.size).to.equal(1);
				expect(e.detail.changes.get(condition.property)).to.equal(condition.value);
				expect(eventSpy).to.be.calledOnce;
			});
		});
	});

});
