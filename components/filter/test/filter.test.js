import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { spy, stub } from 'sinon';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const singleSetDimensionFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="dim" text="Dim" select-all>
			<d2l-filter-dimension-set-value key="1" text="Value 1" selected></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="2" text="Value 2"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>`;
const singleSetDimensionSingleSelectionFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="dim" text="Dim" selection-single>
			<d2l-filter-dimension-set-value key="1" text="Value 1" selected></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="2" text="Value 2"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>`;
const multiDimensionFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="1" text="Dim 1">
			<d2l-filter-dimension-set-value key="1" text="Value 1" selected></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
		<d2l-filter-dimension-set key="2" text="Dim 2">
			<d2l-filter-dimension-set-value key="1" text="Value 1"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>`;

describe('d2l-filter', () => {

	it('should construct', () => {
		runConstructor('d2l-filter');
	});

	describe('loading', () => {
		it('single set dimension - loading spinner and select all disabled', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			const dim = elem.querySelector('d2l-filter-dimension-set');
			expect(elem.shadowRoot.querySelector('d2l-loading-spinner')).to.be.null;
			expect(elem.shadowRoot.querySelector('d2l-selection-select-all').disabled).to.be.false;

			dim.loading = true;
			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			await elem.updateComplete;

			expect(elem.shadowRoot.querySelector('d2l-loading-spinner')).to.not.be.null;
			expect(elem.shadowRoot.querySelector('d2l-selection-select-all').disabled).to.be.true;
		});
	});

	describe('info messages', () => {
		it('set dimension - empty state', async() => {
			const elem = await fixture('<d2l-filter><d2l-filter-dimension-set key="dim"></d2l-filter-dimension-set></d2l-filter>');
			expect(elem.shadowRoot.querySelector('.d2l-filter-dimension-info-message').textContent).to.include('No available filters');
		});

		it('set dimension - no search results', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			elem._handleSearch({ detail: { value: 'no results' } });
			elem.requestUpdate();
			await elem.updateComplete;

			const infoMessage = elem.shadowRoot.querySelector('.d2l-filter-dimension-info-message');
			expect(infoMessage.textContent).to.include('0 search results');
			expect(infoMessage.classList.contains('d2l-offscreen')).to.be.false;
		});

		it('set dimension - search results (offscreen)', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			elem._handleSearch({ detail: { value: '1' } });
			elem.requestUpdate();
			await elem.updateComplete;

			const infoMessage = elem.shadowRoot.querySelector('.d2l-filter-dimension-info-message');
			expect(infoMessage.textContent).to.include('1 search result');
			expect(infoMessage.classList.contains('d2l-offscreen')).to.be.true;

			elem._handleSearch({ detail: { value: 'value' } });
			elem.requestUpdate();
			await elem.updateComplete;

			expect(infoMessage.textContent).to.include('2 search results');
			expect(infoMessage.classList.contains('d2l-offscreen')).to.be.true;
		});
	});

	describe('searching', () => {
		it('set dimension - no search', async() => {
			const elem = await fixture('<d2l-filter><d2l-filter-dimension-set key="dim" search-type="none"></d2l-filter-dimension-set></d2l-filter>');
			expect(elem.shadowRoot.querySelector('d2l-input-search')).to.be.null;
		});

		it('set dimension - manual search sets loading state to true and then back to false when callback is run', async() => {
			const elem = await fixture('<d2l-filter><d2l-filter-dimension-set key="dim" search-type="manual"></d2l-filter-dimension-set></d2l-filter>');
			expect(elem._dimensions[0].loading).to.be.false;

			setTimeout(() => elem._handleSearch({ detail: { value: 'manual search' } }));
			const e = await oneEvent(elem, 'd2l-filter-dimension-search');

			expect(elem._dimensions[0].loading).to.be.true;
			expect(e.detail.key).to.equal('dim');
			expect(e.detail.value).to.equal('manual search');

			e.detail.searchCompleteCallback();
			await new Promise(resolve => { requestAnimationFrame(resolve); });
			expect(elem._dimensions[0].loading).to.be.false;
		});

		it('set dimension - manual search takes an array of keys to display', async() => {
			const elem = await fixture(`<d2l-filter><d2l-filter-dimension-set key="dim" search-type="manual">
				<d2l-filter-dimension-set-value key="test"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="test2"></d2l-filter-dimension-set-value>
			</d2l-filter-dimension-set></d2l-filter>`);
			expect(elem._dimensions[0].values[0].hidden).to.be.undefined;
			expect(elem._dimensions[0].values[1].hidden).to.be.undefined;

			setTimeout(() => elem._handleSearch({ detail: { value: 'whatever' } }));
			const e = await oneEvent(elem, 'd2l-filter-dimension-search');

			e.detail.searchCompleteCallback(['test']);
			await new Promise(resolve => { requestAnimationFrame(resolve); });
			expect(elem._dimensions[0].values[0].hidden).to.be.false;
			expect(elem._dimensions[0].values[1].hidden).to.be.true;
		});

		[
			{ name: 'handles empty', value: '', results: [false, false] },
			{ name: 'is case insensitive', value: 'VaLuE', results: [false, false] },
			{ name: 'trims input', value: '      val      ', results: [false, false] },
			{ name: 'works with numbers', value: '1', results: [false, true] },
			{ name: 'works with spaces', value: 'e 2', results: [true, false] },
			{ name: 'hides as expected', value: 'values', results: [true, true] }
		].forEach(testCase => {
			it(`set dimension - automatic search ${testCase.name}`, async() => {
				const elem = await fixture(singleSetDimensionFixture);
				elem._handleSearch({ detail: { value: testCase.value } });
				elem.requestUpdate();
				await elem.updateComplete;

				expect(elem._dimensions[0].values[0].hidden).to.equal(testCase.results[0]);
				expect(elem._dimensions[0].values[1].hidden).to.equal(testCase.results[1]);
			});
		});
	});

	describe('events', () => {
		describe('d2l-filter-change', () => {
			it('single set dimension fires change events', async() => {
				const elem = await fixture(singleSetDimensionFixture);
				const value = elem.shadowRoot.querySelector('d2l-list-item[key="2"]');
				expect(elem._dimensions[0].values[1].selected).to.be.false;

				setTimeout(() => value.setSelected(true));
				let e = await oneEvent(elem, 'd2l-filter-change');
				let dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('dim');
				let changes = dimensions[0].changes;
				expect(changes.length).to.equal(1);
				expect(changes[0].valueKey).to.equal('2');
				expect(changes[0].selected).to.be.true;
				expect(elem._dimensions[0].values[1].selected).to.be.true;

				setTimeout(() => value.setSelected(false));
				e = await oneEvent(elem, 'd2l-filter-change');
				dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('dim');
				changes = dimensions[0].changes;
				expect(changes[0].valueKey).to.equal('2');
				expect(changes[0].selected).to.be.false;
				expect(elem._dimensions[0].values[1].selected).to.be.false;
			});

			it('single set dimension with selection-single on fires change events', async() => {
				const elem = await fixture(singleSetDimensionSingleSelectionFixture);
				const value = elem.shadowRoot.querySelector('d2l-list-item[key="2"]');
				expect(elem._dimensions[0].values[0].selected).to.be.true;
				expect(elem._dimensions[0].values[1].selected).to.be.false;

				setTimeout(() => value.setSelected(true));
				let e = await oneEvent(elem, 'd2l-filter-change');
				let dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('dim');
				expect(dimensions[0].changes.length).to.equal(2);
				expect(dimensions[0].changes[0].valueKey).to.equal('2');
				expect(dimensions[0].changes[0].selected).to.be.true;
				expect(dimensions[0].changes[1].valueKey).to.equal('1');
				expect(dimensions[0].changes[1].selected).to.be.false;
				expect(elem._dimensions[0].values[0].selected).to.be.false;
				expect(elem._dimensions[0].values[1].selected).to.be.true;

				setTimeout(() => value.setSelected(false));
				e = await oneEvent(elem, 'd2l-filter-change');
				dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('dim');
				expect(dimensions[0].changes.length).to.equal(1);
				expect(dimensions[0].changes[0].valueKey).to.equal('2');
				expect(dimensions[0].changes[0].selected).to.be.false;
				expect(elem._dimensions[0].values[1].selected).to.be.false;
			});

			it('multiple dimensions fire change events', async() => {
				const elem = await fixture(multiDimensionFixture);
				const value1 = elem.shadowRoot.querySelector('[data-key="1"] d2l-list-item[key="1"]');
				const value2 = elem.shadowRoot.querySelector('[data-key="2"] d2l-list-item[key="1"]');
				expect(elem._dimensions[0].values[0].selected).to.be.true;
				expect(elem._dimensions[1].values[0].selected).to.be.false;

				setTimeout(() => value1.setSelected(false));
				let e = await oneEvent(elem, 'd2l-filter-change');
				let dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('1');
				expect(dimensions[0].changes.length).to.equal(1);
				expect(dimensions[0].changes[0].valueKey).to.equal('1');
				expect(dimensions[0].changes[0].selected).to.be.false;
				expect(elem._dimensions[0].values[0].selected).to.be.false;

				setTimeout(() => value2.setSelected(true));
				e = await oneEvent(elem, 'd2l-filter-change');
				dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('2');
				expect(dimensions[0].changes.length).to.equal(1);
				expect(dimensions[0].changes[0].valueKey).to.equal('1');
				expect(dimensions[0].changes[0].selected).to.be.true;
				expect(elem._dimensions[1].values[0].selected).to.be.true;
			});

			it('change events are batched', async() => {
				const elem = await fixture(multiDimensionFixture);
				const value1 = elem.shadowRoot.querySelector('[data-key="1"] d2l-list-item[key="1"]');
				const value2 = elem.shadowRoot.querySelector('[data-key="2"] d2l-list-item[key="1"]');
				expect(elem._dimensions[0].values[0].selected).to.be.true;
				expect(elem._dimensions[1].values[0].selected).to.be.false;

				setTimeout(() => {
					value1.setSelected(false);
					value2.setSelected(true);
				});
				const e = await oneEvent(elem, 'd2l-filter-change');
				const dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(2);
				expect(dimensions[0].dimensionKey).to.equal('1');
				expect(dimensions[0].changes.length).to.equal(1);
				expect(dimensions[0].changes[0].valueKey).to.equal('1');
				expect(dimensions[0].changes[0].selected).to.be.false;
				expect(elem._dimensions[0].values[0].selected).to.be.false;
				expect(dimensions[1].dimensionKey).to.equal('2');
				expect(dimensions[1].changes.length).to.equal(1);
				expect(dimensions[1].changes[0].valueKey).to.equal('1');
				expect(dimensions[1].changes[0].selected).to.be.true;
				expect(elem._dimensions[1].values[0].selected).to.be.true;
			});

			it('only the final state for the same value is sent per batch', async() => {
				const elem = await fixture(multiDimensionFixture);
				const value = elem.shadowRoot.querySelector('[data-key="1"] d2l-list-item[key="1"]');
				expect(elem._dimensions[0].values[0].selected).to.be.true;
				const setupSpy = spy(elem, '_dispatchChangeEvent');
				const dispatchSpy = spy(elem, 'dispatchEvent');

				setTimeout(() => {
					value.setSelected(false);
					value.setSelected(true);
					value.setSelected(false);
					value.setSelected(true);
				});
				const e = await oneEvent(elem, 'd2l-filter-change');
				const dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('1');
				expect(dimensions[0].changes.length).to.equal(1);
				expect(dimensions[0].changes[0].valueKey).to.equal('1');
				expect(dimensions[0].changes[0].selected).to.be.true;
				expect(elem._dimensions[0].values[0].selected).to.be.true;
				expect(setupSpy.callCount).to.equal(4);
				expect(dispatchSpy.callCount).to.equal(1);
			});
		});

		describe('d2l-filter-dimension-first-open', () => {
			it('single set dimension fires dimension first open event', async() => {
				const elem = await fixture(singleSetDimensionFixture);
				const eventSpy = spy(elem, 'dispatchEvent');
				const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
				const dropdownContent = elem.shadowRoot.querySelector('d2l-dropdown-content');
				await dropdownContent.updateComplete;
				setTimeout(() => dropdown.toggleOpen());
				const e = await oneEvent(elem, 'd2l-filter-dimension-first-open');
				expect(e.detail.key).to.equal('dim');
				expect(elem._openedDimensions[0]).to.equal('dim');

				setTimeout(() => dropdown.toggleOpen());
				await oneEvent(dropdown, 'd2l-dropdown-close');

				setTimeout(() => dropdown.toggleOpen());
				await oneEvent(dropdown, 'd2l-dropdown-open');

				expect(eventSpy).to.be.calledOnce;
			});

			it('multiple dimensions fire dimension first open events', async() => {
				const elem = await fixture(multiDimensionFixture);
				const eventSpy = spy(elem, 'dispatchEvent');
				const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
				const dimensions = elem.shadowRoot.querySelectorAll('d2l-menu-item');

				setTimeout(() => dropdown.toggleOpen());
				await oneEvent(dropdown, 'd2l-dropdown-open');
				expect(eventSpy).to.be.not.be.called;

				setTimeout(() => dimensions[0].click());
				let e = await oneEvent(elem, 'd2l-filter-dimension-first-open');
				expect(e.detail.key).to.equal('1');
				expect(eventSpy).to.be.calledOnce;

				setTimeout(() => dimensions[1].click());
				e = await oneEvent(elem, 'd2l-filter-dimension-first-open');
				expect(e.detail.key).to.equal('2');
				expect(eventSpy).to.be.calledTwice;

				setTimeout(() => dimensions[0].click());
				await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
				expect(eventSpy).to.be.calledTwice;
			});
		});

		describe('d2l-filter-dimension-search', () => {
			it('single set dimension fires search event for manual search-type', async() => {
				const elem = await fixture('<d2l-filter><d2l-filter-dimension-set key="dim" search-type="manual"></d2l-filter-dimension-set></d2l-filter>');
				const eventSpy = spy(elem, 'dispatchEvent');
				const search = elem.shadowRoot.querySelector('d2l-input-search');
				search.value = 'searching';

				setTimeout(() => search.search());
				const e = await oneEvent(elem, 'd2l-filter-dimension-search');

				expect(elem._dimensions[0].searchValue).to.equal('searching');
				expect(e.detail.value).to.equal('searching');
				expect(eventSpy).to.be.calledOnce;
			});

			it('single set dimension does not fire search event for clearing with manual search-type', async() => {
				const elem = await fixture('<d2l-filter><d2l-filter-dimension-set key="dim" search-type="manual"></d2l-filter-dimension-set></d2l-filter>');
				const eventSpy = spy(elem, 'dispatchEvent');
				const search = elem.shadowRoot.querySelector('d2l-input-search');
				search.value = '';
				search.search();
				elem.requestUpdate();
				await elem.updateComplete;

				expect(elem._dimensions[0].searchValue).to.equal('');
				expect(eventSpy).to.not.have.been.called;
			});

			it('single set dimension does not fire search event for automatic search-type', async() => {
				const elem = await fixture(singleSetDimensionFixture);
				const eventSpy = spy(elem, 'dispatchEvent');
				const search = elem.shadowRoot.querySelector('d2l-input-search');
				search.value = 'searching';
				search.search();
				elem.requestUpdate();
				await elem.updateComplete;

				expect(elem._dimensions[0].searchValue).to.equal('searching');
				expect(eventSpy).to.not.have.been.called;
			});
		});
	});

	describe('filter counts', () => {
		it('single set dimension is counted correctly', async() => {
			const elem = await fixture('<d2l-filter></d2l-filter>');
			elem._dimensions = [{
				key: 'dim',
				type: 'd2l-filter-dimension-set',
				values: [{ key: 1, selected: true }, { key: 2, selected: false }, { key: 3, selected: true }]
			}];
			expect(elem._totalAppliedCount).to.equal(0);

			elem._setFilterCounts();

			expect(elem._totalAppliedCount).to.equal(2);
			expect(elem._dimensions[0].appliedCount).to.equal(2);
		});

		it('multiple dimensions are counted correctly', async() => {
			const elem = await fixture('<d2l-filter></d2l-filter>');
			elem._dimensions = [{
				key: '1',
				type: 'd2l-filter-dimension-set',
				values: [{ key: 1, selected: true }, { key: 2, selected: false }, { key: 3, selected: true }]
			},
			{
				key: '2',
				type: 'd2l-filter-dimension-set',
				values: [{ key: 1, selected: true }, { key: 2, selected: false }, { key: 3, selected: false }]
			},
			{
				key: '3',
				type: 'd2l-filter-dimension-set',
				values: [{ key: 1, selected: false }, { key: 2, selected: false }]
			}];
			expect(elem._totalAppliedCount).to.equal(0);

			elem._setFilterCounts();

			expect(elem._totalAppliedCount).to.equal(3);
			expect(elem._dimensions[0].appliedCount).to.equal(2);
			expect(elem._dimensions[1].appliedCount).to.equal(1);
			expect(elem._dimensions[2].appliedCount).to.equal(0);
		});

		it('selection changes in a single set dimension adjusts the count correctly', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			const value1 = elem.shadowRoot.querySelector('d2l-list-item[key="1"]');
			const value2 = elem.shadowRoot.querySelector('d2l-list-item[key="2"]');
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._dimensions[0].appliedCount).to.equal(1);

			setTimeout(() => value1.setSelected(false));
			await oneEvent(elem, 'd2l-filter-change');
			expect(elem._totalAppliedCount).to.equal(0);
			expect(elem._dimensions[0].appliedCount).to.equal(0);

			setTimeout(() => value2.setSelected(true));
			await oneEvent(elem, 'd2l-filter-change');
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._dimensions[0].appliedCount).to.equal(1);
		});

		it('selection changes with multiple dimensions adjusts the count correctly', async() => {
			const elem = await fixture(multiDimensionFixture);
			const value1 = elem.shadowRoot.querySelector('[data-key="1"] d2l-list-item[key="1"]');
			const value2 = elem.shadowRoot.querySelector('[data-key="2"] d2l-list-item[key="1"]');
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._dimensions[0].appliedCount).to.equal(1);
			expect(elem._dimensions[1].appliedCount).to.equal(0);

			setTimeout(() => value2.setSelected(true));
			await oneEvent(elem, 'd2l-filter-change');
			expect(elem._totalAppliedCount).to.equal(2);
			expect(elem._dimensions[0].appliedCount).to.equal(1);
			expect(elem._dimensions[1].appliedCount).to.equal(1);

			setTimeout(() => value1.setSelected(false));
			await oneEvent(elem, 'd2l-filter-change');
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._dimensions[0].appliedCount).to.equal(0);
			expect(elem._dimensions[1].appliedCount).to.equal(1);
		});

		describe('_formatFilterCount', () => {
			[
				{ name: 'None Selected', appliedCount: 0, result: undefined },
				{ name: '1 Selected', appliedCount: 1, result: '1' },
				{ name: '2 Selected', appliedCount: 2, result: '2' },
				{ name: '99 Selected', appliedCount: 99, result: '99' },
				{ name: '100 Selected', appliedCount: 100, result: '99+' },
				{ name: '150 Selected', appliedCount: 150, result: '99+' },
			].forEach((testCase) => {
				it(`${testCase.name}`, async() => {
					const elem = await fixture(html`<d2l-filter></d2l-filter>`);
					const result = elem._formatFilterCount(testCase.appliedCount);
					expect(result).to.equal(testCase.result);
				});
			});
		});

		describe('Opener Count Format', () => {
			[
				{ name: 'Single Dim - None Selected', count: 0, dimensions: [{ key: 1, text: 'Role' }], text: 'Role', description: 'Filter by: Role. 0 filters applied.' },
				{ name: 'Single Dim - 1 Selected', count: 1, dimensions: [{ key: 1, text: 'Role' }], text: 'Role (1)', description: 'Filter by: Role. 1 filter applied.' },
				{ name: 'Single Dim - 5 Selected', count: 5, dimensions: [{ key: 1, text: 'Role' }], text: 'Role (5)', description: 'Filter by: Role. 5 filters applied.' },
				{ name: 'Single Dim - 99 Selected', count: 99, dimensions: [{ key: 1, text: 'Role' }], text: 'Role (99)', description: 'Filter by: Role. 99 filters applied.' },
				{ name: 'Single Dim - 100 Selected', count: 100, dimensions: [{ key: 1, text: 'Role' }], text: 'Role (99+)', description: 'Filter by: Role. 100 filters applied.' },
				{ name: 'Multiple Dims - None Selected', count: 0, dimensions: [{ key: 1, text: 'Role' }, { key: 2, text: 'Course' }], text: 'Filters', description: 'Filters. 0 filters applied.' },
				{ name: 'Multiple Dims - 1 Selected', count: 1, dimensions: [{ key: 1, text: 'Role' }, { key: 2, text: 'Course' }], text: 'Filters (1)', description: 'Filters. 1 filter applied.' },
				{ name: 'Multiple Dims - 5 Selected', count: 5, dimensions: [{ key: 1, text: 'Role' }, { key: 2, text: 'Course' }], text: 'Filters (5)', description: 'Filters. 5 filters applied.' },
				{ name: 'Multiple Dims - 99 Selected', count: 99, dimensions: [{ key: 1, text: 'Role' }, { key: 2, text: 'Course' }], text: 'Filters (99)', description: 'Filters. 99 filters applied.' },
				{ name: 'Multiple Dims - 100 Selected', count: 100, dimensions: [{ key: 1, text: 'Role' }, { key: 2, text: 'Course' }], text: 'Filters (99+)', description: 'Filters. 100 filters applied.' }
			].forEach((testCase) => {
				it(`${testCase.name}`, async() => {
					const elem = await fixture(html`<d2l-filter></d2l-filter>`);
					const opener = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
					elem._dimensions = testCase.dimensions;
					elem._totalAppliedCount = testCase.count;
					await elem.updateComplete;

					expect(opener.text).to.equal(testCase.text);
					expect(opener.description).to.equal(testCase.description);
				});
			});
		});

		describe('Menu Item Format', () => {
			[
				{ name: 'None Selected', dimensions: [{ key: 1, text: 'Role', appliedCount: 0 }, { key: 2 }], text: '', description: '0 filters applied.' },
				{ name: '1 Selected', dimensions: [{ key: 1, text: 'Role', appliedCount: 1 }, { key: 2 }], text: '1', description: '1 filter applied.' },
				{ name: '5 Selected', dimensions: [{ key: 1, text: 'Role', appliedCount: 5 }, { key: 2 }], text: '5', description: '5 filters applied.' },
				{ name: '99 Selected', dimensions: [{ key: 1, text: 'Role', appliedCount: 99 }, { key: 2 }], text: '99', description: '99 filters applied.' },
				{ name: '100 Selected', dimensions: [{ key: 1, text: 'Role', appliedCount: 100 }, { key: 2 }], text: '99+', description: '100 filters applied.' },
			].forEach((testCase) => {
				it(`${testCase.name}`, async() => {
					const elem = await fixture(html`<d2l-filter></d2l-filter>`);
					elem._dimensions = testCase.dimensions;
					await elem.updateComplete;

					const countBadge = elem.shadowRoot.querySelector('d2l-menu-item[text="Role"] d2l-count-badge');
					await countBadge.updateComplete;
					const menuItemCount = countBadge.shadowRoot.querySelector('.d2l-count-badge-number div');
					const offscreen = elem.shadowRoot.querySelector('d2l-menu-item[text="Role"]');

					expect(menuItemCount.textContent).to.equal(testCase.text);
					expect(countBadge.text).to.equal(testCase.description);
					expect(offscreen.description).to.equal('Role.');
				});
			});
		});
	});

	describe('slot change', () => {
		it('dimensions added after initial render are handled and counts are updated', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			expect(elem._dimensions.length).to.equal(1);
			expect(elem._totalAppliedCount).to.equal(1);

			const newDim = document.createElement('d2l-filter-dimension-set');
			newDim.key = 'newDim';
			newDim.text = 'New Dim';
			const newValue = document.createElement('d2l-filter-dimension-set-value');
			newValue.key = 'newValue';
			newValue.text = 'New Value';
			newValue.selected = true;
			newDim.appendChild(newValue);
			setTimeout(() => elem.appendChild(newDim));
			await oneEvent(elem.shadowRoot.querySelector('slot'), 'slotchange');
			elem.requestUpdate();
			await elem.updateComplete;

			expect(elem._dimensions.length).to.equal(2);
			expect(elem._dimensions[0].key).to.equal('dim');
			expect(elem._dimensions[1].key).to.equal('newDim');
			expect(elem._totalAppliedCount).to.equal(2);
		});
	});

	describe('data change', () => {
		let elem, updateStub, recountSpy, searchSpy;
		beforeEach(async() => {
			elem = await fixture(multiDimensionFixture);
			updateStub = stub(elem, 'requestUpdate');
			recountSpy = spy(elem, '_setFilterCounts');
			searchSpy = spy(elem, '_searchDimension');
		});
		it('dimension data changes are handled', async() => {
			const dimension = elem.querySelector('d2l-filter-dimension-set[key="2"]');
			expect(dimension.text).to.equal('Dim 2');
			dimension.text = 'Test';
			dimension.loading = true;

			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(elem._dimensions[1].text).to.equal('Test');
			expect(elem._dimensions[1].loading).to.be.true;
			expect(updateStub).to.be.calledOnce;
			expect(recountSpy).to.be.not.be.called;
			expect(searchSpy).to.be.not.be.called;
		});

		it('dimension value data changes are handled', async() => {
			const value = elem.querySelector('d2l-filter-dimension-set[key="2"] d2l-filter-dimension-set-value');
			expect(value.text).to.equal('Value 1');
			value.text = 'Test';

			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(elem._dimensions[1].values[0].text).to.equal('Test');
			expect(updateStub).to.be.calledOnce;
			expect(recountSpy).to.be.not.be.called;
			expect(searchSpy).to.be.not.be.called;
		});

		it('multiple data changes are handled', async() => {
			expect(elem._dimensions[1].values[0].text).to.equal('Value 1');
			expect(elem._dimensions[1].values[0].selected).to.be.false;
			elem._handleDimensionDataChange({
				detail: {
					dimensionKey: '2',
					valueKey: '1',
					changes: new Map([['text', 'Test'], ['selected', true]])
				}
			});
			expect(elem._dimensions[1].values[0].text).to.equal('Test');
			expect(elem._dimensions[1].values[0].selected).to.be.true;
			expect(updateStub).to.be.calledOnce;
			expect(recountSpy).to.be.not.be.called;
			expect(searchSpy).to.be.not.be.called;
		});

		it('does not call requestUpdate if no changes', async() => {
			expect(elem._dimensions[1].values[0].text).to.equal('Value 1');
			expect(elem._dimensions[1].values[0].selected).to.be.false;
			elem._handleDimensionDataChange({
				detail: {
					dimensionKey: '2',
					valueKey: '1',
					changes: new Map([['text', 'Value 1'], ['selected', false]])
				}
			});
			expect(elem._dimensions[1].values[0].text).to.equal('Value 1');
			expect(elem._dimensions[1].values[0].selected).to.be.false;
			expect(updateStub).to.not.be.called;
			expect(recountSpy).to.be.not.be.called;
			expect(searchSpy).to.be.not.be.called;
		});

		it('selected changes update the filter count', async() => {
			const value = elem.querySelector('d2l-filter-dimension-set[key="2"] d2l-filter-dimension-set-value');
			expect(value.selected).to.be.false;
			expect(elem._dimensions[1].appliedCount).to.equal(0);
			expect(elem._totalAppliedCount).to.equal(1);
			value.selected = true;

			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(elem._dimensions[1].values[0].selected).to.be.true;
			expect(elem._dimensions[1].appliedCount).to.equal(1);
			expect(elem._totalAppliedCount).to.equal(2);
			expect(updateStub).to.be.calledOnce;
			expect(recountSpy).to.be.not.be.called;
			expect(searchSpy).to.be.not.be.called;
		});

		it('value changes update the filter count', async() => {
			const dimension = elem.querySelector('d2l-filter-dimension-set[key="2"]');
			expect(elem._dimensions[1].appliedCount).to.equal(0);

			const newValue = document.createElement('d2l-filter-dimension-set-value');
			newValue.key = 'newValue';
			newValue.text = 'New Value';
			newValue.selected = true;
			dimension.appendChild(newValue);

			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(elem._dimensions[1].values[0].selected).to.be.false;
			expect(elem._dimensions[1].values[1].selected).to.be.true;
			expect(elem._dimensions[1].appliedCount).to.equal(1);
			expect(elem._totalAppliedCount).to.equal(2);
			expect(updateStub).to.be.calledOnce;
			expect(recountSpy).to.be.calledOnce;
			expect(recountSpy).to.have.been.calledWith(elem._dimensions[1]);
			expect(searchSpy).to.be.not.be.called;
		});

		it('value changes rerun search if there is a searchValue', async() => {
			const dimension = elem.querySelector('d2l-filter-dimension-set[key="1"]');
			elem._dimensions[0].searchValue = '1';

			const newValue = document.createElement('d2l-filter-dimension-set-value');
			newValue.key = 'newValue';
			newValue.text = 'New Value';
			dimension.appendChild(newValue);

			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(elem._dimensions[0].values.length).to.equal(2);
			expect(elem._dimensions[0].values[0].hidden).to.be.false;
			expect(elem._dimensions[0].values[1].hidden).to.be.true;
			expect(recountSpy).to.be.calledOnce;
			expect(searchSpy).to.be.calledOnce;
			expect(searchSpy).to.be.calledWith(elem._dimensions[0]);
		});

		it('value changes rerun search for the manual search type', async() => {
			const dimension = elem.querySelector('d2l-filter-dimension-set[key="1"]');
			elem._dimensions[0].searchType = 'manual';
			expect(elem._dimensions[0].values[0].hidden).to.be.undefined;

			setTimeout(() => elem._handleSearch({ detail: { value: '1' } }));
			const e = await oneEvent(elem, 'd2l-filter-dimension-search');

			e.detail.searchCompleteCallback(['1']);
			await new Promise(requestAnimationFrame);
			expect(elem._dimensions[0].values.length).to.equal(1);
			expect(elem._dimensions[0].values[0].hidden).to.be.false;
			expect(searchSpy).to.be.calledOnce;
			expect(searchSpy).to.be.calledWith(elem._dimensions[0]);
			searchSpy.resetHistory();

			const newValue = document.createElement('d2l-filter-dimension-set-value');
			newValue.key = 'newValue';
			newValue.text = 'New Value';
			newValue.selected = true;
			dimension.appendChild(newValue);

			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(elem._dimensions[0].values.length).to.equal(2);
			expect(elem._dimensions[0].values[0].hidden).to.be.false;
			expect(elem._dimensions[0].values[1].hidden).to.be.true;
			expect(recountSpy).to.be.calledOnce;
			expect(searchSpy).to.be.calledOnce;
			expect(searchSpy).to.be.calledWith(elem._dimensions[0]);
		});
	});
});
