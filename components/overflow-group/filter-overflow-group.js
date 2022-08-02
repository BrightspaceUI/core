import '../filter/filter.js';
import { css, html, LitElement } from 'lit';
import { OVERFLOW_DROPDOWN_CLASS, OverflowGroupMixin } from './overflow-group-mixin.js';

function createFilterItem(node) {
	const dimensionSets = node.querySelectorAll('d2l-filter-dimension-set');
	const clones = Array.from(dimensionSets).map((set) => set.cloneNode(true));
	return clones;
}

/**
 * A component that can be used to display a group of filters that will be put into an overflow filter when they no longer fit on the first line of their container
 * @slot - d2l-filters to be added to the container
*/
class OverflowGroupFilter extends OverflowGroupMixin(LitElement) {

	static get styles() {
		return [super.styles, css`
			::slotted(d2l-filter) {
				margin-right: 0.5rem;
			}
		`];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('d2l-filter-change', this._handleFilterChange);
	}

	convertToOverflowItem(node) {
		const tagName = node.tagName.toLowerCase();
		if (tagName === 'd2l-filter') return createFilterItem(node);
	}

	getOverflowMenu() {
		if (this.overflowMenuHidden) return;
		const overflowItems = this.dropdownItems ? this.dropdownItems.slice(this.chompIndex) : [];

		return html`
			<d2l-filter class="${OVERFLOW_DROPDOWN_CLASS}" @d2l-filter-change="${this._handleFilterChange}">
				${overflowItems}
			</d2l-filter>
		`;
	}

	_handleFilterChange(e) {
		const target = (e.target.classList && e.target.classList.contains(OVERFLOW_DROPDOWN_CLASS)) ? this : e.target;
		e.detail.dimensions.forEach((dimension) => {
			const filterSet = target.querySelector(`d2l-filter-dimension-set[key=${dimension.dimensionKey}`);
			if (!filterSet) return;
			dimension.changes.forEach((change) => {
				const filterSetValue = filterSet.querySelector(`d2l-filter-dimension-set-value[key=${change.valueKey}]`);
				if (!filterSetValue) return;
				filterSetValue.selected = change.selected;
			});
		});
	}

}

customElements.define('d2l-overflow-group-filter', OverflowGroupFilter);
