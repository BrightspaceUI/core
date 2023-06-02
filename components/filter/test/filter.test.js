import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-empty-state.js';
import '../filter-dimension-set-value.js';
import { expect, fixture, html, oneEvent, waitUntil } from '@open-wc/testing';
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
const singleSetLinkSearchEmptyStateDimensionFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="dim" text="Dim" select-all>
			<d2l-filter-dimension-set-value key="1" text="Value 1" selected></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="2" text="Value 2"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-empty-state slot="search-empty-state" description="Test description" action-text="Click me" action-href="https://d2l.com"></d2l-filter-dimension-set-empty-state>
		</d2l-filter-dimension-set>
	</d2l-filter>`;
const singleSetSearchEmptyStateDimensionFixture = html`
<d2l-filter>
	<d2l-filter-dimension-set key="dim" text="Dim" select-all>
		<d2l-filter-dimension-set-value key="1" text="Value 1" selected></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-value key="2" text="Value 2"></d2l-filter-dimension-set-value>
		<d2l-filter-dimension-set-empty-state slot="search-empty-state" description="Test description" action-text="Click me"></d2l-filter-dimension-set-empty-state>
	</d2l-filter-dimension-set>
</d2l-filter>`;
const singleSetSetEmptyStateDimensionFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="dim" text="Dim" select-all>
			<d2l-filter-dimension-set-empty-state slot="set-empty-state" description="Test description" action-text="Click me"></d2l-filter-dimension-set-empty-state>
		</d2l-filter-dimension-set>
	</d2l-filter>`;
const multiDimensionFixture = html`
	<d2l-filter id="multi">
		<d2l-filter-dimension-set key="1" text="Dim 1">
			<d2l-filter-dimension-set-value key="1" text="Value 1" selected></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
		<d2l-filter-dimension-set key="2" text="Dim 2">
			<d2l-filter-dimension-set-value key="1" text="Value 1"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
		<d2l-filter-dimension-set selection-single key="3" text="Dim 3" value-only-active-filter-text>
			<d2l-filter-dimension-set-value key="1" text="Value 1"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="2" text="Value 2" selected></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>`;
const headerTextFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set header-text="Test Header" key="dim" text="Dim" select-all>
			<d2l-filter-dimension-set-value key="1" text="Value 1" selected></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>`;
const selectedFirstFixture = html`
	<d2l-filter>
		<d2l-filter-dimension-set key="dim" text="Dim" select-all selected-first>
			<d2l-filter-dimension-set-value key="1" text="Value 1" selected></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="2" text="Value 2"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	</d2l-filter>`;

describe('d2l-filter', () => {

	it('should construct', () => {
		runConstructor('d2l-filter');
	});

	describe('loading', () => {
		it('single set dimension - loading spinner and select all hidden', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			const dim = elem.querySelector('d2l-filter-dimension-set');
			expect(elem.shadowRoot.querySelector('d2l-loading-spinner')).to.be.null;
			expect(elem.shadowRoot.querySelector('d2l-selection-select-all')).to.not.be.null;

			dim.loading = true;
			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			await elem.updateComplete;

			expect(elem.shadowRoot.querySelector('d2l-loading-spinner')).to.not.be.null;
			expect(elem.shadowRoot.querySelector('d2l-selection-select-all')).to.be.null;
		});
	});

	describe('header-text', () => {
		it('should set label on dimension set list when header-text is defined', async() => {
			const elem = await fixture(headerTextFixture);
			const list = elem.shadowRoot.querySelector('d2l-list');
			expect(list.getAttribute('label')).to.equal('Test Header');
		});

		it('should not set label on dimension set list when header-text is defined while searching', async() => {
			const elem = await fixture(headerTextFixture);
			const list = elem.shadowRoot.querySelector('d2l-list');

			elem._handleSearch({ detail: { value: 'V' } });
			elem.requestUpdate();
			await elem.updateComplete;

			expect(list.hasAttribute('label')).to.be.false;
		});

		it('should not set label on dimension set list when header-text is not defined', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			const list = elem.shadowRoot.querySelector('d2l-list');
			expect(list.hasAttribute('label')).to.be.false;
		});
	});

	describe('selected-first', () => {
		it('should not update shouldBubble after dimension is opened', async() => {
			const elem = await fixture(selectedFirstFixture);
			const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');

			elem.opened = true;
			await oneEvent(dropdown, 'd2l-dropdown-open');
			const value1 = elem._dimensions[0].values.find(value => value.key === '1');
			const value2 = elem._dimensions[0].values.find(value => value.key === '2');
			expect(value1.shouldBubble).to.be.true;
			expect(value2.shouldBubble).to.be.false;

			const listItem2 = elem.shadowRoot.querySelector('d2l-list-item[key="2"]');
			setTimeout(() => listItem2.setSelected(true));
			await oneEvent(elem, 'd2l-filter-change');

			expect(value1.shouldBubble).to.be.true;
			expect(value2.shouldBubble).to.be.false;
		});

		it('should update shouldBubble when dimension is re-opened in multi-dimension', async() => {
			const elem = await fixture(html`
				<d2l-filter id="multi">
					<d2l-filter-dimension-set key="1" text="Dim 1" selected-first>
						<d2l-filter-dimension-set-value key="1" text="Value 1" selected></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="2" text="Value 2"></d2l-filter-dimension-set-value>
					</d2l-filter-dimension-set>
					<d2l-filter-dimension-set key="2" text="Dim 2" >
						<d2l-filter-dimension-set-value key="1" text="Value 1"></d2l-filter-dimension-set-value>
					</d2l-filter-dimension-set>
				</d2l-filter>
			`);
			const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
			const dimensions = elem.shadowRoot.querySelectorAll('d2l-menu-item');

			elem.opened = true;
			await oneEvent(dropdown, 'd2l-dropdown-open');

			setTimeout(() => dimensions[0].click());
			await oneEvent(elem, 'd2l-filter-dimension-first-open');

			const listItem2 = elem.shadowRoot.querySelector('d2l-list-item[key="2"]');
			setTimeout(() => listItem2.setSelected(true));
			await oneEvent(elem, 'd2l-filter-change');
			const value1 = elem._dimensions[0].values.find(value => value.key === '1');
			const value2 = elem._dimensions[0].values.find(value => value.key === '2');
			expect(value1.shouldBubble).to.be.true;
			expect(value2.shouldBubble).to.be.false;

			setTimeout(() => dimensions[1].click());
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
			setTimeout(() => dimensions[0].click());
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');

			await waitUntil(() => value2.shouldBubble, 'shouldBubble recalculated', { timeout: 3000 });
			expect(value1.shouldBubble).to.be.true;
			expect(value2.shouldBubble).to.be.true;
		});

		it('should update shouldBubble when dimension is searched', async() => {
			const elem = await fixture(selectedFirstFixture);
			const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');

			elem.opened = true;
			await oneEvent(dropdown, 'd2l-dropdown-open');
			const value1 = elem._dimensions[0].values.find(value => value.key === '1');
			const value2 = elem._dimensions[0].values.find(value => value.key === '2');

			const listItem2 = elem.shadowRoot.querySelector('d2l-list-item[key="2"]');
			setTimeout(() => listItem2.setSelected(true));
			await oneEvent(elem, 'd2l-filter-change');
			expect(value1.shouldBubble).to.be.true;
			expect(value2.shouldBubble).to.be.false;

			elem._handleSearch({ detail: { value: 'V' } });
			elem.requestUpdate();
			await elem.updateComplete;
			expect(value1.shouldBubble).to.be.true;
			expect(value2.shouldBubble).to.be.true;
		});
	});

	describe('info messages', () => {
		it('set dimension - empty state', async() => {
			const elem = await fixture('<d2l-filter><d2l-filter-dimension-set key="dim"></d2l-filter-dimension-set></d2l-filter>');
			expect(elem.shadowRoot.querySelector('.d2l-filter-dimension-info-message').description).to.include('No available filters');
		});

		it('set dimension - custom empty state', async() => {
			const elem = await fixture(singleSetSetEmptyStateDimensionFixture);
			const emptyState = elem.shadowRoot.querySelector('.d2l-filter-dimension-info-message');
			const emptyStateAction = emptyState.querySelector('d2l-empty-state-action-button');
			expect(emptyState.description).to.equal('Test description');
			expect(emptyStateAction.text).to.equal('Click me');
		});

		it('set dimension - no search results', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			elem._handleSearch({ detail: { value: 'no results' } });
			elem.requestUpdate();
			await elem.updateComplete;

			const container = elem.shadowRoot.querySelector('.d2l-empty-state-container');
			const emptyState = elem.shadowRoot.querySelector('.d2l-filter-dimension-info-message');
			expect(emptyState.description).to.equal('No search results');
			expect(container.classList.contains('d2l-offscreen')).to.be.false;
		});

		it('set dimension - custom no search results', async() => {
			const elem = await fixture(singleSetLinkSearchEmptyStateDimensionFixture);
			elem._handleSearch({ detail: { value: 'no results' } });
			elem.requestUpdate();
			await elem.updateComplete;

			const container = elem.shadowRoot.querySelector('.d2l-empty-state-container');
			const emptyState = elem.shadowRoot.querySelector('.d2l-filter-dimension-info-message');
			const emptyStateAction = emptyState.querySelector('d2l-empty-state-action-link');
			expect(emptyState.description).to.equal('Test description');
			expect(emptyStateAction.text).to.equal('Click me');
			expect(emptyStateAction.href).to.equal('https://d2l.com');
			expect(container.classList.contains('d2l-offscreen')).to.be.false;
		});

		it('set dimension - search results (offscreen)', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			elem._handleSearch({ detail: { value: '1' } });
			elem.requestUpdate();
			await elem.updateComplete;

			const container = elem.shadowRoot.querySelector('.d2l-empty-state-container');
			const infoMessage = elem.shadowRoot.querySelector('.d2l-filter-dimension-info-message');
			expect(infoMessage.description).to.include('1 search result');
			expect(container.classList.contains('d2l-offscreen')).to.be.true;

			elem._handleSearch({ detail: { value: 'value' } });
			elem.requestUpdate();
			await elem.updateComplete;

			expect(infoMessage.description).to.include('2 search results');
			expect(container.classList.contains('d2l-offscreen')).to.be.true;
		});
	});

	describe('introductory-text', () => {
		it('sets introductory text on a single dimension', async() => {
			const elem = await fixture('<d2l-filter><d2l-filter-dimension-set introductory-text="Intro" key="dim"></d2l-filter-dimension-set></d2l-filter>');
			expect(elem._dimensions[0].introductoryText).to.equal('Intro');
			const introText = elem.shadowRoot.querySelector('.d2l-filter-dimension-intro-text');
			expect(introText.classList.contains('multi-dimension')).to.be.false;
			expect(introText.textContent).to.equal('Intro');
		});

		it('sets introductory text on a dimension in a multi-dimensional filter', async() => {
			const elem = await fixture('<d2l-filter><d2l-filter-dimension-set introductory-text="Intro" key="dim"></d2l-filter-dimension-set><d2l-filter-dimension-set introductory-text="intro" key="dim"></d2l-filter-dimension-set></d2l-filter>');
			const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
			const dropdownContent = elem.shadowRoot.querySelector('d2l-dropdown-menu');
			await dropdownContent.updateComplete;
			const dimension = elem.shadowRoot.querySelector('d2l-menu-item');

			elem.opened = true;
			await oneEvent(dropdown, 'd2l-dropdown-open');

			setTimeout(() => dimension.click());
			await oneEvent(elem, 'd2l-hierarchical-view-show-complete');

			expect(elem._dimensions[0].introductoryText).to.equal('Intro');
			const introText = elem.shadowRoot.querySelector('.d2l-filter-dimension-intro-text');
			expect(introText.classList.contains('multi-dimension')).to.be.true;
			expect(introText.textContent).to.equal('Intro');
		});
	});

	describe('clearing', () => {
		it('set dimension', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			expect(elem._dimensions[0].values[0].selected).to.be.true;
			expect(elem._dimensions[0].values[1].selected).to.be.false;
			expect(elem._dimensions[0].appliedCount).to.equal(1);

			elem._performDimensionClear(elem._dimensions[0]);
			expect(elem._dimensions[0].values[0].selected).to.be.false;
			expect(elem._dimensions[0].values[1].selected).to.be.false;
			expect(elem._dimensions[0].appliedCount).to.equal(0);
			expect(elem._changeEventsToDispatch.size).to.equal(1);
			const changeEventDim = elem._changeEventsToDispatch.get('dim');
			expect(changeEventDim.dimensionKey).to.equal('dim');
			expect(changeEventDim.cleared).to.be.true;
			expect(changeEventDim.changes.size).to.equal(1);
			const changeEvent = changeEventDim.changes.get('1');
			expect(changeEvent.valueKey).to.equal('1');
			expect(changeEvent.selected).to.be.false;
		});

		it('clear all - clears all dimensions and searches', async() => {
			const elem = await fixture(`<d2l-filter>
				<d2l-filter-dimension-set key="1" text="Dim 1"><d2l-filter-dimension-set-value key="test" text="test" selected></d2l-filter-dimension-set-value></d2l-filter-dimension-set>
				<d2l-filter-dimension-set key="2" text="Dim 2" selection-single><d2l-filter-dimension-set-value key="test" text="test" selected></d2l-filter-dimension-set-value></d2l-filter-dimension-set>
			</d2l-filter>`);
			elem._dimensions[0].searchValue = 'searched';
			elem._dimensions[1].searchValue = 'searched';
			elem._dimensions[1].searchKeysToDisplay = ['none'];

			elem._performDimensionSearch(elem._dimensions[0]);
			elem._performDimensionSearch(elem._dimensions[1]);
			await new Promise(resolve => { requestAnimationFrame(resolve); });
			expect(elem._dimensions[0].values[0].hidden).to.be.true;
			expect(elem._dimensions[1].values[0].hidden).to.be.true;
			expect(elem._dimensions[0].values[0].selected).to.be.true;
			expect(elem._dimensions[1].values[0].selected).to.be.true;
			expect(elem._totalAppliedCount).to.equal(2);

			elem._handleClearAll();
			expect(elem._dimensions[0].searchValue).to.equal('');
			expect(elem._dimensions[1].searchValue).to.equal('');
			expect(elem._dimensions[0].values[0].hidden).to.be.false;
			expect(elem._dimensions[1].values[0].hidden).to.be.false;
			expect(elem._dimensions[0].values[0].selected).to.be.false;
			expect(elem._dimensions[1].values[0].selected).to.be.false;
			expect(elem._dimensions[0].appliedCount).to.equal(0);
			expect(elem._dimensions[1].appliedCount).to.equal(0);
			expect(elem._totalAppliedCount).to.equal(0);
		});

		it('requestFilterValueClear clears the corresponding active filter value', async() => {
			const elem = await fixture(multiDimensionFixture);
			expect(elem._dimensions[2].values[1].selected).to.be.true;
			expect(elem._dimensions[2].appliedCount).to.equal(1);
			expect(elem._totalAppliedCount).to.equal(2);

			elem.requestFilterValueClear({ dimension: '3', value: '2' });
			expect(elem._dimensions[2].values[1].selected).to.be.false;
			expect(elem._dimensions[2].appliedCount).to.equal(0);
			expect(elem._totalAppliedCount).to.equal(1);
			expect(elem._changeEventsToDispatch.size).to.equal(1);
			const changeEventDim = elem._changeEventsToDispatch.get('3');
			expect(changeEventDim.dimensionKey).to.equal('3');
			expect(changeEventDim.cleared).to.be.false;
			expect(changeEventDim.changes.size).to.equal(1);
			const changeEvent = changeEventDim.changes.get('2');
			expect(changeEvent.valueKey).to.equal('2');
			expect(changeEvent.selected).to.be.false;
		});

		it('requestFilterValueClear does nothing if the filter value is already inactive', async() => {
			const elem = await fixture(multiDimensionFixture);
			expect(elem._dimensions[2].values[0].selected).to.be.false;
			expect(elem._dimensions[2].appliedCount).to.equal(1);
			expect(elem._totalAppliedCount).to.equal(2);

			elem.requestFilterValueClear({ dimension: '3', value: '1' });
			expect(elem._dimensions[2].values[0].selected).to.be.false;
			expect(elem._dimensions[2].appliedCount).to.equal(1);
			expect(elem._totalAppliedCount).to.equal(2);
			expect(elem._changeEventsToDispatch.size).to.equal(0);
		});
	});

	describe('searching', () => {
		it('set dimension - no search', async() => {
			const elem = await fixture('<d2l-filter><d2l-filter-dimension-set key="dim" text="dim" search-type="none"></d2l-filter-dimension-set></d2l-filter>');
			expect(elem.shadowRoot.querySelector('d2l-input-search')).to.be.null;
		});

		it('set dimension - manual search sets loading state to true and then back to false when callback is run', async() => {
			const elem = await fixture('<d2l-filter><d2l-filter-dimension-set key="dim" text="dim" search-type="manual"></d2l-filter-dimension-set></d2l-filter>');
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
			const elem = await fixture(`<d2l-filter><d2l-filter-dimension-set key="dim" text="dim" search-type="manual">
				<d2l-filter-dimension-set-value key="test" text="test"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="test2" text="test2"></d2l-filter-dimension-set-value>
			</d2l-filter-dimension-set></d2l-filter>`);
			expect(elem._dimensions[0].values[0].hidden).to.be.undefined;
			expect(elem._dimensions[0].values[1].hidden).to.be.undefined;

			setTimeout(() => elem._handleSearch({ detail: { value: 'whatever' } }));
			const e = await oneEvent(elem, 'd2l-filter-dimension-search');

			e.detail.searchCompleteCallback({ keysToDisplay: ['test'] });
			await new Promise(resolve => { requestAnimationFrame(resolve); });
			expect(elem._dimensions[0].values[0].hidden).to.be.false;
			expect(elem._dimensions[0].values[1].hidden).to.be.true;
		});

		it('set dimension - manual search will display all keys when set in the callback', async() => {
			const elem = await fixture(`<d2l-filter><d2l-filter-dimension-set key="dim" text="dim" search-type="manual">
				<d2l-filter-dimension-set-value key="test" text="test"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="test2" text="test2"></d2l-filter-dimension-set-value>
			</d2l-filter-dimension-set></d2l-filter>`);
			expect(elem._dimensions[0].values[0].hidden).to.be.undefined;
			expect(elem._dimensions[0].values[1].hidden).to.be.undefined;

			setTimeout(() => elem._handleSearch({ detail: { value: 'whatever' } }));
			const e = await oneEvent(elem, 'd2l-filter-dimension-search');

			e.detail.searchCompleteCallback({ displayAllKeys: true });
			await new Promise(resolve => { requestAnimationFrame(resolve); });
			expect(elem._dimensions[0].values[0].hidden).to.be.false;
			expect(elem._dimensions[0].values[1].hidden).to.be.false;
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
				expect(e.detail.allCleared).to.be.false;
				let dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('dim');
				expect(dimensions[0].cleared).to.be.false;
				let changes = dimensions[0].changes;
				expect(changes.length).to.equal(1);
				expect(changes[0].valueKey).to.equal('2');
				expect(changes[0].selected).to.be.true;
				expect(elem._dimensions[0].values[1].selected).to.be.true;

				setTimeout(() => value.setSelected(false));
				e = await oneEvent(elem, 'd2l-filter-change');
				expect(e.detail.allCleared).to.be.false;
				dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('dim');
				expect(dimensions[0].cleared).to.be.false;
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
				expect(e.detail.allCleared).to.be.false;
				let dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('dim');
				expect(dimensions[0].cleared).to.be.false;
				expect(dimensions[0].changes.length).to.equal(2);
				expect(dimensions[0].changes[0].valueKey).to.equal('2');
				expect(dimensions[0].changes[0].selected).to.be.true;
				expect(dimensions[0].changes[1].valueKey).to.equal('1');
				expect(dimensions[0].changes[1].selected).to.be.false;
				expect(elem._dimensions[0].values[0].selected).to.be.false;
				expect(elem._dimensions[0].values[1].selected).to.be.true;

				setTimeout(() => value.setSelected(false));
				e = await oneEvent(elem, 'd2l-filter-change');
				expect(e.detail.allCleared).to.be.false;
				dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('dim');
				expect(dimensions[0].cleared).to.be.false;
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
				expect(e.detail.allCleared).to.be.false;
				let dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('1');
				expect(dimensions[0].cleared).to.be.false;
				expect(dimensions[0].changes.length).to.equal(1);
				expect(dimensions[0].changes[0].valueKey).to.equal('1');
				expect(dimensions[0].changes[0].selected).to.be.false;
				expect(elem._dimensions[0].values[0].selected).to.be.false;

				setTimeout(() => value2.setSelected(true));
				e = await oneEvent(elem, 'd2l-filter-change');
				expect(e.detail.allCleared).to.be.false;
				dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('2');
				expect(dimensions[0].cleared).to.be.false;
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
				expect(e.detail.allCleared).to.be.false;
				const dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(2);
				expect(dimensions[0].dimensionKey).to.equal('1');
				expect(dimensions[0].cleared).to.be.false;
				expect(dimensions[0].changes.length).to.equal(1);
				expect(dimensions[0].changes[0].valueKey).to.equal('1');
				expect(dimensions[0].changes[0].selected).to.be.false;
				expect(elem._dimensions[0].values[0].selected).to.be.false;
				expect(dimensions[1].dimensionKey).to.equal('2');
				expect(dimensions[1].cleared).to.be.false;
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
				expect(e.detail.allCleared).to.be.false;
				const dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('1');
				expect(dimensions[0].cleared).to.be.false;
				expect(dimensions[0].changes.length).to.equal(1);
				expect(dimensions[0].changes[0].valueKey).to.equal('1');
				expect(dimensions[0].changes[0].selected).to.be.true;
				expect(elem._dimensions[0].values[0].selected).to.be.true;
				expect(setupSpy.callCount).to.equal(4);
				expect(dispatchSpy.callCount).to.equal(1);
			});

			it('if the clear button is pressed, the change event will be sent immediately and cleared will be true', async() => {
				const elem = await fixture(singleSetDimensionFixture);
				const clear = elem.shadowRoot.querySelector('[slot="header"] d2l-button-subtle');
				expect(elem._dimensions[0].values[0].selected).to.be.true;
				expect(elem._dimensions[0].values[1].selected).to.be.false;
				const setupSpy = spy(elem, '_dispatchChangeEvent');
				const setupNowSpy = spy(elem, '_dispatchChangeEventNow');
				const dispatchSpy = spy(elem, 'dispatchEvent');

				setTimeout(() => clear.click());
				const e = await oneEvent(elem, 'd2l-filter-change');
				expect(e.detail.allCleared).to.be.false;
				const dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(1);
				expect(dimensions[0].dimensionKey).to.equal('dim');
				expect(dimensions[0].cleared).to.be.true;
				expect(dimensions[0].changes.length).to.equal(1);
				expect(dimensions[0].changes[0].valueKey).to.equal('1');
				expect(dimensions[0].changes[0].selected).to.be.false;
				expect(elem._dimensions[0].values[0].selected).to.be.false;
				expect(elem._dimensions[0].values[1].selected).to.be.false;
				expect(setupSpy).to.not.be.called;
				expect(setupNowSpy).to.be.calledOnce;
				expect(dispatchSpy).to.be.calledOnce;
			});

			it('if the clear all button is pressed, the change event will be sent immediately and allCleared will be true', async() => {
				const elem = await fixture(multiDimensionFixture);
				const clearAll = elem.shadowRoot.querySelector('d2l-button-subtle[slot="header"]');
				expect(elem._dimensions[0].values[0].selected).to.be.true;
				expect(elem._dimensions[1].values[0].selected).to.be.false;
				expect(elem._dimensions[2].values[0].selected).to.be.false;
				expect(elem._dimensions[2].values[1].selected).to.be.true;
				const setupSpy = spy(elem, '_dispatchChangeEvent');
				const setupNowSpy = spy(elem, '_dispatchChangeEventNow');
				const dispatchSpy = spy(elem, 'dispatchEvent');

				setTimeout(() => clearAll.click());
				const e = await oneEvent(elem, 'd2l-filter-change');
				expect(e.detail.allCleared).to.be.true;
				const dimensions = e.detail.dimensions;
				expect(dimensions.length).to.equal(2);
				expect(dimensions[0].dimensionKey).to.equal('1');
				expect(dimensions[0].cleared).to.be.true;
				expect(dimensions[0].changes.length).to.equal(1);
				expect(dimensions[0].changes[0].valueKey).to.equal('1');
				expect(dimensions[0].changes[0].selected).to.be.false;
				expect(dimensions[1].dimensionKey).to.equal('3');
				expect(dimensions[1].cleared).to.be.true;
				expect(dimensions[1].changes.length).to.equal(1);
				expect(dimensions[1].changes[0].valueKey).to.equal('2');
				expect(dimensions[1].changes[0].selected).to.be.false;

				expect(elem._dimensions[0].values[0].selected).to.be.false;
				expect(elem._dimensions[1].values[0].selected).to.be.false;
				expect(elem._dimensions[2].values[0].selected).to.be.false;
				expect(elem._dimensions[2].values[1].selected).to.be.false;
				expect(setupSpy).to.not.be.called;
				expect(setupNowSpy).to.be.calledOnce;
				expect(dispatchSpy).to.be.calledOnce;
			});
		});

		describe('d2l-filter-dimension-first-open', () => {
			it('single set dimension fires dimension first open event', async() => {
				const elem = await fixture(singleSetDimensionFixture);
				const eventSpy = spy(elem, 'dispatchEvent');
				const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
				const dropdownContent = elem.shadowRoot.querySelector('d2l-dropdown-content');
				await dropdownContent.updateComplete;

				elem.opened = true;
				const e = await oneEvent(elem, 'd2l-filter-dimension-first-open');
				expect(e.detail.key).to.equal('dim');
				expect(elem._openedDimensions[0]).to.equal('dim');

				elem.opened = false;
				await oneEvent(dropdown, 'd2l-dropdown-close');

				elem.opened = true;
				await oneEvent(dropdown, 'd2l-dropdown-open');

				expect(eventSpy).to.be.calledOnce;
			});

			it('multiple dimensions fire dimension first open events', async() => {
				const elem = await fixture(multiDimensionFixture);
				const eventSpy = spy(elem, 'dispatchEvent');
				const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
				const dropdownContent = elem.shadowRoot.querySelector('d2l-dropdown-menu');
				await dropdownContent.updateComplete;
				const dimensions = elem.shadowRoot.querySelectorAll('d2l-menu-item');

				elem.opened = true;
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

			describe('d2l-filter-dimension-empty-state', () => {
				it('Fires empty state action when search empty state action is clicked', async() => {
					const elem = await fixture(singleSetSearchEmptyStateDimensionFixture);
					elem._handleSearch({ detail: { value: 'no results' } });
					elem.requestUpdate();
					await elem.updateComplete;

					const eventSpy = spy(elem, 'dispatchEvent');
					const emptyState = elem.shadowRoot.querySelector('.d2l-filter-dimension-info-message');
					const emptyStateAction = emptyState.querySelector('d2l-empty-state-action-button');

					setTimeout(() => emptyStateAction.dispatchEvent(new CustomEvent('d2l-empty-state-action')));
					const e = await oneEvent(elem, 'd2l-filter-dimension-empty-state-action');
					expect(e.detail.key).to.equal('dim');
					expect(e.detail.type).to.equal('search');
					expect(eventSpy).to.be.calledOnce;
				});

				it('Fires empty state action when set empty state action is clicked', async() => {
					const elem = await fixture(singleSetSetEmptyStateDimensionFixture);
					const eventSpy = spy(elem, 'dispatchEvent');
					const emptyState = elem.shadowRoot.querySelector('.d2l-filter-dimension-info-message');
					const emptyStateAction = emptyState.querySelector('d2l-empty-state-action-button');

					setTimeout(() => emptyStateAction.dispatchEvent(new CustomEvent('d2l-empty-state-action')));
					const e = await oneEvent(elem, 'd2l-filter-dimension-empty-state-action');
					expect(e.detail.key).to.equal('dim');
					expect(e.detail.type).to.equal('set');
					expect(eventSpy).to.be.calledOnce;
				});
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

			it('single set dimension fires search event for clearing search on manual search-type', async() => {
				const elem = await fixture('<d2l-filter><d2l-filter-dimension-set key="dim" search-type="manual"></d2l-filter-dimension-set></d2l-filter>');
				const eventSpy = spy(elem, 'dispatchEvent');
				const search = elem.shadowRoot.querySelector('d2l-input-search');
				search.value = '';
				search.search();
				elem.requestUpdate();
				await elem.updateComplete;

				expect(elem._dimensions[0].searchValue).to.equal('');
				expect(eventSpy).to.be.calledOnce;
			});

			it('single set dimension fires search event on first open for manual search-type', async() => {
				const elem = await fixture(html`
					<d2l-filter>
						<d2l-filter-dimension-set key="dim" text="dim" search-type="manual"></d2l-filter-dimension-set>
					</d2l-filter>`
				);

				setTimeout(() => elem.opened = true);
				await oneEvent(elem, 'd2l-filter-dimension-search');
			});

			it('multi set dimension fires search event on first dimension open for manual search-type', async() => {
				const elem = await fixture(html`
					<d2l-filter>
						<d2l-filter-dimension-set key="dim" text="dim" search-type="manual">
							<d2l-filter-dimension-set-value key="test" text="test"></d2l-filter-dimension-set-value>
							<d2l-filter-dimension-set-value key="test2" text="test2"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
						<d2l-filter-dimension-set key="dim2" text="dim2">
							<d2l-filter-dimension-set-value key="test" text="test"></d2l-filter-dimension-set-value>
						</d2l-filter-dimension-set>
					</d2l-filter>`
				);
				const dimensions = elem.shadowRoot.querySelectorAll('d2l-menu-item');

				setTimeout(() => dimensions[0].click());
				await oneEvent(elem, 'd2l-filter-dimension-search');
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
			stub(elem, 'requestUpdate'); // Do not create actual DOM nodes for this test, missing text info for labels
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
			stub(elem, 'requestUpdate'); // Do not create actual DOM nodes for this test, missing text info for labels
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
			expect(elem._totalAppliedCount).to.equal(2);
			expect(elem._dimensions[0].appliedCount).to.equal(1);
			expect(elem._dimensions[1].appliedCount).to.equal(0);
			expect(elem._dimensions[2].appliedCount).to.equal(1);

			setTimeout(() => value2.setSelected(true));
			await oneEvent(elem, 'd2l-filter-change');
			expect(elem._totalAppliedCount).to.equal(3);
			expect(elem._dimensions[0].appliedCount).to.equal(1);
			expect(elem._dimensions[1].appliedCount).to.equal(1);
			expect(elem._dimensions[2].appliedCount).to.equal(1);

			setTimeout(() => value1.setSelected(false));
			await oneEvent(elem, 'd2l-filter-change');
			expect(elem._totalAppliedCount).to.equal(2);
			expect(elem._dimensions[0].appliedCount).to.equal(0);
			expect(elem._dimensions[1].appliedCount).to.equal(1);
			expect(elem._dimensions[2].appliedCount).to.equal(1);
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
				{ name: 'Single Dim - None Selected', count: 0, dimensions: [{ key: 1, text: 'Role' }], text: 'Role', description: 'Filter by: Role. No filters applied.' },
				{ name: 'Single Dim - 1 Selected', count: 1, dimensions: [{ key: 1, text: 'Role' }], text: 'Role (1)', description: 'Filter by: Role. 1 filter applied.' },
				{ name: 'Single Dim - 5 Selected', count: 5, dimensions: [{ key: 1, text: 'Role' }], text: 'Role (5)', description: 'Filter by: Role. 5 filters applied.' },
				{ name: 'Single Dim - 99 Selected', count: 99, dimensions: [{ key: 1, text: 'Role' }], text: 'Role (99)', description: 'Filter by: Role. 99 filters applied.' },
				{ name: 'Single Dim - 100 Selected', count: 100, dimensions: [{ key: 1, text: 'Role' }], text: 'Role (99+)', description: 'Filter by: Role. 100 filters applied.' },
				{ name: 'Multiple Dims - None Selected', count: 0, dimensions: [{ key: 1, text: 'Role' }, { key: 2, text: 'Course' }], text: 'Filters', description: 'Filters. No filters applied.' },
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
				{ name: 'None Selected', dimensions: [{ key: 1, text: 'Role', appliedCount: 0 }, { key: 2 }], text: '0', description: 'No filters applied.' },
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
			searchSpy = spy(elem, '_performDimensionSearch');
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

		it('dimension search empty state changes are handled', async() => {
			const dimensionSet = elem.querySelector('d2l-filter-dimension-set[key="2"]');
			const emptyState = document.createElement('d2l-filter-dimension-set-empty-state');
			emptyState.actionHref = 'https://d2l.com';
			emptyState.actionText = 'Click me';
			emptyState.description = 'Description';
			emptyState.slot = 'search-empty-state';
			setTimeout(() => dimensionSet.appendChild(emptyState));

			await oneEvent(elem, 'd2l-filter-dimension-data-change');

			expect(elem._dimensions[1].searchEmptyState.actionHref).to.equal('https://d2l.com');
			expect(elem._dimensions[1].searchEmptyState.actionText).to.equal('Click me');
			expect(elem._dimensions[1].searchEmptyState.description).to.equal('Description');
			expect(updateStub).to.be.calledOnce;
			expect(recountSpy).to.be.not.be.called;
			expect(searchSpy).to.be.not.be.called;
		});

		it('dimension set empty state changes are handled', async() => {
			const dimensionSet = elem.querySelector('d2l-filter-dimension-set[key="2"]');
			const emptyState = document.createElement('d2l-filter-dimension-set-empty-state');
			emptyState.actionHref = 'https://d2l.com';
			emptyState.actionText = 'Click me';
			emptyState.description = 'Description';
			emptyState.slot = 'set-empty-state';
			setTimeout(() => dimensionSet.appendChild(emptyState));

			await oneEvent(elem, 'd2l-filter-dimension-data-change');

			expect(elem._dimensions[1].setEmptyState.actionHref).to.equal('https://d2l.com');
			expect(elem._dimensions[1].setEmptyState.actionText).to.equal('Click me');
			expect(elem._dimensions[1].setEmptyState.description).to.equal('Description');
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
			expect(updateStub).to.be.called;
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
			expect(elem._totalAppliedCount).to.equal(2);
			value.selected = true;

			await oneEvent(elem, 'd2l-filter-dimension-data-change');
			expect(elem._dimensions[1].values[0].selected).to.be.true;
			expect(elem._dimensions[1].appliedCount).to.equal(1);
			expect(elem._totalAppliedCount).to.equal(3);
			expect(updateStub).to.be.called;
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
			expect(elem._totalAppliedCount).to.equal(3);
			expect(updateStub).to.be.called;
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

			e.detail.searchCompleteCallback({ keysToDisplay: ['1'] });
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

	describe('return behaviour with multiple dimensions', () => {
		it('if there is no active dimension, do not change esc close behaviour', async() => {
			const elem = await fixture(singleSetDimensionFixture);
			const hideStub = stub(elem, '_handleDimensionHide');
			const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
			const dropdownContent = elem.shadowRoot.querySelector('d2l-dropdown-content');
			await dropdownContent.updateComplete;

			elem.opened = true;
			await oneEvent(dropdown, 'd2l-dropdown-open');
			expect(dropdownContent.opened).to.be.true;

			const event = new CustomEvent('keydown', {
				detail: 0,
				bubbles: true,
				cancelable: true,
				composed: true
			});
			event.key = 'Escape';
			event.keyCode = 27;

			const clearButton = elem.shadowRoot.querySelector('[slot="header"] d2l-button-subtle');
			setTimeout(() => clearButton.dispatchEvent(event));
			await oneEvent(dropdown, 'd2l-dropdown-close');
			expect(dropdownContent.opened).to.be.false;
			expect(elem.opened).to.be.false;
			expect(hideStub).to.not.have.been.called;
		});

		[{ key: 'Escape', keyCode: 27 }, { key: 'ArrowLeft', keyCode: 37 }].forEach(testCase => {
			it(`clicking ${testCase.key} in the header goes back to the dimension list`, async() => {
				const elem = await fixture(multiDimensionFixture);
				const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
				const dropdownContent = elem.shadowRoot.querySelector('d2l-dropdown-menu');
				await dropdownContent.updateComplete;
				const dimension = elem.shadowRoot.querySelector('d2l-menu-item');

				elem.opened = true;
				await oneEvent(dropdown, 'd2l-dropdown-open');

				setTimeout(() => dimension.click());
				await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
				expect(elem._activeDimensionKey).to.not.be.null;

				const event = new CustomEvent('keydown', {
					detail: 0,
					bubbles: true,
					cancelable: true,
					composed: true
				});
				event.key = testCase.key;
				event.keyCode = testCase.keyCode;

				const returnButton = elem.shadowRoot.querySelector('d2l-button-icon[icon="tier1:chevron-left"]');
				setTimeout(() => returnButton.dispatchEvent(event));
				await oneEvent(elem, 'd2l-hierarchical-view-hide-complete');
				expect(elem._activeDimensionKey).to.be.null;
				expect(elem.shadowRoot.querySelector('d2l-button-icon[icon="tier1:chevron-left"]')).to.be.null;
				expect(elem.shadowRoot.querySelector('d2l-button-subtle[slot="header"]')).to.not.be.null;
				expect(dropdownContent.opened).to.be.true;
				expect(elem.opened).to.be.true;
			});

			it(`set dimension - clicking ${testCase.key} in the content goes back to the dimension list`, async() => {
				const elem = await fixture(multiDimensionFixture);
				const dropdown = elem.shadowRoot.querySelector('d2l-dropdown-button-subtle');
				const dropdownContent = elem.shadowRoot.querySelector('d2l-dropdown-menu');
				await dropdownContent.updateComplete;
				const dimension = elem.shadowRoot.querySelector('d2l-menu-item');

				elem.opened = true;
				await oneEvent(dropdown, 'd2l-dropdown-open');

				setTimeout(() => dimension.click());
				await oneEvent(elem, 'd2l-hierarchical-view-show-complete');
				expect(elem._activeDimensionKey).to.not.be.null;

				const event = new CustomEvent('keydown', {
					detail: 0,
					bubbles: true,
					cancelable: true,
					composed: true
				});
				event.key = testCase.key;
				event.keyCode = testCase.keyCode;

				const firstListItem = elem.shadowRoot.querySelector('d2l-list-item');
				firstListItem.focus();
				setTimeout(() => firstListItem.dispatchEvent(event));
				await oneEvent(elem, 'd2l-hierarchical-view-hide-complete');
				expect(elem._activeDimensionKey).to.be.null;
				expect(elem.shadowRoot.querySelector('d2l-button-icon[icon="tier1:chevron-left"]')).to.be.null;
				expect(elem.shadowRoot.querySelector('d2l-button-subtle[slot="header"]')).to.not.be.null;
				expect(dropdownContent.opened).to.be.true;
				expect(elem.opened).to.be.true;
			});
		});
	});

	describe('Active filter subscribers', () => {
		let elem;
		const waitExtra = async(element, eventName) => {
			if (eventName) await oneEvent(element, eventName);
			await elem.updateComplete;
			await new Promise(resolve => setTimeout(resolve, 0));
		};

		it('If there are no subscribers, active filters are not calculated', async() => {
			elem = await fixture(multiDimensionFixture);
			const updateSpy = spy(elem, '_updateActiveFilters');

			expect(elem._activeFilters).to.be.null;

			setTimeout(() => {
				elem.shadowRoot.querySelector('[data-key="1"] d2l-list-item[key="1"]').setSelected(false);
			});
			await oneEvent(elem, 'd2l-filter-change');

			expect(updateSpy).to.not.have.been.called;
			expect(elem._activeFilters).to.be.null;
		});

		it('If there are subscribers, active filters are calculated properly', async() => {
			elem = await fixture(multiDimensionFixture);
			elem._activeFiltersSubscribers.subscribe({ updateActiveFilters: () => {} });
			await elem.updateComplete;

			const item1 = elem.shadowRoot.querySelector('[data-key="1"] d2l-list-item[key="1"]');
			const item2 = elem.shadowRoot.querySelector('[data-key="2"] d2l-list-item[key="1"]');
			const item3 = elem.shadowRoot.querySelector('[data-key="3"] d2l-list-item[key="2"]');

			expect(elem._activeFilters).to.deep.equal([
				{ keyObject: { dimension: '1', value: '1' }, text: 'Dim 1: Value 1' },
				{ keyObject: { dimension: '3', value: '2' }, text: 'Value 2' }
			]);

			setTimeout(() => item1.setSelected(false));
			await oneEvent(item1, 'd2l-list-item-selected');
			setTimeout(() => item2.setSelected(true));
			await oneEvent(item2, 'd2l-list-item-selected');
			setTimeout(() => item3.setSelected(false));
			await oneEvent(item3, 'd2l-list-item-selected');

			await waitExtra(elem, 'd2l-filter-change');

			expect(elem._activeFilters).to.deep.equal([
				{ keyObject: { dimension: '2', value: '1' }, text: 'Dim 2: Value 1' }
			]);
		});

		it('If an additional subscriber is added, they are sent the active filters (which are not recalculated)', async() => {
			elem = await fixture(multiDimensionFixture);
			elem._activeFiltersSubscribers.subscribe({ updateActiveFilters: () => {} });
			await elem.updateComplete;

			const updateSpy = spy(elem, '_updateActiveFilters');
			let id, result;
			elem._activeFiltersSubscribers.subscribe({ updateActiveFilters: (filterId, activeFilters) => { id = filterId; result = activeFilters; } });

			expect(updateSpy).to.not.have.been.called;
			expect(result).to.equal(elem._activeFilters);
			expect(id).to.equal('multi');
		});

		describe('Active filters are recalculated and subscribers are updated when', () => {
			let subscriberUpdated, updateSpy;

			beforeEach(async() => {
				elem = await fixture(multiDimensionFixture);
				subscriberUpdated = false;
				elem._activeFiltersSubscribers.subscribe({ updateActiveFilters: () => subscriberUpdated = true });
				await elem.updateComplete;
				updateSpy = spy(elem, '_updateActiveFilters');
			});

			it('the filter slot changes (dimension added/removed)', async() => {
				const newDim = document.createElement('d2l-filter-dimension-set');
				newDim.key = 'newDim';
				newDim.text = 'New Dim';
				setTimeout(() => elem.appendChild(newDim));
				await waitExtra(elem.shadowRoot.querySelector('slot'), 'slotchange');

				expect(updateSpy).to.be.calledOnce;
				expect(subscriberUpdated).to.be.true;
			});

			it('a dimension slot changes (value added/removed)', async() => {
				const dimension = elem.querySelector('d2l-filter-dimension-set[key="2"]');
				const newValue = document.createElement('d2l-filter-dimension-set-value');
				newValue.key = 'newValue';
				newValue.text = 'New Value';
				dimension.appendChild(newValue);
				await waitExtra(elem, 'd2l-filter-dimension-data-change');

				expect(updateSpy).to.be.calledOnce;
				expect(subscriberUpdated).to.be.true;
			});

			it('a value is selected (programatically)', async() => {
				const value = elem.querySelector('d2l-filter-dimension-set[key="2"] d2l-filter-dimension-set-value');
				value.selected = true;
				await waitExtra(elem, 'd2l-filter-dimension-data-change');

				expect(updateSpy).to.be.calledOnce;
				expect(subscriberUpdated).to.be.true;
			});

			it('a value is unselected (programatically)', async() => {
				const value = elem.querySelector('d2l-filter-dimension-set[key="1"] d2l-filter-dimension-set-value');
				value.selected = false;
				await waitExtra(elem, 'd2l-filter-dimension-data-change');

				expect(updateSpy).to.be.calledOnce;
				expect(subscriberUpdated).to.be.true;
			});

			it('a value is selected (by the user)', async() => {
				setTimeout(() => elem.shadowRoot.querySelector('[data-key="2"] d2l-list-item[key="1"]').setSelected(true));
				await waitExtra(elem, 'd2l-filter-change');

				expect(updateSpy).to.be.calledOnce;
				expect(subscriberUpdated).to.be.true;
			});

			it('a value is unselected (by the user)', async() => {
				setTimeout(() => elem.shadowRoot.querySelector('[data-key="1"] d2l-list-item[key="1"]').setSelected(false));
				await waitExtra(elem, 'd2l-filter-change');

				expect(updateSpy).to.be.calledOnce;
				expect(subscriberUpdated).to.be.true;
			});

			it('a value is cleared using requestFilterValueClear', async() => {
				elem.requestFilterValueClear({ dimension: '1', value: '1' });
				await waitExtra(elem, 'd2l-filter-change');

				expect(updateSpy).to.be.calledOnce;
				expect(subscriberUpdated).to.be.true;
			});

			it('the clear button is pressed', async() => {
				setTimeout(() => elem._handleClear());
				await waitExtra(elem, 'd2l-filter-change');

				expect(updateSpy).to.be.calledOnce;
				expect(subscriberUpdated).to.be.true;
			});

			it('the clear all button is pressed', async() => {
				setTimeout(() => elem._handleClearAll());
				await waitExtra(elem, 'd2l-filter-change');

				expect(updateSpy).to.be.calledOnce;
				expect(subscriberUpdated).to.be.true;
			});
		});
	});
});
