import './filter.js';
import './filter-tags.js';
import { css, html, LitElement } from 'lit';
import { OVERFLOW_CLASS, OverflowGroupMixin } from '../overflow-group/overflow-group-mixin.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';

function createFilterItem(node) {
	const dimensionSets = node.querySelectorAll('d2l-filter-dimension-set');
	const clones = Array.from(dimensionSets).map((set) => set.cloneNode(true));
	return clones;
}

/**
 * A component that can be used to display a group of filters that will be put into an overflow filter when they no longer fit on the first line of their container
 * @slot - d2l-filters to be added to the container
*/
class FilterOverflowGroup extends OverflowGroupMixin(RtlMixin(LitElement)) {

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
				margin-right: 0.3rem;
			}
			:host([dir="rtl"]) ::slotted(d2l-filter) {
				margin-left: 0.3rem;
				margin-right: 0;
			}
		`];
	}

	constructor() {
		super();

		this._filterIds = '';
	}

	connectedCallback() {
		super.connectedCallback();

		if (!this.tags) return;

		this._filterTags = document.createElement('d2l-filter-tags');
		this._filterTags.setAttribute('slot', 'adjacent');
		this.appendChild(this._filterTags);
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('d2l-filter-change', this._handleFilterChange);
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
		return html`
			<d2l-filter class="${OVERFLOW_CLASS} vdiff-target" @d2l-filter-change="${this._handleFilterChange}">
				${overflowItems}
			</d2l-filter>
		`;
	}

	_getFilterParent(classList, filterSet) {
		const isOverflowFilter = classList && classList.contains(OVERFLOW_CLASS);
		if (!isOverflowFilter) return null;
		const filterParent = filterSet.parentNode;
		return (!filterParent || filterParent.tagName !== 'D2L-FILTER') ? null : filterParent;
	}

	_handleFilterChange(e) {
		const target = (e.target.classList && e.target.classList.contains(OVERFLOW_CLASS)) ? this : e.target;
		e.detail.dimensions.forEach((dimension) => {
			const filterSet = target.querySelector(`d2l-filter-dimension-set[key=${dimension.dimensionKey}`);
			if (!filterSet) return;
			dimension.changes.forEach((change) => {
				const filterSetValue = filterSet.querySelector(`d2l-filter-dimension-set-value[key=${change.valueKey}]`);
				if (!filterSetValue) return;
				filterSetValue.selected = change.selected;
			});

			this._getFilterParent(e.target.classList, filterSet)?.requestFilterChangeEvent(e.detail.allCleared, [dimension], { overflowEvent: true });
		});
	}

}

customElements.define('d2l-filter-overflow-group', FilterOverflowGroup);
