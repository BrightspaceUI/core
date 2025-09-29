import './filter.js';
import './filter-tags.js';
import { css, html, LitElement } from 'lit';
import { OVERFLOW_CLASS, OverflowGroupMixin } from '../overflow-group/overflow-group-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';

function createFilterItem(node) {
	const dimensionSets = node.querySelectorAll('d2l-filter-dimension-set');
	const clones = Array.from(dimensionSets).map((set) => set.cloneNode(true));
	return clones;
}

const updateEvents = ['d2l-filter-change', 'd2l-filter-dimension-load-more', 'd2l-filter-dimension-search', 'd2l-filter-dimension-first-open'];

/**
 * A component that can be used to display a group of filters that will be put into an overflow filter when they no longer fit on the first line of their container
 * @slot - d2l-filters to be added to the container
*/
class FilterOverflowGroup extends OverflowGroupMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Show `d2l-filter-tags` beneath the filters. Tags will be shown for all filters in the group.
			 * @type {boolean}
			 */
			tags: { type: Boolean },
			_filterIds: { state: true }
		};
	}

	static get styles() {
		return [super.styles, css`
			::slotted(d2l-filter) {
				margin-inline-end: 0.3rem;
			}
		`];
	}

	constructor() {
		super();

		this._filterIds = '';
		this._updateFilterData = this._handleSlotChange.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		for (const event of updateEvents)
			this.addEventListener(event, this._updateFilterData);

		if (!this.tags) return;

		this._filterTags = document.createElement('d2l-filter-tags');
		this._filterTags.setAttribute('slot', 'adjacent');
		this.appendChild(this._filterTags);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		for (const event of updateEvents)
			this.removeEventListener(event, this._updateFilterData);
	}

	updated(changedProperties) {
		super.updated(changedProperties);

		if (changedProperties.has('_filterIds') && this.tags) {
			this._filterTags.setAttribute('filter-ids', this._filterIds.trim());
		}
	}

	convertToOverflowItem(node) {
		const tagName = node.tagName.toLowerCase();
		if (tagName !== 'd2l-filter') {
			console.warn(`d2l-filter-overflow-group: ${tagName} is invalid in this group. This group should only contain d2l-filter direct child elements.`);
			return;
		}

		if (this.tags && !node.hasAttribute('data-filter-tags-subscribed')) {
			const filterId = node.id || getUniqueId();
			node.id = filterId;
			this._filterIds += ` ${filterId}`;
			node.setAttribute('data-filter-tags-subscribed', 'data-filter-tags-subscribed');
		}

		return createFilterItem(node);
	}

	getOverflowContainer(overflowItems) {
		const filters = this._slotItems.filter(node => node.tagName.toLowerCase() === 'd2l-filter');
		const openedDimensions = [];
		for (const filter of filters) openedDimensions.push(...filter._openedDimensions);
		/* eslint-disable lit/no-private-properties */
		return html`
			<d2l-filter
				class="${OVERFLOW_CLASS} vdiff-target"
				._openedDimensions=${openedDimensions}
				@d2l-filter-change="${this.#handleFilterChange}"
				@d2l-filter-dimension-load-more="${this.#handleFilterLoadMore}"
				@d2l-filter-dimension-search="${this.#handleFilterSearch}"
				@d2l-filter-dimension-first-open="${this.#handleFirstOpen}">
				${overflowItems}
			</d2l-filter>
		`;
		/* eslint-enable */
	}

	#getFilterDimensionSet(key, target = this) {
		const dimension = target.querySelector(`d2l-filter-dimension-set[key=${key}]`);
		if (dimension?.parentNode?.tagName !== 'D2L-FILTER') return null;
		return dimension;
	}

	#handleFilterChange(e) {
		e.detail.dimensions.forEach((dimension) => {
			const filterSet = this.#getFilterDimensionSet(dimension.dimensionKey);
			if (!filterSet) return;
			dimension.changes.forEach((change) => {
				const filterSetValue = filterSet.querySelector(`d2l-filter-dimension-set-value[key=${change.valueKey}]`);
				if (!filterSetValue) return;
				filterSetValue.selected = change.selected;
			});
			filterSet.parentNode.requestFilterChangeEvent(e.detail.allCleared, [dimension]);
		});
	}

	#handleFilterLoadMore(e) {
		const filter = this.#getFilterDimensionSet(e.detail.key)?.parentNode;
		if (!filter) return;
		filter.requestFilterLoadMoreEvent(e.detail.key, e.detail.value, e.detail.loadMoreCompleteCallback);
		this._handleSlotChange();
	}

	#handleFilterSearch(e) {
		const filter = this.#getFilterDimensionSet(e.detail.key)?.parentNode;
		if (!filter) return;
		filter.requestFilterSearchEvent(e.detail.key, e.detail.value, e.detail.searchCompleteCallback);
		this._handleSlotChange();
	}

	#handleFirstOpen(e) {
		const filter = this.#getFilterDimensionSet(e.detail.key)?.parentNode;
		if (!filter) return;
		filter._openedDimensions.push(e.detail.key);
	}

}

customElements.define('d2l-filter-overflow-group', FilterOverflowGroup);
