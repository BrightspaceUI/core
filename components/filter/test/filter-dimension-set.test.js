import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import '../filter-dimension-set-empty-state.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import { spy } from 'sinon';

const dimensionfixture = html`
	<d2l-filter-dimension-set key="dim" text="Dim">
		<d2l-filter-dimension-set-value key="1" text="Value 1"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="2" text="Value 2"></d2l-filter-dimension-set-value>
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

		it('handles search-empty-state slot change', async() => {
			const elem = await fixture(dimensionfixture);
			const eventSpy = spy(elem, 'dispatchEvent');

			const emptyState = document.createElement('d2l-filter-dimension-set-empty-state');
			emptyState.actionHref = 'https://d2l.com';
			emptyState.actionText = 'Click me';
			emptyState.description = 'Description';
			emptyState.slot = 'search-empty-state';
			setTimeout(() => elem.appendChild(emptyState));

			const e = await oneEvent(elem, 'd2l-filter-dimension-data-change');

			expect(e.detail.dimensionKey).to.equal('dim');
			expect(e.detail.changes.size).to.equal(1);
			expect(e.detail.changes.get('searchEmptyState').actionHref).to.equal('https://d2l.com');
			expect(e.detail.changes.get('searchEmptyState').actionText).to.equal('Click me');
			expect(e.detail.changes.get('searchEmptyState').description).to.equal('Description');
			expect(eventSpy).to.be.calledOnce;
		});

		it('handles set-empty-state slot change', async() => {
			const elem = await fixture(dimensionfixture);
			const eventSpy = spy(elem, 'dispatchEvent');

			const emptyState = document.createElement('d2l-filter-dimension-set-empty-state');
			emptyState.actionHref = 'https://d2l.com';
			emptyState.actionText = 'Click me';
			emptyState.description = 'Description';
			emptyState.slot = 'set-empty-state';
			setTimeout(() => elem.appendChild(emptyState));

			const e = await oneEvent(elem, 'd2l-filter-dimension-data-change');

			expect(e.detail.dimensionKey).to.equal('dim');
			expect(e.detail.changes.size).to.equal(1);
			expect(e.detail.changes.get('setEmptyState').actionHref).to.equal('https://d2l.com');
			expect(e.detail.changes.get('setEmptyState').actionText).to.equal('Click me');
			expect(e.detail.changes.get('setEmptyState').description).to.equal('Description');
			expect(eventSpy).to.be.calledOnce;
		});
	});

	describe('data change', () => {
		it('fires data change event when its data changes', async() => {
			const elem = await fixture(dimensionfixture);
			const eventSpy = spy(elem, 'dispatchEvent');
			elem.text = 'Test';
			elem.loading = true;
			elem.pagerHasMore = true;

			const e = await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(e.detail.dimensionKey).to.equal('dim');
			expect(e.detail.valueKey).to.be.undefined;
			expect(e.detail.changes.size).to.equal(3);
			expect(e.detail.changes.get('text')).to.equal('Test');
			expect(e.detail.changes.get('loading')).to.equal(true);
			expect(e.detail.changes.get('pagerHasMore')).to.equal(true);
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
	});
});
