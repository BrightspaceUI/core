import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import '../filter-dimension-set-empty-state.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import { spy } from 'sinon';

const dimensionfixture = html`
	<d2l-filter-dimension-set key="dim" text="Dim">
		<d2l-filter-dimension-set-value key="1" text="Value 1"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="2" text="Value 2"></d2l-filter-dimension-set-value>
	</d2l-filter-dimension-set>`;

const emptyStateDimensionFixture = html`
	<d2l-filter-dimension-set key="dim" text="Dim">
		<d2l-filter-dimension-set-value key="1" text="Value 1"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="2" text="Value 2"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-empty-state id="search-empty-state" slot="search-empty-state" description="Empty state description"></d2l-filter-dimension-set-empty-state>
		<d2l-filter-dimension-set-empty-state id="set-empty-state" slot="set-empty-state" description="Empty state description" action-text="Action text" action-href="https://d2l.com"></d2l-filter-dimension-set-empty-state>
	</d2l-filter-dimension-set>`;

describe('d2l-filter-dimension-set', () => {

	it('should construct', () => {
		runConstructor('d2l-filter-dimension-set');
	});

	describe('slot change', () => {
		it('values added after initial render are handled', async() => {
			const elem = await fixture(dimensionfixture);
			expect(elem.querySelectorAll('d2l-filter-dimension-set-value').length).to.equal(2);

			const newValue = document.createElement('d2l-filter-dimension-set-value');
			newValue.key = 'newValue';
			elem.appendChild(newValue);
			await elem.updateComplete;

			const values = elem.querySelectorAll('d2l-filter-dimension-set-value');
			expect(values.length).to.equal(3);
			expect(values[0].key).to.equal('1');
			expect(values[1].key).to.equal('2');
			expect(values[2].key).to.equal('newValue');
		});

	});

	describe('data change', () => {
		it('fires data change event when its data changes', async() => {
			const elem = await fixture(dimensionfixture);
			const eventSpy = spy(elem, 'dispatchEvent');
			elem.text = 'Test';
			elem.loading = true;

			const e = await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(e.detail.dimensionKey).to.equal('dim');
			expect(e.detail.valueKey).to.be.undefined;
			expect(e.detail.changes.size).to.equal(2);
			expect(e.detail.changes.get('text')).to.equal('Test');
			expect(e.detail.changes.get('loading')).to.equal(true);
			expect(eventSpy).to.be.calledOnce;
		});

		it('fires data change event when data changes in one of its values', async() => {
			const elem = await fixture(dimensionfixture);
			const eventSpy = spy(elem, 'dispatchEvent');
			const value = elem.querySelector('d2l-filter-dimension-set-value[key="2"]');
			setTimeout(() => value.selected = true);

			const e = await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(e.detail.dimensionKey).to.equal('dim');
			expect(e.detail.valueKey).to.equal('2');
			expect(e.detail.changes.size).to.equal(1);
			expect(e.detail.changes.get('selected')).to.be.true;
			expect(eventSpy).to.be.calledOnce;
		});

		it('fires empty state change event when data changes in search empty state', async() => {
			const elem = await fixture(emptyStateDimensionFixture);
			const eventSpy = spy(elem, 'dispatchEvent');
			const searchEmptyState = elem.querySelector('#search-empty-state');
			setTimeout(() => searchEmptyState.actionText = 'Changed!');

			const e = await oneEvent(elem, 'd2l-filter-dimension-empty-state-change');
			expect(e.detail.dimensionKey).to.equal('dim');
			expect(e.detail.changes.size).to.equal(1);
			expect(e.detail.changes.get('actionText')).to.equal('Changed!');
			expect(eventSpy).to.be.calledOnce;
		});

		it('fires empty state change event when data changes in set empty state', async() => {
			const elem = await fixture(emptyStateDimensionFixture);
			const eventSpy = spy(elem, 'dispatchEvent');
			const setEmptyState = elem.querySelector('#set-empty-state');
			setTimeout(() => setEmptyState.description = 'Changed!');

			const e = await oneEvent(elem, 'd2l-filter-dimension-empty-state-change');
			expect(e.detail.dimensionKey).to.equal('dim');
			expect(e.detail.changes.size).to.equal(1);
			expect(e.detail.changes.get('description')).to.equal('Changed!');
			expect(eventSpy).to.be.calledOnce;
		});
	});
});
