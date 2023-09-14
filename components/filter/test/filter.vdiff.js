import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-empty-state.js';
import '../filter-dimension-set-value.js';
import { clickElem, expect, fixture, html, nextFrame, oneEvent, sendKeysElem, waitUntil } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nothing } from 'lit';

function createFilterWrapper(content, opts = {}) {
	const { openUp, text } =  { openUp: false, ...opts };
	return html`
		<d2l-filter text="${ifDefined(text)}" style="${ifDefined(openUp ? 'position: absolute; bottom: 30px;' : undefined)}">
			${content}
		</d2l-filter>
	`;
}

function createEmptySingleDim(opts) {
	const { customEmptyState } =  { customEmptyState: false, ...opts };
	return createFilterWrapper(html`
		<d2l-filter-dimension-set key="course" text="Course">
			${customEmptyState ? html`<d2l-filter-dimension-set-empty-state slot="set-empty-state" description="No courses." action-text="Add a Course"></d2l-filter-dimension-set-empty-state>` : nothing }
		</d2l-filter-dimension-set>
	`);
}
function createSingleDim(opts) {
	const { selected, searchType, selectAll, clampingValues, openUp } =  { selected: false, selectAll: false, clampingValues: false, openUp: false, ...opts };
	return createFilterWrapper(html`
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
	`, { openUp });
}
function createSingleDimWithCounts(opts) {
	const { headerText, selectedFirst, short } =  { selectedFirst: false, short: false, ...opts };
	return createFilterWrapper(html`
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
	`);
}
function createSingleDimSingleSelection(opts) {
	const { selected, openUp, introductoryText } =  { selected: false, openUp: false, ...opts };
	return createFilterWrapper(html`
		<d2l-filter-dimension-set key="semester" text="Semester" selection-single ?select-all="${selected}" introductory-text="${ifDefined(introductoryText)}">
			<d2l-filter-dimension-set-value key="fall" text="Fall"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="winter" text="Winter" ?disabled="${!selected}" ?selected="${selected}"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="spring" text="Spring" ?selected="${selected}"></d2l-filter-dimension-set-value>
			<d2l-filter-dimension-set-value key="summer" text="Summer"></d2l-filter-dimension-set-value>
		</d2l-filter-dimension-set>
	`, { openUp });
}

function createEmptyMultipleDims(opts) {
	const { long, openUp, text } = { long: false, openUp: false, ...opts };
	return createFilterWrapper(html`
		<d2l-filter-dimension-set key="course" text="Course"></d2l-filter-dimension-set>
		<d2l-filter-dimension-set key="role" text="Role"></d2l-filter-dimension-set>
		${ long ? html`<d2l-filter-dimension-set key="long" text="Very Long Dimension Title For Testing Text Line Clamp Truncation that would span multiple lines."></d2l-filter-dimension-set>` : nothing }
	`, { openUp, text });
}

describe('filter', () => {

	describe('opener', () => {
		it('disabled', async() => {
			const elem = await fixture(html`<d2l-filter disabled></d2l-filter>`);
			await expect(elem).to.be.golden();
		});

		[
			{ name: 'single', template: createEmptySingleDim() },
			{ name: 'multiple', template: createEmptyMultipleDims() },
			{ name: 'multiple-rtl', lang: 'ar', template: createEmptyMultipleDims() },
			{ name: 'multiple-text-override', template: createEmptyMultipleDims({ text: 'More Filters' }) },
		].forEach(({ name, template, lang }) => {
			it(`${name}-over-99`, async() => {
				const elem = await fixture(template, { lang });
				elem._totalAppliedCount = 100;
				await elem.updateComplete;
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('single-set', () => {
		[true, false].forEach(rtl => {
			[
				{ name: 'empty', template: createEmptySingleDim() },
				{ name: 'introductory-text', template: createSingleDimSingleSelection({ openUp: true, introductoryText: 'Filter content by courses. Start typing any course name to explore.' }) },
				{ name: 'single-selection', template: createSingleDimSingleSelection() },
				{ name: 'single-selection-select-all', template: createSingleDimSingleSelection({ selected: true }) },
				{ name: 'multi-selection', template: createSingleDimWithCounts() },
				{ name: 'multi-selection-header-text', template: createSingleDimWithCounts({ short: true, headerText: 'Related Courses at Your Company' }) },
				{ name: 'multi-selection-header-text-selected-first', template: createSingleDimWithCounts({ headerText: 'Related Courses at Your Company', selectedFirst: true }) },
				{ name: 'multi-selection-selected-first', template: createSingleDimWithCounts({ selectedFirst: true }) },
				{ name: 'multi-selection-no-search', template: createSingleDim({ searchType: 'none' }) },
				{ name: 'multi-selection-no-search-select-all', template: createSingleDim({ searchType: 'none', selectAll: true }) },
				{ name: 'multi-selection-all-selected', template: createSingleDim({ selected: true, selectAll: true }) },
				{ name: 'multi-selection-clamping', template: createSingleDim({ openUp: true, selected: true, selectAll: true, clampingValues: true }) }
			].forEach(({ name, template }) => {
				it(`${rtl ? 'rtl-' : ''}${name}`, async() => {
					const elem = await fixture(template, { rtl, viewport: { height: 1500 } });
					elem.opened = true;
					await oneEvent(elem, 'd2l-filter-dimension-first-open');
					await nextFrame();
					await expect(elem).to.be.golden();
				});

				it(`${rtl ? 'rtl-' : ''}mobile-${name}`, async() => {
					const elem = await fixture(template, { rtl, viewport: { width: 600, height: 500 } });
					sendKeysElem(elem, 'press', 'Enter');
					await oneEvent(elem, 'd2l-filter-dimension-first-open');
					await nextFrame();
					await expect(document).to.be.golden();
				});
			});
		});

		it('custom-empty', async() => {
			const elem = await fixture(createEmptySingleDim({ customEmptyState: true }));
			elem.opened = true;
			await oneEvent(elem, 'd2l-filter-dimension-first-open');
			await nextFrame();
			await expect(elem).to.be.golden();
		});

		describe('searched', () => {
			[
				{ name: 'single-selection', search: 'empty', template: createSingleDimSingleSelection() },
				{ name: 'single-selection-select-all', search: 'w', template: createSingleDimSingleSelection({ selected: true }) },
				{ name: 'multi-selection', search: 'empty', template: createSingleDimWithCounts() },
				{ name: 'multi-selection-header-text', search: 'a', template: createSingleDimWithCounts({ short: true, headerText: 'Related Courses at Your Company' }) },
				{ name: 'multi-selection-selected-first', search: 'a', template: createSingleDimWithCounts({ selectedFirst: true }) },
				{ name: 'multi-selection-clamping', search: 'st', template: createSingleDim({ selected: true, selectAll: true, clampingValues: true }) }
			].forEach(({ name, template, search }) => {
				it(name, async() => {
					const elem = await fixture(template);
					elem._handleSearch({ detail: { value: search } });
					await elem.updateComplete;
					elem.opened = true;
					await oneEvent(elem, 'd2l-filter-dimension-first-open');
					await nextFrame();
					await expect(elem).to.be.golden();
				});
			});
		});

		[
			{ name: 'press-clear', allSelected: true, selector: 'd2l-button-subtle' },
			{ name: 'press-unselect-all', allSelected: true, selector: 'd2l-selection-select-all', openUp: true },
			{ name: 'press-select-all', allSelected: false, selector: 'd2l-selection-select-all', openUp: true }
		].forEach(({ name, allSelected, selector, openUp }) => {
			it(name, async() => {
				const elem = await fixture(createFilterWrapper(html`
					<d2l-filter-dimension-set key="course" text="Course" select-all>
						<d2l-filter-dimension-set-value key="art" text="Art" ?selected="${allSelected}"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="astronomy" text="Astronomy" ?selected="${allSelected}"></d2l-filter-dimension-set-value>
						<d2l-filter-dimension-set-value key="biology" text="Biology" ?selected="${allSelected}"></d2l-filter-dimension-set-value>
					</d2l-filter-dimension-set>
				`, { openUp }));
				elem.opened = true;
				await oneEvent(elem, 'd2l-filter-dimension-first-open');
				await clickElem(elem.shadowRoot.querySelector(selector));
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('multiple', () => {
		async function enterDimension(filter, dimNum) {
			const menu = filter.shadowRoot.querySelector('d2l-menu');
			const initialMenuHeight = menu.clientHeight;
			const dims = filter.shadowRoot.querySelectorAll('d2l-menu-item');
			sendKeysElem(dims[dimNum - 1], 'press', 'Enter');
			await oneEvent(filter, 'd2l-filter-dimension-first-open');
			await waitUntil(() => menu.clientHeight !== initialMenuHeight);
		}

		const multipleDims = createFilterWrapper(html`
			<d2l-filter-dimension-set key="course" header-text="Related Courses at Your Company" text="Course" select-all selected-first>
				<d2l-filter-dimension-set-value key="art" text="Art"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="astronomy" text="Astronomy" selected></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="biology" text="Biology" disabled></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="chemistry" text="Chemistry" selected></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="english" text="English" selected></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="how-to" text="How To Write a How To Article With a Flashy Title"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="math" text="Math" selected></d2l-filter-dimension-set-value>
			</d2l-filter-dimension-set>
			<d2l-filter-dimension-set key="role" introductory-text="Filter content by courses. Start typing any course name to explore." text="Role">
				<d2l-filter-dimension-set-value key="admin" text="Admin" selected></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="instructor" text="Instructor"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="student" text="Student" selected></d2l-filter-dimension-set-value>
			</d2l-filter-dimension-set>
			<d2l-filter-dimension-set key="long" text="Very Long Dimension Title For Testing Text Line Clamp Truncation that would span multiple lines." select-all search-type="none">
				<d2l-filter-dimension-set-value key="long" text="Very Long Dimension Title For Testing Text Line Clamp Truncation that would span multiple lines." selected></d2l-filter-dimension-set-value>
			</d2l-filter-dimension-set>
		`, { openUp: true });

		[true, false].forEach(rtl => {
			[
				{ name: 'empty', template: createEmptyMultipleDims({ long: true, openUp: true }) },
				{ name: 'selected', template: multipleDims },
				...[1, 2, 3].map(dimNum => ({ name: `nested-dim-${dimNum}`, dimNum, template: multipleDims })),
			].forEach(({ name, template, dimNum }) => {
				it(`${rtl ? 'rtl-' : ''}${name}`, async() => {
					const elem = await fixture(template, { rtl });
					sendKeysElem(elem, 'press', 'Enter');
					await oneEvent(elem.shadowRoot.querySelector('d2l-dropdown-menu'), 'd2l-dropdown-open');
					await nextFrame();
					if (dimNum) await enterDimension(elem, dimNum);
					await expect(elem).to.be.golden();
				});

				it(`${rtl ? 'rtl-' : ''}mobile-${name}`, async() => {
					const elem = await fixture(template, { rtl, viewport: { width: 600, height: 500 } });
					sendKeysElem(elem, 'press', 'Enter');
					await oneEvent(elem.shadowRoot.querySelector('d2l-dropdown-menu'), 'd2l-dropdown-open');
					await nextFrame();
					if (dimNum) await enterDimension(elem, dimNum);
					await expect(document).to.be.golden();
				});
			});
		});

		it('press-clear-all', async() => {
			const elem = await fixture(createFilterWrapper(html`
				<d2l-filter-dimension-set key="course" text="Course" select-all>
					<d2l-filter-dimension-set-value key="art" text="Art" selected></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="astronomy" text="Astronomy" selected></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="biology" text="Biology" selected></d2l-filter-dimension-set-value>
				</d2l-filter-dimension-set>
				<d2l-filter-dimension-set key="role" text="Role">
					<d2l-filter-dimension-set-value key="admin" text="Admin" selected></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="instructor" text="Instructor"></d2l-filter-dimension-set-value>
					<d2l-filter-dimension-set-value key="student" text="Student" selected></d2l-filter-dimension-set-value>
				</d2l-filter-dimension-set>
			`, { openUp: true }));
			elem.opened = true;
			await oneEvent(elem.shadowRoot.querySelector('d2l-dropdown-menu'), 'd2l-dropdown-open');
			await clickElem(elem.shadowRoot.querySelector('d2l-button-subtle'));
			await expect(elem).to.be.golden();
		});
	});
});
