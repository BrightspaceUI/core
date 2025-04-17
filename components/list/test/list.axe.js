import '../list.js';
import '../list-controls.js';
import '../list-item.js';
import '../list-item-button.js';
import '../../selection/selection-action.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const getListTemplate = options => {
	return html`
		<d2l-list ?grid="${options.grid}">
			<d2l-list-controls slot="controls">
				<d2l-selection-action icon="tier1:bookmark-hollow" text="Bookmark" requires-selection></d2l-selection-action>
				<d2l-selection-action icon="tier1:gear" text="Settings"></d2l-selection-action>
			</d2l-list-controls>
			<d2l-list-item>
				<div class="d2l-list-item-text d2l-body-compact">Identify categories of physical activities</div>
				<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation A1.2</div>
			</d2l-list-item>
			<d2l-list-item href="http://www.d2l.com">
				<div class="d2l-list-item-text d2l-body-compact">Identify categories of physical activities</div>
				<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation A1.2</div>
			</d2l-list-item>
			<d2l-list-item-button>
				<div class="d2l-list-item-text d2l-body-compact">Apply a decision-making process to assess risks and make safe decisions in a variety of situations</div>
				<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation B2.1</div>
			</d2l-list-item-button>
		</d2l-list>
	`;
};

describe('d2l-list', () => {

	it('should pass all aXe tests in list mode', async() => {
		const elem = await fixture(getListTemplate({ grid: false }));
		await expect(elem).to.be.accessible();
	});

	it('should pass all aXe tests in grid mode', async() => {
		const elem = await fixture(getListTemplate({ grid: true }));
		await expect(elem).to.be.accessible({ ignoredRules: ['aria-required-parent'] }); // d2l-list's grid mode does not apply the grid role because Safari does not properly handle cases where the roles (grid, row, gridcell) are distributed across DOM scopes
	});

});
