import '../filter.js';
import '../filter-dimension-set.js';
import '../filter-dimension-set-value.js';
import '../filter-overflow-group.js';
import { clickElem, expect, fixture, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

function createFilters(keys, opts) {
	const { id, hidden, selected } = { hidden: false, selected: [false, false], ...opts };
	return html`${keys.map(key => html`
		<d2l-filter id="${ifDefined(id)}" style="${ifDefined(hidden ? 'display: none;' : undefined)}">
			<d2l-filter-dimension-set key="${key}" text="Skill ${key}">
				<d2l-filter-dimension-set-value key="1" text="Communication" ?selected="${selected[0]}"></d2l-filter-dimension-set-value>
				<d2l-filter-dimension-set-value key="2" text="Leadership" ?selected="${selected[1]}"></d2l-filter-dimension-set-value>
			</d2l-filter-dimension-set>
		</d2l-filter>
	`)}`;
}

describe('filter-overflow-group', () => {
	[
		{ name: 'more-than-max-to-show', template: html`<d2l-filter-overflow-group min-to-show="2" max-to-show="3">${createFilters([1, 2, 3, 4, 5])}</d2l-filter-overflow-group>` },
		{ name: 'one-more-than-max-to-show', template: html`<d2l-filter-overflow-group min-to-show="2" max-to-show="3">${createFilters([1, 2, 3, 4])}</d2l-filter-overflow-group>` },
		{ name: 'less-than-min-to-show', template: html`<d2l-filter-overflow-group min-to-show="3">${createFilters([1, 2])}</d2l-filter-overflow-group>` },
		{ name: 'between-min-max-to-show', template: html`<d2l-filter-overflow-group min-to-show="2" max-to-show="4">${createFilters([1, 2, 3])}</d2l-filter-overflow-group>` },
		{ name: 'exactly-max-to-show', template: html`<d2l-filter-overflow-group min-to-show="2" max-to-show="4">${createFilters([1, 2, 3, 4])}</d2l-filter-overflow-group>` },
		{ name: 'ignores-hidden-filter', template: html`<d2l-filter-overflow-group min-to-show="1" max-to-show="2">${createFilters([1], { hidden: true })}${createFilters([2, 3])}</d2l-filter-overflow-group>` },
		{ name: 'small-width', template: html`<d2l-filter-overflow-group style="width: 300px;">${createFilters([1, 2, 3])}${createFilters([4], { selected: [true, false] })}</d2l-filter-overflow-group>` }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template);
			await expect(elem).to.be.golden();
		});
	});

	[700, 400, 320, 500].forEach((width) => {
		describe('basic width', () => {
			it(`${width}`, async() => {
				const elem = await fixture(html`
					<d2l-filter-overflow-group>
						${createFilters([1, 2])}
						<d2l-filter>
							<d2l-filter-dimension-set key="3" text="Skill 3">
								<d2l-filter-dimension-set-value key="communication" text="Communication" selected></d2l-filter-dimension-set-value>
								<d2l-filter-dimension-set-value key="leadership" text="Leadership"></d2l-filter-dimension-set-value>
							</d2l-filter-dimension-set>
							<d2l-filter-dimension-set key="4" text="Skill 4">
								<d2l-filter-dimension-set-value key="communication" text="Communication"></d2l-filter-dimension-set-value>
								<d2l-filter-dimension-set-value key="leadership" text="Leadership"></d2l-filter-dimension-set-value>
							</d2l-filter-dimension-set>
						</d2l-filter>
						${createFilters([5], { selected: [true, false] })}
					</d2l-filter-overflow-group>
				`, { viewport: { width: width + 76 } }); // account for page padding
				await expect(elem).to.be.golden();
			});
		});

		describe('tags width', () => {
			it(`${width}`, async() => {
				const elem = await fixture(html`
					<d2l-filter-overflow-group tags>
						${createFilters([1], { selected: [true, false] })}
						${createFilters([2], { id: 'filter-2', selected: [true, true] })}
						${createFilters([3], { selected: [false, true] })}
					</d2l-filter-overflow-group>
				`, { viewport: { width: width + 76 } }); // account for page padding
				await expect(elem).to.be.golden();
			});
		});
	});

	it('click dropdown opener', async() => {
		const elem = await fixture(html`<d2l-filter-overflow-group min-to-show="2" max-to-show="3">${createFilters([1, 2, 3, 4, 5])}</d2l-filter-overflow-group>`);
		const overflowContainer = elem.shadowRoot.querySelector('.d2l-overflow-container');
		await clickElem(overflowContainer);
		await expect(elem).to.be.golden();
	});

});
