import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { spy, stub } from 'sinon';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const singleSetDimensionFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="dim" text="Dim">
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
		it('single set dimension - loading spinner', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			const dim = elem.querySelector('d2l-filter-dimension-set');
			expect(elem.shadowRoot.querySelector('d2l-loading-spinner')).to.be.null;

			dim.loading = true;
			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			await elem.updateComplete;

			expect(elem.shadowRoot.querySelector('d2l-loading-spinner')).to.not.be.null;
		});
	});

	describe('info messages', () => {
		it('set dimension - empty state', async() => {
			const elem = await fixture('<d2l-filter><d2l-filter-dimension-set key="dim"></d2l-filter-dimension-set></d2l-filter>');
			expect(elem.shadowRoot.querySelector('.d2l-filter-dimension-info-message').textContent).to.include('No available filters');
		});

		it('set dimension - empty and search applied (usecase for manual search)', async() => {
			const elem = await fixture('<d2l-filter><d2l-filter-dimension-set key="dim"></d2l-filter-dimension-set></d2l-filter>');
			elem._handleSearch({ detail: { value: 'no results' } });
			elem.requestUpdate();
			await elem.updateComplete;

			const infoMessage = elem.shadowRoot.querySelector('.d2l-filter-dimension-info-message');
			expect(infoMessage.textContent).to.include('0 search results');
			expect(infoMessage.classList.contains('d2l-offscreen')).to.be.false;
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

		[
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
				expect(e.detail.dimension).to.equal('dim');
				expect(e.detail.value.key).to.equal('2');
				expect(e.detail.value.selected).to.be.true;
				expect(elem._dimensions[0].values[1].selected).to.be.true;

				setTimeout(() => value.setSelected(false));
				e = await oneEvent(elem, 'd2l-filter-change');
				expect(e.detail.dimension).to.equal('dim');
				expect(e.detail.value.key).to.equal('2');
				expect(e.detail.value.selected).to.be.false;
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
				expect(e.detail.dimension).to.equal('1');
				expect(e.detail.value.key).to.equal('1');
				expect(e.detail.value.selected).to.be.false;
				expect(elem._dimensions[0].values[0].selected).to.be.false;

				setTimeout(() => value2.setSelected(true));
				e = await oneEvent(elem, 'd2l-filter-change');
				expect(e.detail.dimension).to.equal('2');
				expect(e.detail.value.key).to.equal('1');
				expect(e.detail.value.selected).to.be.true;
				expect(elem._dimensions[1].values[0].selected).to.be.true;
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
			expect(elem._totalMaxCount).to.equal(0);

			elem._setFilterCounts();

			expect(elem._totalAppliedCount).to.equal(2);
			expect(elem._totalMaxCount).to.equal(3);
			expect(elem._dimensions[0].appliedCount).to.equal(2);
			expect(elem._dimensions[0].maxCount).to.equal(3);
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
			expect(elem._totalMaxCount).to.equal(0);

			elem._setFilterCounts();

			expect(elem._totalAppliedCount).to.equal(3);
			expect(elem._totalMaxCount).to.equal(8);
			expect(elem._dimensions[0].appliedCount).to.equal(2);
			expect(elem._dimensions[0].maxCount).to.equal(3);
			expect(elem._dimensions[1].appliedCount).to.equal(1);
			expect(elem._dimensions[1].maxCount).to.equal(3);
			expect(elem._dimensions[2].appliedCount).to.equal(0);
			expect(elem._dimensions[2].maxCount).to.equal(2);
		});

		it('selection changes in a single set dimension adjusts the count correctly', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			const value1 = elem.shadowRoot.querySelector('d2l-list-item[key="1"]');
			const value2 = elem.shadowRoot.querySelector('d2l-list-item[key="2"]');
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._totalMaxCount).to.equal(2);
			expect(elem._dimensions[0].appliedCount).to.equal(1);
			expect(elem._dimensions[0].maxCount).to.equal(2);

			setTimeout(() => value1.setSelected(false));
			await oneEvent(elem, 'd2l-filter-change');
			expect(elem._totalAppliedCount).to.equal(0);
			expect(elem._totalMaxCount).to.equal(2);
			expect(elem._dimensions[0].appliedCount).to.equal(0);
			expect(elem._dimensions[0].maxCount).to.equal(2);

			setTimeout(() => value2.setSelected(true));
			await oneEvent(elem, 'd2l-filter-change');
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._totalMaxCount).to.equal(2);
			expect(elem._dimensions[0].appliedCount).to.equal(1);
			expect(elem._dimensions[0].maxCount).to.equal(2);
		});

		it('selection changes with multiple dimensions adjusts the count correctly', async() => {
			const elem = await fixture(multiDimensionFixture);
			const value1 = elem.shadowRoot.querySelector('[data-key="1"] d2l-list-item[key="1"]');
			const value2 = elem.shadowRoot.querySelector('[data-key="2"] d2l-list-item[key="1"]');
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._totalMaxCount).to.equal(2);
			expect(elem._dimensions[0].appliedCount).to.equal(1);
			expect(elem._dimensions[0].maxCount).to.equal(1);
			expect(elem._dimensions[1].appliedCount).to.equal(0);
			expect(elem._dimensions[1].maxCount).to.equal(1);

			setTimeout(() => value2.setSelected(true));
			await oneEvent(elem, 'd2l-filter-change');
			expect(elem._totalAppliedCount).to.equal(2);
			expect(elem._totalMaxCount).to.equal(2);
			expect(elem._dimensions[0].appliedCount).to.equal(1);
			expect(elem._dimensions[0].maxCount).to.equal(1);
			expect(elem._dimensions[1].appliedCount).to.equal(1);
			expect(elem._dimensions[1].maxCount).to.equal(1);

			setTimeout(() => value1.setSelected(false));
			await oneEvent(elem, 'd2l-filter-change');
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._totalMaxCount).to.equal(2);
			expect(elem._dimensions[0].appliedCount).to.equal(0);
			expect(elem._dimensions[0].maxCount).to.equal(1);
			expect(elem._dimensions[1].appliedCount).to.equal(1);
			expect(elem._dimensions[1].maxCount).to.equal(1);
		});

		describe('_formatFilterCount', () => {
			[
				{ name: 'No Values', appliedCount: 0, maxCount: 0, result: undefined },
				{ name: 'None Selected', appliedCount: 0, maxCount: 5, result: undefined },
				{ name: '1 Selected', appliedCount: 1, maxCount: 5, result: '1' },
				{ name: '2 Selected', appliedCount: 2, maxCount: 5, result: '2' },
				{ name: '99 Selected', appliedCount: 99, maxCount: 200, result: '99' },
				{ name: '100 Selected', appliedCount: 100, maxCount: 200, result: '99+' },
				{ name: 'All Selected (1)', appliedCount: 1, maxCount: 1, result: 'All' },
				{ name: 'All Selected (99)', appliedCount: 99, maxCount: 99, result: 'All' },
				{ name: 'All Selected (100)', appliedCount: 100, maxCount: 100, result: 'All' },
			].forEach((testCase) => {
				it(`${testCase.name}`, async() => {
					const elem = await fixture(html`<d2l-filter></d2l-filter>`);
					const result = elem._formatFilterCount(testCase.appliedCount, testCase.maxCount);
					expect(result).to.equal(testCase.result);
				});
			});
		});

		describe('Opener Count Format', () => {
			[
				{ name: 'Single Dim - No Values', count: 0, max: 0, dimensions: [{ key: 1, text: 'Role' }], text: 'Role', description: 'Filter by: Role. 0 filters applied.' },
				{ name: 'Single Dim - None Selected', count: 0, max: 200, dimensions: [{ key: 1, text: 'Role' }], text: 'Role', description: 'Filter by: Role. 0 filters applied.' },
				{ name: 'Single Dim - 1 Selected', count: 1, max: 200, dimensions: [{ key: 1, text: 'Role' }], text: 'Role (1)', description: 'Filter by: Role. 1 filter applied.' },
				{ name: 'Single Dim - 5 Selected', count: 5, max: 200, dimensions: [{ key: 1, text: 'Role' }], text: 'Role (5)', description: 'Filter by: Role. 5 filters applied.' },
				{ name: 'Single Dim - 100 Selected', count: 100, max: 200, dimensions: [{ key: 1, text: 'Role' }], text: 'Role (99+)', description: 'Filter by: Role. 100 filters applied.' },
				{ name: 'Single Dim - All Selected', count: 200, max: 200, dimensions: [{ key: 1, text: 'Role' }], text: 'Role (All)', description: 'Filter by: Role. 200 filters applied.' },
				{ name: 'Multiple Dims - No Values', count: 0, max: 0, dimensions: [{ key: 1, text: 'Role' }, { key: 2, text: 'Course' }], text: 'Filters', description: 'Filters. 0 filters applied.' },
				{ name: 'Multiple Dims - None Selected', count: 0, max: 200, dimensions: [{ key: 1, text: 'Role' }, { key: 2, text: 'Course' }], text: 'Filters', description: 'Filters. 0 filters applied.' },
				{ name: 'Multiple Dims - 1 Selected', count: 1, max: 200, dimensions: [{ key: 1, text: 'Role' }, { key: 2, text: 'Course' }], text: 'Filters (1)', description: 'Filters. 1 filter applied.' },
				{ name: 'Multiple Dims - 5 Selected', count: 5, max: 200, dimensions: [{ key: 1, text: 'Role' }, { key: 2, text: 'Course' }], text: 'Filters (5)', description: 'Filters. 5 filters applied.' },
				{ name: 'Multiple Dims - 100 Selected', count: 100, max: 200, dimensions: [{ key: 1, text: 'Role' }, { key: 2, text: 'Course' }], text: 'Filters (99+)', description: 'Filters. 100 filters applied.' },
				{ name: 'Multiple Dims - All Selected', count: 200, max: 200, dimensions: [{ key: 1, text: 'Role' }, { key: 2, text: 'Course' }], text: 'Filters (All)', description: 'Filters. 200 filters applied.' }
			].forEach((testCase) => {
				it(`${testCase.name}`, async() => {
					const elem = await fixture(html`<d2l-filter></d2l-filter>`);
					const opener = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
					elem._dimensions = testCase.dimensions;
					elem._totalAppliedCount = testCase.count;
					elem._totalMaxCount = testCase.max;
					await elem.updateComplete;

					expect(opener.text).to.equal(testCase.text);
					expect(opener.description).to.equal(testCase.description);
				});
			});
		});

		describe('Menu Item Format', () => {
			[
				{ name: 'No Values', dimensions: [{ key: 1, text: 'Role', appliedCount: 0, maxCount: 0 }, { key: 2 }], text: '', description: 'Role. 0 filters applied.' },
				{ name: 'None Selected', dimensions: [{ key: 1, text: 'Role', appliedCount: 0, maxCount: 200 }, { key: 2 }], text: '', description: 'Role. 0 filters applied.' },
				{ name: '1 Selected', dimensions: [{ key: 1, text: 'Role', appliedCount: 1, maxCount: 200 }, { key: 2 }], text: '1', description: 'Role. 1 filter applied.' },
				{ name: '5 Selected', dimensions: [{ key: 1, text: 'Role', appliedCount: 5, maxCount: 200 }, { key: 2 }], text: '5', description: 'Role. 5 filters applied.' },
				{ name: '100 Selected', dimensions: [{ key: 1, text: 'Role', appliedCount: 100, maxCount: 200 }, { key: 2 }], text: '99+', description: 'Role. 100 filters applied.' },
				{ name: 'All Selected', dimensions: [{ key: 1, text: 'Role', appliedCount: 200, maxCount: 200 }, { key: 2 }], text: 'All', description: 'Role. 200 filters applied.' },
			].forEach((testCase) => {
				it(`${testCase.name}`, async() => {
					const elem = await fixture(html`<d2l-filter></d2l-filter>`);
					elem._dimensions = testCase.dimensions;
					await elem.updateComplete;

					const menuItemCount = elem.shadowRoot.querySelector('d2l-menu-item[text="Role"] span');
					const offscreen = elem.shadowRoot.querySelector('d2l-menu-item[text="Role"]');

					expect(menuItemCount.textContent).to.equal(testCase.text);
					expect(offscreen.description).to.equal(testCase.description);
				});
			});
		});
	});

	describe('slot change', () => {
		it('dimensions added after initial render are handled and counts are updated', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			expect(elem._dimensions.length).to.equal(1);
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._totalMaxCount).to.equal(2);

			const newDim = document.createElement('d2l-filter-dimension-set');
			newDim.key = 'newDim';
			newDim.text = 'New Dim';
			const newValue = document.createElement('d2l-filter-dimension-set-value');
			newValue.key = 'newValue';
			newValue.text = 'New Value';
			newDim.appendChild(newValue);
			setTimeout(() => elem.appendChild(newDim));
			await oneEvent(elem.shadowRoot.querySelector('slot'), 'slotchange');
			elem.requestUpdate();
			await elem.updateComplete;

			expect(elem._dimensions.length).to.equal(2);
			expect(elem._dimensions[0].key).to.equal('dim');
			expect(elem._dimensions[1].key).to.equal('newDim');
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._totalMaxCount).to.equal(3);
		});
	});

	describe('data change', () => {
		let elem, updateStub, recountSpy;
		beforeEach(async() => {
			elem = await fixture(multiDimensionFixture);
			updateStub = stub(elem, 'requestUpdate');
			recountSpy = spy(elem, '_setFilterCounts');
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
		});

		it('dimension value data changes are handled', async() => {
			const value = elem.querySelector('d2l-filter-dimension-set[key="2"] d2l-filter-dimension-set-value');
			expect(value.text).to.equal('Value 1');
			value.text = 'Test';

			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(elem._dimensions[1].values[0].text).to.equal('Test');
			expect(updateStub).to.be.calledOnce;
			expect(recountSpy).to.be.not.be.called;
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
		});

		it('selected changes update the filter count', async() => {
			const value = elem.querySelector('d2l-filter-dimension-set[key="2"] d2l-filter-dimension-set-value');
			expect(value.selected).to.be.false;
			expect(elem._dimensions[1].appliedCount).to.equal(0);
			expect(elem._dimensions[1].maxCount).to.equal(1);
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._totalMaxCount).to.equal(2);
			value.selected = true;

			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(elem._dimensions[1].values[0].selected).to.be.true;
			expect(elem._dimensions[1].appliedCount).to.equal(1);
			expect(elem._dimensions[1].maxCount).to.equal(1);
			expect(elem._totalAppliedCount).to.equal(2);
			expect(elem._totalMaxCount).to.equal(2);
			expect(updateStub).to.be.calledOnce;
			expect(recountSpy).to.be.not.be.called;
		});

		it('value changes update the filter count', async() => {
			const dimension = elem.querySelector('d2l-filter-dimension-set[key="2"]');
			expect(elem._dimensions[1].appliedCount).to.equal(0);
			expect(elem._dimensions[1].maxCount).to.equal(1);

			const newValue = document.createElement('d2l-filter-dimension-set-value');
			newValue.key = 'newValue';
			newValue.text = 'New Value';
			newValue.selected = true;
			dimension.appendChild(newValue);

			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(elem._dimensions[1].values[0].selected).to.be.false;
			expect(elem._dimensions[1].values[1].selected).to.be.true;
			expect(elem._dimensions[1].appliedCount).to.equal(1);
			expect(elem._dimensions[1].maxCount).to.equal(2);
			expect(elem._totalAppliedCount).to.equal(2);
			expect(elem._totalMaxCount).to.equal(3);
			expect(updateStub).to.be.calledOnce;
			expect(recountSpy).to.be.calledOnce;
			expect(recountSpy).to.have.been.calledWith(elem._dimensions[1]);
		});

		it('value changes update the filter count for the manual search type when no search is applied', async() => {
			const dimension = elem.querySelector('d2l-filter-dimension-set[key="1"]');
			elem._dimensions[0].searchType = 'manual';
			elem._dimensions[0].searchValue = '';
			expect(elem._dimensions[0].appliedCount).to.equal(1);
			expect(elem._dimensions[0].maxCount).to.equal(1);
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._totalMaxCount).to.equal(2);

			const newValue = document.createElement('d2l-filter-dimension-set-value');
			newValue.key = 'newValue';
			newValue.text = 'New Value';
			newValue.selected = true;
			dimension.appendChild(newValue);

			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(elem._dimensions[0].values.length).to.equal(2);
			expect(elem._dimensions[0].appliedCount).to.equal(2);
			expect(elem._dimensions[0].maxCount).to.equal(2);
			expect(elem._totalAppliedCount).to.equal(2);
			expect(elem._totalMaxCount).to.equal(3);
			expect(updateStub).to.be.calledOnce;
			expect(recountSpy).to.be.calledOnce;
			expect(recountSpy).to.be.calledWith(elem._dimensions[0]);
		});

		it('value changes do not update the filter count for the manual search type when a search is applied', async() => {
			const dimension = elem.querySelector('d2l-filter-dimension-set[key="1"]');
			elem._dimensions[0].searchType = 'manual';
			elem._dimensions[0].searchValue = 'whatever';
			expect(elem._dimensions[0].appliedCount).to.equal(1);
			expect(elem._dimensions[0].maxCount).to.equal(1);
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._totalMaxCount).to.equal(2);

			const valueToRemove = dimension.querySelector('d2l-filter-dimension-set-value');
			dimension.removeChild(valueToRemove);

			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(elem._dimensions[0].values.length).to.equal(0);
			expect(elem._dimensions[0].appliedCount).to.equal(1);
			expect(elem._dimensions[0].maxCount).to.equal(1);
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._totalMaxCount).to.equal(2);
			expect(updateStub).to.be.calledOnce;
			expect(recountSpy).to.not.be.called;
		});
	});
});
