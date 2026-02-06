import '../../components/filter/filter-dimension-set.js';
import '../../components/filter/filter-dimension-set-empty-state.js';
import '../../components/filter/filter-dimension-set-date-text-value.js';
import '../../components/filter/filter-dimension-set-date-time-range-value.js';
import '../../components/filter/filter-dimension-set-value.js';
import { expect, fixture, html, nextFrame, oneEvent, sendKeysElem, waitUntil } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nothing } from 'lit';
import '../../components/filter/filter.js';

function createEmptySingleDim(opts) {
	const { customEmptyState } = { customEmptyState: false, ...opts };
	return html`
		<d2l-filter>
			<d2l-filter-dimension-set key="course" text="Course">
				${customEmptyState ? html`<d2l-filter-dimension-set-empty-state slot="set-empty-state" description="No courses." action-text="Add a Course"></d2l-filter-dimension-set-empty-state>` : nothing }
			</d2l-filter-dimension-set>
		</d2l-filter>
	`;
}
function createSingleDim(opts) {
	const { selected, searchType, selectAll, clampingValues } = { selected: false, selectAll: false, clampingValues: false, ...opts };
	return html`
		<d2l-filter>
			<d2l-filter-dimension-set key="course" text="Course" search-type="${ifDefined(searchType)}" ?select-all="${selectAll}">
				<d2l-filter-dimension-set-value key="art" text="Art" ?selected="${selected}"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="astronomy" text="Astronomy" selected></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="biology" text="Biology" ?selected="${selected}" ?disabled="${selected}"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="chemistry" text="Chemistry" ?selected="${selected}"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="english" text="English" ?selected="${selected || selectAll}"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="how-to" text="How To Write a How To Article With a Flashy Title" ?selected="${selected}"></d2l-filter-dimension-set-value>
				${ clampingValues ? html`
					<d2l-filter-dimension-set-value key="line-clamp" text="Very Long Dimension Title For Testing Text Line Clamp Truncation that would span multiple lines."></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="long-word" text="Text with a long word like hippopotomonstrosesquippedaliophobia that break"></d2l-filter-dimension-set-value>
				` : nothing}
				<d2l-filter-dimension-set-value key="math" text="Math" ?selected="${selected}"></d2l-filter-dimension-set-value>
			</d2l-filter-dimension-set>
		</d2l-filter>
	`;
}
function createSingleDimWithCounts(opts) {
	const { headerText, selectedFirst, short } = { selectedFirst: false, short: false, ...opts };
	return html`
		<d2l-filter>
			<d2l-filter-dimension-set key="course" text="Course" ?selected-first="${selectedFirst}" header-text="${ifDefined(headerText)}">
				${short ? html`
					<d2l-filter-dimension-set-value key="art" text="Art" count="0"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="biology" text="Biology" count="23" disabled></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="chemistry" text="Chemistry"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="english" text="English" count="1012"></d2l-filter-dimension-set-value>
				` : html`
					<d2l-filter-dimension-set-value key="art" text="Art" count="0" ?selected="${selectedFirst && headerText}"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="astronomy" text="Astronomy" count="1" ?selected="${selectedFirst && !headerText}"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="biology" text="Biology" count="23" disabled></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="chemistry" text="Chemistry"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="english" text="English" count="1012" ?selected="${selectedFirst}"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="how-to" text="How To Write a How To Article With a Flashy Title" count="12"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="math" text="Math" count="10968"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-empty-state slot="search-empty-state" description="No search results." action-text="Go here" action-href="https://d2l.com/"></d2l-filter-dimension-set-empty-state>
				`}
			</d2l-filter-dimension-set>
		</d2l-filter>
	`;
}
function createSingleDimSingleSelection(opts) {
	const { selected, introductoryText, breakTest } = { selected: false, ...opts };
	return html`
		<d2l-filter>
			<d2l-filter-dimension-set key="semester" text="Semester" selection-single ?select-all="${selected}" introductory-text="${ifDefined(introductoryText)}">
				<d2l-filter-dimension-set-value key="fall" text="Fall"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="winter" text="Winter" ?disabled="${!selected}" ?selected="${selected}"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="spring" text="Spring" ?selected="${selected}"></d2l-filter-dimension-set-value>
				${breakTest ? nothing : html`<d2l-filter-dimension-set-value key="summer" text="Summer"></d2l-filter-dimension-set-value>`}
			</d2l-filter-dimension-set>
		</d2l-filter>
	`;
}
function createSingleDimDate() {
	return html`
		<d2l-filter>
			<d2l-filter-dimension-set key="dates" text="Dates">
				<d2l-filter-dimension-set-value key="lastweek" text="Last week"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-date-text-value key="lastHour" range="lastHour" selected></d2l-filter-dimension-set-date-text-value>
				<d2l-filter-dimension-set-date-text-value key="48hours" range="48hours" disabled></d2l-filter-dimension-set-date-text-value>
				<d2l-filter-dimension-set-date-text-value key="14days" range="14days"></d2l-filter-dimension-set-date-text-value>
				<d2l-filter-dimension-set-date-text-value key="6months" range="6months"></d2l-filter-dimension-set-date-text-value>
			</d2l-filter-dimension-set>
		</d2l-filter>
	`;
}
function createSingleDimDateCustom(opts) {
	const { long, customSelected, longCustomSelected, opened, startValue, endValue, type } = { long: false, customSelected: false, longCustomSelected: false, opened: false, type: 'date-time', ...opts };
	return html`
		<d2l-filter ?opened="${opened}">
			<d2l-filter-dimension-set key="dates" text="Dates">
				<d2l-filter-dimension-set-value key="lastweek" text="Last week"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-date-text-value key="lastHour" range="lastHour" ?selected="${!customSelected && !longCustomSelected}"></d2l-filter-dimension-set-date-text-value>
				<d2l-filter-dimension-set-date-text-value key="48hours" range="48hours" disabled></d2l-filter-dimension-set-date-text-value>
				<d2l-filter-dimension-set-date-text-value key="14days" range="14days"></d2l-filter-dimension-set-date-text-value>
				<d2l-filter-dimension-set-date-text-value key="6months" range="6months"></d2l-filter-dimension-set-date-text-value>
				<d2l-filter-dimension-set-date-time-range-value key="custom" ?selected="${customSelected && !longCustomSelected}" start-value="${ifDefined(startValue)}" end-value="${ifDefined(endValue)}" type="${type}"></d2l-filter-dimension-set-date-time-range-value>
				<d2l-filter-dimension-set-date-time-range-value key="custom2" text="Other text" ></d2l-filter-dimension-set-date-time-range-value>
				${ long ? html`<d2l-filter-dimension-set-date-time-range-value key="custom3" text="Very Long Dimension Title For Testing Text Line Clamp Truncation that would span multiple lines." ?selected="${longCustomSelected}"></d2l-filter-dimension-set-date-time-range-value>` : nothing }
			</d2l-filter-dimension-set>
		</d2l-filter>
	`;
}

export function test(rtl, dark = false) {
	const breakTest = true;
	[
		{ name: 'empty', template: createEmptySingleDim() },
		{ name: 'introductory-text', template: createSingleDimSingleSelection({ introductoryText: 'Filter content by courses. Start typing any course name to explore.', breakTest }) },
		{ name: 'single-selection', template: createSingleDimSingleSelection({ breakTest}) },
		{ name: 'single-selection-select-all', template: createSingleDimSingleSelection({ selected: true, breakTest }) },
		{ name: 'multi-selection', template: createSingleDimWithCounts() },
		{ name: 'multi-selection-header-text', template: createSingleDimWithCounts({ short: true, headerText: 'Related Courses at Your Company' }) },
		{ name: 'multi-selection-header-text-selected-first', template: createSingleDimWithCounts({ headerText: 'Related Courses at Your Company', selectedFirst: true }) },
		{ name: 'multi-selection-selected-first', template: createSingleDimWithCounts({ selectedFirst: true }) },
		{ name: 'multi-selection-no-search', template: createSingleDim({ searchType: 'none' }) },
		{ name: 'multi-selection-no-search-select-all', template: createSingleDim({ searchType: 'none', selectAll: true }) },
		{ name: 'multi-selection-all-selected', template: createSingleDim({ selected: true, selectAll: true }) },
		{ name: 'multi-selection-clamping', template: createSingleDim({ selected: true, selectAll: true, clampingValues: true }) },
		{ name: 'dates', template: createSingleDimDate() },
		{ name: 'dates-long', template: createSingleDimDateCustom({ long: true }) },
		{ name: 'dates-custom-selected', template: createSingleDimDateCustom({ customSelected: true, opened: true }) },
		// { name: 'dates-custom-selected-start-value', template: createSingleDimDateCustom({ customSelected: true, startValue: '2018-02-12T05:00:00.000Z' }), waitForBlockDisplay: true },
		// { name: 'dates-custom-selected-start-value-date', template: createSingleDimDateCustom({ customSelected: true, startValue: '2018-02-12T05:00:00.000Z', type: 'date' }) },
		// { name: 'dates-custom-selected-same-start-end-date', template: createSingleDimDateCustom({ customSelected: true, startValue: '2018-02-12T05:00:00.000Z', endValue: '2018-02-13T04:59:59.000Z', type: 'date' }) },
		{ name: 'dates-long-custom-selected', template: createSingleDimDateCustom({ long: true, longCustomSelected: true }) },
	].forEach(({ name, template, waitForBlockDisplay }) => {
		it.only(`${rtl ? 'rtl-' : ''}${dark ? 'dark-' : ''}${name}`, async() => {
			const elem = await fixture(template, { dark, rtl, viewport: { height: 1500 } });
			if (!elem.opened) {
				elem.opened = true;
				await oneEvent(elem, 'd2l-filter-dimension-first-open');
				const hasSearch = elem.shadowRoot.querySelector('d2l-input-search');
				if (hasSearch) await oneEvent(elem.shadowRoot.querySelector('d2l-dropdown'), 'd2l-dropdown-position');
				await nextFrame();
				if (waitForBlockDisplay) {
					await waitUntil(() => elem.shadowRoot.querySelector('d2l-input-date-time-range').shadowRoot.querySelector('d2l-input-date-time-range-to')._blockDisplay, 'component never changed layout');
					await elem.updateComplete;
					await nextFrame();
				}
			}
			await nextFrame();
			await expect(elem).to.be.golden();
		});

		it.only(`${rtl ? 'rtl-' : ''}${dark ? 'dark-' : ''}mobile-${name}`, async() => {
			const elem = await fixture(template, { dark, rtl, viewport: { width: 600, height: 500 } });
			if (!elem.opened) {
				sendKeysElem(elem, 'press', 'Enter');
				await oneEvent(elem, 'd2l-filter-dimension-first-open');
			}
			await nextFrame();
			await expect(document).to.be.golden();
		});
	});

}
