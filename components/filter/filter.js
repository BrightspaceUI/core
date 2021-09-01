import '../colors/colors.js';
import '../button/button-icon.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-content.js';
import '../dropdown/dropdown-menu.js';
import '../hierarchical-view/hierarchical-view.js';
import '../inputs/input-search.js';
import '../list/list.js';
import '../list/list-item.js';
import '../loading-spinner/loading-spinner.js';
import '../menu/menu.js';
import '../menu/menu-item.js';
import '../selection/selection-select-all.js';
import '../selection/selection-summary.js';

import { bodyCompactStyles, bodySmallStyles, bodyStandardStyles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const SET_DIMENSION_ID_PREFIX = 'list-';

/**
 * A filter component that contains one or more dimensions a user can filter by.
 * This component is in charge of all rendering.
 * @slot - Dimension components used by the filter to construct the different dimensions locally
 * @fires d2l-filter-change - Dispatched when a dimension's value(s) have changed
 * @fires d2l-filter-dimension-first-open - Dispatched when a dimension is opened for the first time
 * @fires d2l-filter-dimension-search - Dispatched when a dimension that supports searching and has the "manual" search-type is searched
 */
class Filter extends LocalizeCoreElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Disables the dropdown opener for the filter
			 */
			disabled: { type: Boolean, reflect: true },
			_activeDimensionKey: { type: String, attribute: false },
			_dimensions: { type: Array, attribute: false },
			_totalAppliedCount: { type: Number, attribute: false }
		};
	}

	static get styles() {
		return [bodyCompactStyles, bodySmallStyles, bodyStandardStyles, offscreenStyles, css`
			div[slot="header"] {
				padding: 0.9rem 0.3rem;
			}

			.d2l-filter-dimension-header {
				padding-bottom: 0.9rem;
			}

			.d2l-filter-dimension-header,
			.d2l-filter-dimension-header-actions {
				align-items: center;
				display: flex;
			}

			.d2l-filter-dimension-header-actions {
				flex-flow: row wrap;
			}

			d2l-input-search {
				flex: 1 0;
				margin-left: 0.3rem;
				margin-right: 0.6rem;
			}

			:host([dir="rtl"]) d2l-input-search {
				margin-left: 0.6rem;
				margin-right: 0.3rem;
			}

			.d2l-filter-dimension-select-all {
				flex-basis: 100%;
				margin-top: 0.9rem;
			}

			d2l-selection-select-all {
				padding: 0 0.6rem;
			}

			.d2l-filter-dimension-header-text {
				flex-grow: 1;
				padding-right: calc(2rem + 2px);
				text-align: center;
			}
			:host([dir="rtl"]) .d2l-filter-dimension-header-text {
				padding-left: calc(2rem + 2px);
				padding-right: 0;
			}

			.d2l-filter-dimension-header-text,
			.d2l-filter-dimension-set-value-text {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.d2l-filter-dimension-set-value-text {
				color: var(--d2l-color-ferrite);
				line-height: unset;
			}

			.d2l-filter-dimension-info-message {
				padding: 0.9rem 0;
				text-align: center;
			}

			/* Needed to "undo" the menu-item style for multiple dimensions */
			d2l-hierarchical-view {
				cursor: auto;
			}

			d2l-loading-spinner {
				padding-top: 0.6rem;
				width: 100%;
			}
		`];
	}

	constructor() {
		super();
		this.disabled = false;
		this._changeEventsToDispatch = new Map();
		this._dimensions = [];
		this._openedDimensions = [];
		this._totalAppliedCount = 0;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('d2l-filter-dimension-data-change', this._handleDimensionDataChange);

		// Prevent these events from bubbling out of the filter
		this.addEventListener('d2l-hierarchical-view-hide-complete', this._stopPropagation);
		this.addEventListener('d2l-hierarchical-view-hide-start', this._stopPropagation);
		this.addEventListener('d2l-hierarchical-view-show-complete', this._stopPropagation);
		this.addEventListener('d2l-hierarchical-view-show-start', this._stopPropagation);
		this.addEventListener('d2l-hierarchical-view-resize', this._stopPropagation);
	}

	render() {
		const singleDimension = this._dimensions.length === 1;
		const header = this._buildHeader(singleDimension);
		const dimensions = this._buildDimensions(singleDimension);

		const filterCount = this._formatFilterCount(this._totalAppliedCount);
		let buttonText = singleDimension ? this._dimensions[0].text : this.localize('components.filter.filters');
		if (filterCount) buttonText = `${buttonText} (${filterCount})`;

		let description = singleDimension ? this.localize('components.filter.singleDimensionDescription', { filterName: this._dimensions[0].text }) : this.localize('components.filter.filters');
		description += `. ${this.localize('components.filter.filterCountDescription', { number: this._totalAppliedCount })}`;

		const dropdownContent = singleDimension ? html`
				<d2l-dropdown-content min-width="285" max-width="420" mobile-tray="right" mobile-breakpoint="768" no-padding-header no-padding>
					${header}
					${dimensions}
				</d2l-dropdown-content>`
			: html`
				<d2l-dropdown-menu min-width="285" max-width="420" mobile-tray="right" mobile-breakpoint="768" no-padding-header>
					${header}
					<d2l-menu label="${this.localize('components.filter.filters')}">
						${dimensions}
					</d2l-menu>
				</d2l-dropdown-menu>
			`;

		return html`
			<d2l-dropdown-button-subtle
				@d2l-dropdown-close="${this._handleDropdownClose}"
				@d2l-dropdown-open="${this._handleDropdownOpen}"
				@d2l-dropdown-position="${this._stopPropagation}"
				text="${buttonText}"
				description="${description}"
				?disabled="${this.disabled}">
				${dropdownContent}
			</d2l-dropdown-button-subtle>
			<slot @slotchange="${this._handleSlotChange}"></slot>
		`;
	}

	_buildDimension(dimension, singleDimension) {
		let dimensionHTML;
		switch (dimension.type) {
			case 'd2l-filter-dimension-set':
				dimensionHTML = html`<div aria-live="polite">${this._createSetDimension(dimension)}</div>`;
				break;
		}

		if (singleDimension) {
			return dimensionHTML;
		}
		return html`
			<d2l-hierarchical-view
				@d2l-hierarchical-view-show-complete="${this._handleDimensionShowComplete}"
				@d2l-hierarchical-view-show-start="${this._handleDimensionShowStart}"
				data-key="${dimension.key}">
				${dimensionHTML}
			</d2l-hierarchical-view>
		`;
	}

	_buildDimensions(singleDimension) {
		if (singleDimension) {
			return this._buildDimension(this._dimensions[0], true);
		}
		return this._dimensions.map((dimension) => {
			const builtDimension = this._buildDimension(dimension);
			const dimensionDescription = `${dimension.text}. ${this.localize('components.filter.filterCountDescription', { number: dimension.appliedCount })}`;
			return html`<d2l-menu-item text="${dimension.text}" description="${dimensionDescription}">
				${builtDimension}
				<div slot="supporting">
					<span>${this._formatFilterCount(dimension.appliedCount)}</span>
				</div>
			</d2l-menu-item>`;
		});
	}

	_buildHeader(singleDimension) {
		if (!this._activeDimensionKey && !singleDimension) return null;

		const dimension = singleDimension ? this._dimensions[0] : this._dimensions.find(dimension => dimension.key === this._activeDimensionKey);

		const search = dimension.searchType === 'none' ? null : html`
			<d2l-input-search
				@d2l-input-search-searched="${this._handleSearch}"
				?disabled="${this._isDimensionEmpty(dimension)}"
				label="${this.localize('components.input-search.search')}"
				value="${ifDefined(dimension.searchValue)}">
			</d2l-input-search>
		`;

		const selectAll = !dimension.selectAllIdPrefix || dimension.searchValue ? null : html`
			<div class="d2l-filter-dimension-select-all">
				<d2l-selection-select-all
					selection-for="${dimension.selectAllIdPrefix}${dimension.key}"
					?disabled="${dimension.loading || this._isDimensionEmpty(dimension)}">
				</d2l-selection-select-all>
				<d2l-selection-summary
					selection-for="${dimension.selectAllIdPrefix}${dimension.key}"
					no-selection-text="${this.localize('components.selection.select-all')}">
				</d2l-selection-summary>
			</div>
		`;

		const actions = html`
			<div class="d2l-filter-dimension-header-actions">
				${search}
				${selectAll}
			</div>
		`;

		const header = singleDimension ? null : html`
			<div class="d2l-filter-dimension-header">
				<d2l-button-icon
					@click="${this._handleDimensionHide}"
					icon="tier1:chevron-left"
					text="${this.localize('components.menu-item-return.returnCurrentlyShowing', 'menuTitle', dimension.text)}">
				</d2l-button-icon>
				<div class="d2l-filter-dimension-header-text d2l-body-standard">${dimension.text}</div>
			</div>
		`;

		return html`
			<div slot="header">
				${header}
				${actions}
			</div>
		`;
	}

	_createSetDimension(dimension) {
		if (dimension.loading) {
			return html`
				<d2l-loading-spinner></d2l-loading-spinner>
				<p class="d2l-offscreen" aria-busy="true" role="alert">${this.localize('components.filter.loading')}</p>
			`;
		}

		if (this._isDimensionEmpty(dimension)) {
			return html`
				<p class="d2l-filter-dimension-info-message d2l-body-small" role="alert">
					${this.localize('components.filter.noFilters')}
				</p>
			`;
		}

		let searchResults = null;
		if (dimension.searchValue && dimension.searchValue !== '') {
			const count = dimension.values.reduce((total, value) => { return !value.hidden ? total + 1 : total; }, 0);
			const classes = {
				'd2l-filter-dimension-info-message': true,
				'd2l-body-small': true,
				'd2l-offscreen': count !== 0
			};

			searchResults = html`
				<p class="${classMap(classes)}" role="alert">
					${this.localize('components.filter.searchResults', { number: count })}
				</p>
			`;

			if (count === 0) return searchResults;
		}

		return html`
			${searchResults}
			<d2l-list
				id="${SET_DIMENSION_ID_PREFIX}${dimension.key}"
				@d2l-list-selection-change="${this._handleChangeSetDimension}"
				extend-separators
				?selection-single="${dimension.selectionSingle}">
				${dimension.values.map(item => html`
					<d2l-list-item
						?hidden="${item.hidden}"
						key="${item.key}"
						label="${item.text}"
						selectable
						?selected="${item.selected}"
						slim>
						<div class="d2l-filter-dimension-set-value-text d2l-body-compact">${item.text}</div>
					</d2l-list-item>
				`)}
			</d2l-list>
		`;
	}

	_dispatchChangeEvent(eventKey, eventDetail) {
		this._changeEventsToDispatch.set(eventKey, eventDetail);

		if (!this._changeEventTimeout) {
			this._changeEventTimeout = setTimeout(() => {
				this.dispatchEvent(new CustomEvent('d2l-filter-change', {
					bubbles: true,
					composed: false,
					detail: { changes: Array.from(this._changeEventsToDispatch.values()) }
				}));
				this._changeEventsToDispatch = new Map();
				this._changeEventTimeout = null;
			}, 200);
		}
	}

	_dispatchDimensionFirstOpenEvent(key) {
		if (!this._openedDimensions.includes(key)) {
			this.dispatchEvent(new CustomEvent('d2l-filter-dimension-first-open', { bubbles: true, composed: false, detail: { key: key } }));
			this._openedDimensions.push(key);
		}
	}

	_formatFilterCount(count) {
		if (count === 0) return;
		else if (count >= 100) return '99+';
		else return `${count}`;
	}

	_getSlottedNodes(slot) {
		const dimensionTypes = ['d2l-filter-dimension-set'];
		const nodes = slot.assignedNodes({ flatten: true });
		return nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE && dimensionTypes.includes(node.tagName.toLowerCase()));
	}

	_handleChangeSetDimension(e) {
		const dimensionKey = e.target.id.slice(SET_DIMENSION_ID_PREFIX.length);
		const dimension = this._dimensions.find(dimension => dimension.key === dimensionKey);
		const valueKey = e.detail.key;
		const value = dimension.values.find(value => value.key === valueKey);
		const selected = e.detail.selected;

		value.selected = selected;

		if (selected) {
			dimension.appliedCount++;
			this._totalAppliedCount++;
		} else {
			dimension.appliedCount--;
			this._totalAppliedCount--;
		}

		this._dispatchChangeEvent(`${dimensionKey}-${valueKey}`, { dimension: dimensionKey, value: { key: valueKey, selected: selected } });
	}

	_handleDimensionDataChange(e) {
		const changes = e.detail.changes;
		const dimension = this._dimensions.find(dimension => dimension.key === e.detail.dimensionKey);
		const value = e.detail.valueKey && dimension.values.find(value => value.key === e.detail.valueKey);
		const toUpdate = value ? value : dimension;

		if (!toUpdate) return;

		let shouldUpdate = false;
		let shouldRecount = false;
		changes.forEach((newValue, prop) => {
			if (toUpdate[prop] === newValue) return;

			toUpdate[prop] = newValue;
			shouldUpdate = true;

			if (prop === 'selected') {
				if (newValue) {
					dimension.appliedCount++;
					this._totalAppliedCount++;
				} else {
					dimension.appliedCount--;
					this._totalAppliedCount--;
				}
			} else if (prop === 'values') {
				if (dimension.searchType !== 'manual' || !dimension.searchValue) shouldRecount = true;
			}
		});

		if (shouldRecount) this._setFilterCounts(dimension);
		if (shouldUpdate) this.requestUpdate();
	}

	_handleDimensionHide() {
		this.shadowRoot.querySelector(`d2l-hierarchical-view[data-key="${this._activeDimensionKey}"]`).hide();
		this._activeDimensionKey = null;
	}

	_handleDimensionShowComplete() {
		const returnButton = this.shadowRoot.querySelector('d2l-button-icon[icon="tier1:chevron-left"]');
		returnButton.focus();
	}

	_handleDimensionShowStart(e) {
		this._activeDimensionKey = e.detail.sourceView.getAttribute('data-key');
		this._dispatchDimensionFirstOpenEvent(this._activeDimensionKey);
	}

	_handleDropdownClose(e) {
		this._activeDimensionKey = null;
		this._stopPropagation(e);
	}

	_handleDropdownOpen(e) {
		if (this._dimensions.length === 1) {
			this._dispatchDimensionFirstOpenEvent(this._dimensions[0].key);
		}
		this._stopPropagation(e);
	}

	_handleSearch(e) {
		const dimension = !this._activeDimensionKey ? this._dimensions[0] : this._dimensions.find(dimension => dimension.key === this._activeDimensionKey);
		const searchValue = e.detail.value.trim();
		dimension.searchValue = searchValue;

		if (dimension.searchType === 'automatic') {
			this._searchDimension(dimension);
		} else if (dimension.searchType === 'manual') {
			dimension.loading = true;
			this.requestUpdate();

			this.dispatchEvent(new CustomEvent('d2l-filter-dimension-search', {
				bubbles: false,
				composed: false,
				detail: {
					key: dimension.key,
					value: searchValue,
					searchCompleteCallback: function() {
						requestAnimationFrame(() => {
							dimension.loading = false;
							this.requestUpdate();
						});
					}.bind(this)
				}
			}));
		}
	}

	_handleSlotChange(e) {
		const dimensionNodes = this._getSlottedNodes(e.target);

		this._dimensions = dimensionNodes.map(dimension => {
			const type = dimension.tagName.toLowerCase();
			const info = {
				key: dimension.key,
				loading: dimension.loading,
				text: dimension.text,
				type: type
			};

			switch (type) {
				case 'd2l-filter-dimension-set': {
					info.searchType = dimension.searchType;
					info.selectionSingle = dimension.selectionSingle;
					if (dimension.selectAll && !dimension.selectionSingle) info.selectAllIdPrefix = SET_DIMENSION_ID_PREFIX;
					const values = dimension._getValues();
					info.values = values;
					break;
				}
			}

			return info;
		});

		this._setFilterCounts();
	}

	_isDimensionEmpty(dimension) {
		switch (dimension.type) {
			case 'd2l-filter-dimension-set':
				return dimension.values.length === 0 && !dimension.searchValue;
		}

		return false;
	}

	_searchDimension(dimension) {
		switch (dimension.type) {
			case 'd2l-filter-dimension-set':
				dimension.values.forEach(value => {
					value.hidden = !(value.text.toLowerCase().indexOf(dimension.searchValue.toLowerCase()) > -1);
				});
				break;
		}

		this.requestUpdate();
	}

	_setFilterCounts(dimensionToRecount) {
		this._totalAppliedCount = 0;

		this._dimensions.forEach(dimension => {
			if (!dimensionToRecount || dimensionToRecount.key === dimension.key) {
				switch (dimension.type) {
					case 'd2l-filter-dimension-set': {
						dimension.appliedCount = dimension.values.reduce((total, value) => { return value.selected ? total + 1 : total; }, 0);
						break;
					}
				}
			}

			this._totalAppliedCount += dimension.appliedCount;
		});
	}

	_stopPropagation(e) {
		e.stopPropagation();
	}

}

customElements.define('d2l-filter', Filter);
