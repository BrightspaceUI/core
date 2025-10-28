import './filter.js';
import './filter-tags.js';
import { css, html, LitElement } from 'lit';
import { OVERFLOW_CLASS, OverflowGroupMixin } from '../overflow-group/overflow-group-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';

const updateEvents = ['d2l-filter-dimension-load-more', 'd2l-filter-dimension-search'];

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
			_openedDimensions: { state: true },
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
		this._openedDimensions = [];
		this._updateFilterData = this._updateFilterData.bind(this);
		this._handleSlottedFilterChange = this._handleSlottedFilterChange.bind(this);
		this._handleSlottedDimensionFirstOpen = this._handleSlottedDimensionFirstOpen.bind(this);
	}

	connectedCallback() {
		super.connectedCallback();
		for (const event of updateEvents)
			this.addEventListener(event, this._updateFilterData);
		this.addEventListener('d2l-filter-change', this._handleSlottedFilterChange);
		this.addEventListener('d2l-filter-dimension-first-open', this._handleSlottedDimensionFirstOpen);

		if (!this.tags) return;

		this._filterTags = document.createElement('d2l-filter-tags');
		this._filterTags.setAttribute('slot', 'adjacent');
		this.appendChild(this._filterTags);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		for (const event of updateEvents)
			this.removeEventListener(event, this._updateFilterData);
		this.removeEventListener('d2l-filter-change', this._handleSlottedFilterChange);
		this.removeEventListener('d2l-filter-dimension-first-open', this._handleSlottedDimensionFirstOpen);
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

		return node._dimensions;
	}

	getOverflowContainer(overflowItems) {
		const newDimensions = overflowItems.reduce((p, n) => p.concat(n), []).map(dim => {
			return { ...dim, values: dim.values.map(v => ({ ...v })) };
		});

		/* eslint-disable lit/no-private-properties */
		return html`
			<d2l-filter
				class="${OVERFLOW_CLASS} vdiff-target"
				._openedDimensions=${this._openedDimensions}
				._dimensions=${newDimensions}
				@d2l-filter-change="${this.#handleFilterChange}"
				@d2l-filter-dimension-load-more="${this.#handleFilterLoadMore}"
				@d2l-filter-dimension-search="${this.#handleFilterSearch}"
				@d2l-filter-dimension-first-open="${this.#handleFirstOpen}">
			</d2l-filter>
		`;
		/* eslint-enable */
	}

	_handleSlottedDimensionFirstOpen(e) {
		this._openedDimensions.push(e.detail.key);
		this.requestUpdate();
	}

	_handleSlottedFilterChange(e) {
		e.detail.dimensions.forEach((dimension) => {
			dimension.changes.forEach((change) => {
				const filterSetValue = this.querySelector(`d2l-filter-dimension-set[key=${dimension.dimensionKey}] > d2l-filter-dimension-set-value[key="${change.valueKey}"]`);
				if (!filterSetValue) return;
				filterSetValue.selected = change.selected;
			});
		});
	}

	async _updateFilterData() {
		await Promise.all([...this.querySelectorAll('d2l-filter')].map(f => f.updateComplete));
		this.requestUpdate();
	}

	#handleFilterChange(e) {
		e.detail.dimensions.forEach((dimension) => {
			this.#runOnFilterDimension(dimension.dimensionKey, filter => {
				filter.requestFilterChangeEvent(e.detail.allCleared, [dimension]);
			});
		});
	}

	#handleFilterLoadMore(e) {
		this.#runOnFilterDimension(e.detail.key, filter => {
			filter.requestFilterLoadMoreEvent(e.detail.key, e.detail.value, e.detail.loadMoreCompleteCallback);
		});
	}

	#handleFilterSearch(e) {
		this.#runOnFilterDimension(e.detail.key, filter => {
			filter.requestFilterSearchEvent(e.detail.key, e.detail.value, e.detail.searchCompleteCallback);
		});
	}

	#handleFirstOpen(e) {
		this.#runOnFilterDimension(e.detail.key, filter => {
			filter.requestFilterDimensionFirstOpenEvent(e.detail.key);
		});
	}

	#runOnFilterDimension(key, callback) {
		const dimension = this.querySelector(`d2l-filter-dimension-set[key=${key}]`);
		const filter = dimension?.parentNode;
		if (filter?.tagName !== 'D2L-FILTER') return;
		callback(filter);
	}

}

customElements.define('d2l-filter-overflow-group', FilterOverflowGroup);
