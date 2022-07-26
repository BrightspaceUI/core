import '../colors/colors.js';
import '../tag-list/tag-list.js';
import '../tag-list/tag-list-item.js';
import { css, html, LitElement } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { IdSubscriberController } from '../../controllers/subscriber/subscriberControllers.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A tag-list allowing the user to see (and remove) the currently applied filters.
 */

const CLEAR_TIMEOUT = 210; /** Corresponds to timeout in _dispatchChangeEvent in filter + 10 ms */

class FilterTags extends RtlMixin(LocalizeCoreElement(LitElement)) {
	static get properties() {
		return {
			/**
			 * REQUIRED: Id(s) (space-delimited) of the filter component(s) to subscribe to
			 * @type {string}
			 */
			filterIds: { type: String, attribute: 'filter-ids' },
			/**
			 * The text displayed in this component's label
			 * @default "Active Filters:"
			 * @type {string}
			 */
			label: { type: String }
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}

			.d2l-filter-tags-wrapper {
				display: flex;
			}
			d2l-tag-list {
				flex: 1;
			}

			.d2l-filter-tags-label {
				display: inline-block;
				font-weight: bold;
				margin-right: 0.25rem;
				padding-top: 0.15rem;
			}
			:host([dir="rtl"]) .d2l-filter-tags-label {
				margin-left: 0.25rem;
				margin-right: 0;
			}

			.d2l-filter-tags-none-label {
				color: var(--d2l-color-corundum);
				display: inline-block;
				font-style: italic;
				padding-top: 0.15rem;
			}
		`];
	}

	constructor() {
		super();
		this.label = '';

		this._allActiveFilters = new Map();
		this._filters = new IdSubscriberController(this,
			{ onUnsubscribe: this._removeLostFilter.bind(this) },
			{ idPropertyName: 'filterIds' }
		);
	}

	render() {
		let numActiveFilters = 0;
		const allActiveFilters = Array.from(this._allActiveFilters);
		const tagListItems = allActiveFilters.map(filter => filter[1].map((value, index) => {
			numActiveFilters++;
			return html`
				<d2l-tag-list-item
					@d2l-tag-list-item-clear="${this._tagListItemDeleted}"
					data-filter-id="${filter[0]}"
					data-index="${index}"
					text="${value.text}">
				</d2l-tag-list-item>
			`;
		}));
		let filters = html``;
		if (numActiveFilters === 0) filters = html`<span class="d2l-filter-tags-none-label d2l-body-compact">${this.localize('components.filter.noActiveFilters')}</span>`;
		else {
			filters = html`
				<d2l-tag-list
					clearable
					clear-focus-timeout="${CLEAR_TIMEOUT}"
					@d2l-tag-list-clear="${this._clearFiltersClicked}"
					description="${this.label || this.localize('components.filter.activeFilters')}">
					${tagListItems}
				</d2l-tag-list>
			`;
		}

		return html`
			<div class="d2l-filter-tags-wrapper">
				${this.label ? html`<span class="d2l-filter-tags-label d2l-body-compact">${this.label}</span>` : null}
				${filters}
			</div>
		`;
	}

	updateActiveFilters(filterId, activeFilters) {
		this._allActiveFilters.set(filterId, activeFilters);
		this.requestUpdate();
	}

	_clearFiltersClicked() {
		this._filters.registries.forEach((filter, index) => {
			if (index === 0) filter.focus();
			filter.requestFilterClearAll();
		});
	}

	_removeLostFilter(filterId) {
		this._allActiveFilters.delete(filterId);
		this.requestUpdate();
	}

	_tagListItemDeleted(e) {
		const filterId = e.target.getAttribute('data-filter-id');
		const filterValueIndex = e.target.getAttribute('data-index');
		const filterValue = this._allActiveFilters.get(filterId)[filterValueIndex];
		const filter = this._filters.registries.find(filter => filter.id === filterId);
		filter.requestFilterValueClear(filterValue.keyObject);
	}

}

customElements.define('d2l-filter-tags', FilterTags);
