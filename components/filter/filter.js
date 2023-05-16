import '../colors/colors.js';
import '../count-badge/count-badge.js';
import '../button/button-icon.js';
import '../button/button-subtle.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-content.js';
import '../dropdown/dropdown-menu.js';
import '../empty-state/empty-state-action-button.js';
import '../empty-state/empty-state-action-link.js';
import '../empty-state/empty-state-simple.js';
import '../hierarchical-view/hierarchical-view.js';
import '../inputs/input-search.js';
import '../list/list.js';
import '../list/list-item.js';
import '../loading-spinner/loading-spinner.js';
import '../menu/menu.js';
import '../menu/menu-item.js';
import '../selection/selection-select-all.js';
import '../selection/selection-summary.js';

import { bodyCompactStyles, bodySmallStyles, bodyStandardStyles, heading4Styles } from '../typography/styles.js';
import { css, html, LitElement, nothing } from 'lit';
import { announce } from '../../helpers/announce.js';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { formatNumber } from '@brightspace-ui/intl/lib/number.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SubscriberRegistryController } from '../../controllers/subscriber/subscriberControllers.js';

const ARROWLEFT_KEY_CODE = 37;
const ESCAPE_KEY_CODE = 27;
const SET_DIMENSION_ID_PREFIX = 'list-';

/**
 * A filter component that contains one or more dimensions a user can filter by.
 * This component is in charge of all rendering.
 * @slot - Dimension components used by the filter to construct the different dimensions locally
 * @fires d2l-filter-change - Dispatched when a dimension's value(s) have changed
 * @fires d2l-filter-dimension-empty-state-action - Dispatched when an empty state action button is clicked
 * @fires d2l-filter-dimension-first-open - Dispatched when a dimension is opened for the first time
 * @fires d2l-filter-dimension-search - Dispatched when a dimension that supports searching and has the "manual" search-type is searched
 */
class Filter extends FocusMixin(LocalizeCoreElement(RtlMixin(LitElement))) {

	static get properties() {
		return {
			/**
			 * Disables the dropdown opener for the filter
			 * @type {boolean}
			 */
			disabled: { type: Boolean, reflect: true },
			/**
			 * Indicates if the filter is open
			 * @type {boolean}
			 */
			opened: { type: Boolean, reflect: true },
			/**
			 * Optional override for the button text used for a multi-dimensional filter
			 * @type {string}
			 */
			text: { type: String },
			_activeDimensionKey: { type: String, attribute: false },
			_dimensions: { type: Array, attribute: false },
			_totalAppliedCount: { type: Number, attribute: false }
		};
	}

	static get styles() {
		return [bodyCompactStyles, bodySmallStyles, bodyStandardStyles, heading4Styles, offscreenStyles, css`
			[slot="header"] {
				padding: 0.9rem 0.3rem;
			}

			.d2l-filter-dimension-header {
				padding-bottom: 0.9rem;
			}

			.d2l-filter-dimension-header.with-intro {
				padding-bottom: 0.6rem;
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
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			:host([dir="rtl"]) .d2l-filter-dimension-header-text {
				padding-left: calc(2rem + 2px);
				padding-right: 0;
			}

			.d2l-filter-dimension-header-text,
			.d2l-filter-dimension-set-value-text {
				overflow: hidden;
			}

			.d2l-filter-dimension-set-value {
				color: var(--d2l-color-ferrite);
				display: flex;
				gap: 0.45rem;
				line-height: unset;
				overflow: hidden;
			}

			.d2l-filter-dimension-set-value-text {
				-webkit-box-orient: vertical;
				display: -webkit-box;
				hyphens: auto;
				-webkit-line-clamp: 2;
				word-break: break-word;
			}

			d2l-list-item[selection-disabled] .d2l-filter-dimension-set-value,
			d2l-list-item[selection-disabled] .d2l-body-small {
				color: var(--d2l-color-chromite);
			}

			.d2l-filter-dimension-intro-text {
				margin: 0;
				padding: 0.6rem 1.5rem 1.5rem;
				text-align: center;
			}

			.d2l-filter-dimension-intro-text.multi-dimension {
				padding: 0 1.5rem 1.5rem;
			}

			.d2l-empty-state-container {
				padding: 0.9rem;
			}

			.list-header-text {
				color: var(--d2l-color-ferrite);
				margin: 0;
				padding-bottom: 0.05rem;
				padding-top: 0.65rem;
			}

			.d2l-filter-dimension-info-message {
				color: var(--d2l-color-ferrite);
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
		this.opened = false;
		this._changeEventsToDispatch = new Map();
		this._dimensions = [];
		this._openedDimensions = [];
		this._totalAppliedCount = 0;

		this._activeFilters = null;
		this._activeFiltersSubscribers = new SubscriberRegistryController(this, 'active-filters', {
			onSubscribe: this._updateActiveFiltersSubscriber.bind(this),
			updateSubscribers: this._updateActiveFiltersSubscribers.bind(this)
		});
	}

	static get focusElementSelector() {
		return 'd2l-dropdown-button-subtle';
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
		let buttonText = singleDimension ? this._dimensions[0].text : (this.text || this.localize('components.filter.filters'));
		if (filterCount) buttonText = `${buttonText} (${filterCount})`;

		let description = singleDimension ? this.localize('components.filter.singleDimensionDescription', { filterName: this._dimensions[0].text }) : this.localize('components.filter.filters');
		description += `. ${this.localize('components.filter.filterCountDescription', { number: this._totalAppliedCount })}`;

		const dropdownContent = singleDimension ? html`
				<d2l-dropdown-content
					min-width="285"
					max-width="420"
					mobile-tray="right"
					mobile-breakpoint="768"
					no-padding-header
					no-padding
					?opened="${this.opened}"
					?trap-focus="${!this._isDimensionEmpty(this._dimensions[0])}">
					${header}
					${dimensions}
				</d2l-dropdown-content>`
			: html`
				<d2l-dropdown-menu
					min-width="285"
					max-width="420"
					mobile-tray="right"
					mobile-breakpoint="768"
					no-padding-header
					?opened="${this.opened}"
					trap-focus>
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

	requestFilterClearAll() {
		this._handleClearAll();
	}

	requestFilterValueClear(keyObject) {
		const dimension = this._dimensions.find(dimension => dimension.key === keyObject.dimension);

		switch (dimension.type) {
			case 'd2l-filter-dimension-set':
				this._performChangeSetDimension(dimension, keyObject.value, false);
				break;
		}
	}

	_buildDimension(dimension, singleDimension) {
		let dimensionHTML;
		switch (dimension.type) {
			case 'd2l-filter-dimension-set':
				dimensionHTML = html`
				<div class="d2l-filter-container">
					${this._createSetDimension(dimension)}
				</div>`;
				break;
		}

		if (singleDimension) {
			return dimensionHTML;
		}
		return html`
			<d2l-hierarchical-view
				@d2l-hierarchical-view-hide-start="${this._handleDimensionHideStart}"
				@d2l-hierarchical-view-show-complete="${this._handleDimensionShowComplete}"
				@d2l-hierarchical-view-show-start="${this._handleDimensionShowStart}"
				@keydown="${this._handleDimensionHideKeyDown}"
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
			const countBadgeId = `filters-applied-count-${dimension.key}`;
			const filtersAppliedText = `${this.localize('components.filter.filterCountDescription', { number: dimension.appliedCount })}`;
			return html`<d2l-menu-item text="${dimension.text}" description="${dimension.text}." aria-describedby="${countBadgeId}">
				<div slot="supporting">
					<d2l-count-badge id="${countBadgeId}" number="${dimension.appliedCount}" max-digits="2" text="${filtersAppliedText}" hide-zero></d2l-count-badge>
				</div>
				${builtDimension}
			</d2l-menu-item>`;
		});
	}

	_buildHeader(singleDimension) {
		if (!this._activeDimensionKey && !singleDimension) {
			return html`
				<d2l-button-subtle
					slot="header"
					@click="${this._handleClearAll}"
					?disabled="${this._totalAppliedCount === 0}"
					description="${this.text ? this.localize('components.filter.clearAllDescriptionOverride', { filterText: this.text }) : this.localize('components.filter.clearAllDescription')}"
					text="${this.localize('components.filter.clearAll')}">
				</d2l-button-subtle>
			`;
		}

		const dimension = this._getActiveDimension();

		const introductoryTextClasses = {
			'd2l-body-compact': true,
			'd2l-filter-dimension-intro-text': true,
			'multi-dimension': !singleDimension
		};
		const introductoryText = !dimension.introductoryText ? nothing : html`
			<p class="${classMap(introductoryTextClasses)}">${dimension.introductoryText}</p>`;

		const clear = html`
			<d2l-button-subtle
				@click="${this._handleClear}"
				?disabled="${dimension.loading || dimension.appliedCount === 0}"
				description="${this.localize('components.filter.clearDescription', { filterName: dimension.text })}"
				text="${this.localize('components.filter.clear')}">
			</d2l-button-subtle>
		`;

		const search = dimension.searchType === 'none' ? nothing : html`
			<d2l-input-search
				@d2l-input-search-searched="${this._handleSearch}"
				?disabled="${this._isDimensionEmpty(dimension)}"
				label="${this.localize('components.input-search.search')}"
				value="${ifDefined(dimension.searchValue)}">
			</d2l-input-search>
		`;

		const selectAll = !dimension.selectAllIdPrefix || dimension.searchValue || dimension.loading || this._isDimensionEmpty(dimension) ? null : html`
			<div class="d2l-filter-dimension-select-all">
				<d2l-selection-select-all
					selection-for="${dimension.selectAllIdPrefix}${dimension.key}">
				</d2l-selection-select-all>
				<d2l-selection-summary
					selection-for="${dimension.selectAllIdPrefix}${dimension.key}"
					no-selection-text="${this.localize('components.selection.select-all')}">
				</d2l-selection-summary>
			</div>
		`;

		const actions = html`
			<div class="d2l-filter-dimension-header-actions">
				${clear}
				${search}
				${selectAll}
			</div>
		`;

		const headerClasses = {
			'd2l-filter-dimension-header': true,
			'with-intro': dimension.introductoryText
		};
		const header = singleDimension ? nothing : html`
			<div class="${classMap(headerClasses)}">
				<d2l-button-icon
					@click="${this._handleDimensionHide}"
					icon="tier1:chevron-left"
					text="${this.localize('components.menu-item-return.returnCurrentlyShowing', 'menuTitle', dimension.text)}">
				</d2l-button-icon>
				<div class="d2l-filter-dimension-header-text d2l-body-standard">${dimension.text}</div>
			</div>
		`;

		return html`
			<div slot="header" @keydown="${this._handleDimensionHideKeyDown}">
				${header}
				${introductoryText}
				${actions}
			</div>
		`;
	}

	_createEmptyState(emptyState, dimensionKey) {
		let emptyStateAction = nothing;
		if (emptyState.actionText && emptyState.actionHref) {
			emptyStateAction = html`
				<d2l-empty-state-action-link
					href="${emptyState.actionHref}"
					text="${emptyState.actionText}">
				</d2l-empty-state-action-link>
			`;
		}
		else if (emptyState.actionText) {
			emptyStateAction = html`
				<d2l-empty-state-action-button
					@d2l-empty-state-action="${this._handleEmptyStateAction}"
					data-dimension-key="${dimensionKey}"
					data-type="${emptyState.type}"
					text="${emptyState.actionText}">
				</d2l-empty-state-action-button>
			`;
		}
		return html`
			<d2l-empty-state-simple
				class="d2l-filter-dimension-info-message"
				description="${emptyState.description}">
				${emptyStateAction}
			</d2l-empty-state-simple>
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
			const emptyState = dimension.setEmptyState
				? this._createEmptyState(dimension.setEmptyState, dimension.key)
				: html`
					<d2l-empty-state-simple
						class="d2l-filter-dimension-info-message"
						description="${this.localize('components.filter.noFilters')}">
					</d2l-empty-state-simple>
				`;
			return html`
				<div class="d2l-empty-state-container" role="alert">
					${emptyState}
				</div>
			`;
		}

		let searchResults = null;
		if (dimension.searchValue && dimension.searchValue !== '') {
			const count = dimension.values.reduce((total, value) => { return !value.hidden ? total + 1 : total; }, 0);
			const classes = {
				'd2l-empty-state-container': true,
				'd2l-offscreen': count !== 0
			};
			const emptyState = dimension.searchEmptyState && count === 0
				? this._createEmptyState(dimension.searchEmptyState, dimension.key)
				: html`
					<d2l-empty-state-simple
						class="d2l-filter-dimension-info-message"
						description="${this.localize('components.filter.searchResults', { number: count })}">
					</d2l-empty-state-simple>
				`;
			searchResults =  html`
				<div class="${classMap(classes)}" role="alert">
					${emptyState}
				</div>
			`;

			if (count === 0) return searchResults;
		}

		let listHeader = nothing;
		let offscreenHeader = nothing;
		if (dimension.headerText && dimension.searchValue === '') {
			listHeader = html`
				<d2l-list-item>
					<h4 class="d2l-heading-4 list-header-text" aria-hidden="true">${dimension.headerText}</h4>
				</d2l-list-item>
			`;
			offscreenHeader = html`
				<h4 class="d2l-offscreen">${dimension.headerText}</h4>
			`;
		}

		return html`
			${searchResults}
			${offscreenHeader}
			<d2l-list
				id="${SET_DIMENSION_ID_PREFIX}${dimension.key}"
				@d2l-list-selection-change="${this._handleChangeSetDimension}"
				extend-separators
				grid
				?selection-single="${dimension.selectionSingle}"
				separators="between">
				${listHeader}
				${dimension.values.map(item => html`
					<d2l-list-item
						?selection-disabled="${item.disabled}"
						?hidden="${item.hidden}"
						key="${item.key}"
						label="${item.text}"
						selectable
						?selected="${item.selected}">
						<div class="d2l-filter-dimension-set-value d2l-body-compact">
							<div class="d2l-filter-dimension-set-value-text">${item.text}</div>
							${item.count !== undefined ? html`<div class="d2l-body-small">(${formatNumber(item.count)})</div>` : nothing}
						</div>
					</d2l-list-item>
				`)}
			</d2l-list>
		`;
	}

	_dispatchChangeEvent(dimension, change) {
		this._setDimensionChangeEvent(dimension, change, false);

		if (!this._changeEventTimeout) {
			/** 200 ms timeout used in filter-tags CLEAR_TIMEOUT. If the timeout here changes, update that as well */
			this._changeEventTimeout = setTimeout(() => {
				this._dispatchChangeEventNow(false);
			}, 200);
		}
	}

	_dispatchChangeEventNow(allCleared) {
		const dimensions = Array.from(this._changeEventsToDispatch.values());
		dimensions.forEach(dimension => {
			dimension.changes = Array.from(dimension.changes.values());
		});

		this.dispatchEvent(new CustomEvent('d2l-filter-change', {
			bubbles: true,
			composed: false,
			detail: { allCleared: allCleared, dimensions: dimensions }
		}));
		this._changeEventsToDispatch = new Map();
		this._changeEventTimeout = null;

		this._activeFiltersSubscribers.updateSubscribers();
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

	_getActiveDimension() {
		return !this._activeDimensionKey ? this._dimensions[0] : this._dimensions.find(dimension => dimension.key === this._activeDimensionKey);
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
		const selected = e.detail.selected;

		this._performChangeSetDimension(dimension, valueKey, selected);
	}

	_handleClear() {
		const dimension = this._getActiveDimension();

		this._performDimensionClear(dimension);
		this._dispatchChangeEventNow(false);
		this.requestUpdate();

		announce(this.localize('components.filter.clearAnnounce', { filterName: dimension.text }));
	}

	_handleClearAll() {
		this._dimensions.forEach(dimension => {
			if (dimension.searchType !== 'none' && dimension.searchValue !== '') {
				dimension.searchValue = '';
				this._performDimensionSearch(dimension);
			}
			this._performDimensionClear(dimension);
		});

		this._dispatchChangeEventNow(true);
		this.requestUpdate();

		this.text ? announce(this.localize('components.filter.clearAllAnnounceOverride', { filterText: this.text })) : announce(this.localize('components.filter.clearAllAnnounce'));
	}

	_handleDimensionDataChange(e) {
		const changes = e.detail.changes;
		const dimension = this._dimensions.find(dimension => dimension.key === e.detail.dimensionKey);
		const value = e.detail.valueKey && dimension.values.find(value => value.key === e.detail.valueKey);
		const toUpdate = e.detail.valueKey ? value : dimension;

		if (!toUpdate) return;

		let shouldUpdate = false,
			shouldSearch = false,
			shouldRecount = false,
			shouldResizeDropdown = false;
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
				this._activeFiltersSubscribers.updateSubscribers();
			} else if (prop === 'values') {
				if (dimension.searchValue) shouldSearch = true;
				shouldRecount = true;
				shouldResizeDropdown = true;
				this._activeFiltersSubscribers.updateSubscribers();
			} else if (prop === 'loading') {
				shouldResizeDropdown = true;
			}
		});

		if (shouldSearch) this._performDimensionSearch(dimension);
		if (shouldRecount) this._setFilterCounts(dimension);
		if (shouldUpdate)  this.requestUpdate();
		if (shouldResizeDropdown) {
			this._requestDropdownResize();
		}
	}

	_handleDimensionHide() {
		if (this.shadowRoot) this.shadowRoot.querySelector(`d2l-hierarchical-view[data-key="${this._activeDimensionKey}"]`).hide();
	}

	_handleDimensionHideKeyDown(e) {
		if (this._activeDimensionKey && (e.keyCode === ARROWLEFT_KEY_CODE || e.keyCode === ESCAPE_KEY_CODE)) {
			e.stopPropagation();
			this._handleDimensionHide();
		}
	}

	_handleDimensionHideStart() {
		this._activeDimensionKey = null;
	}

	_handleDimensionShowComplete() {
		const returnButton = this.shadowRoot
			&& this.shadowRoot.querySelector('d2l-button-icon[icon="tier1:chevron-left"]');
		if (returnButton) returnButton.focus();
	}

	_handleDimensionShowStart(e) {
		this._activeDimensionKey = e.detail.sourceView.getAttribute('data-key');
		const dimension = this._dimensions.find(dimension => dimension.key === this._activeDimensionKey);
		if (dimension.introductoryText) announce(dimension.introductoryText);
		this._dispatchDimensionFirstOpenEvent(this._activeDimensionKey);
	}

	_handleDropdownClose(e) {
		this.opened = false;
		this._activeDimensionKey = null;
		this._stopPropagation(e);
	}

	_handleDropdownOpen(e) {
		this.opened = true;
		if (this._dimensions.length === 1) {
			this._dispatchDimensionFirstOpenEvent(this._dimensions[0].key);
			if (this._dimensions[0].introductoryText) announce(this._dimensions[0].introductoryText);
		}
		this._stopPropagation(e);
	}

	_handleEmptyStateAction(e) {
		this.dispatchEvent(new CustomEvent(
			'd2l-filter-dimension-empty-state-action', {
				detail: { key: e.target.getAttribute('data-dimension-key'), type: e.target.getAttribute('data-type') }
			}
		));
	}

	_handleSearch(e) {
		const dimension = this._getActiveDimension();
		const searchValue = e.detail.value.trim();
		dimension.searchValue = searchValue;

		if (dimension.searchType === 'automatic' || searchValue === '') {
			this._performDimensionSearch(dimension);
		} else if (dimension.searchType === 'manual') {
			dimension.loading = true;
			this.requestUpdate();

			this.dispatchEvent(new CustomEvent('d2l-filter-dimension-search', {
				bubbles: false,
				composed: false,
				detail: {
					key: dimension.key,
					value: searchValue,
					searchCompleteCallback: function(keysToDisplay) {
						requestAnimationFrame(() => {
							dimension.searchKeysToDisplay = keysToDisplay;
							this._performDimensionSearch(dimension);
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
					info.headerText = dimension.headerText;
					info.introductoryText = dimension.introductoryText;
					info.searchType = dimension.searchType;
					info.searchValue = '';
					info.selectionSingle = dimension.selectionSingle;
					if (dimension.selectAll && !dimension.selectionSingle) info.selectAllIdPrefix = SET_DIMENSION_ID_PREFIX;
					info.searchEmptyState = dimension.getSearchEmptyState();
					info.setEmptyState = dimension.getSetEmptyState();
					info.valueOnlyActiveFilterText = dimension.valueOnlyActiveFilterText;
					const values = dimension.getValues();
					info.values = values;
					break;
				}
			}

			return info;
		});

		this._setFilterCounts();
		this._activeFiltersSubscribers.updateSubscribers();
	}

	_isDimensionEmpty(dimension) {
		switch (dimension.type) {
			case 'd2l-filter-dimension-set':
				return dimension.values.length === 0;
		}

		return false;
	}

	_performChangeSetDimension(dimension, valueKey, selected) {
		const value = dimension.values.find(value => value.key === valueKey);
		if (value.selected === selected) return;
		value.selected = selected;

		if (selected) {
			dimension.appliedCount++;
			this._totalAppliedCount++;
		} else {
			dimension.appliedCount--;
			this._totalAppliedCount--;
		}

		this._dispatchChangeEvent(dimension, { valueKey: valueKey, selected: selected });
	}

	_performDimensionClear(dimension) {
		this._totalAppliedCount = this._totalAppliedCount - dimension.appliedCount;
		dimension.appliedCount = 0;

		switch (dimension.type) {
			case 'd2l-filter-dimension-set': {
				dimension.values.forEach(value => {
					if (value.selected) {
						value.selected = false;
						this._setDimensionChangeEvent(dimension, { valueKey: value.key, selected: false }, true);
					}
				});
				break;
			}
		}
	}

	_performDimensionSearch(dimension) {
		switch (dimension.type) {
			case 'd2l-filter-dimension-set':
				dimension.values.forEach(value => {
					if (dimension.searchValue === '') {
						value.hidden = false;
						return;
					}

					value.hidden = dimension.searchKeysToDisplay ?
						!dimension.searchKeysToDisplay.includes(value.key) :
						!(value.text.toLowerCase().indexOf(dimension.searchValue.toLowerCase()) > -1);
				});
				break;
		}

		this._requestDropdownResize();
		this.requestUpdate();
	}

	_requestDropdownResize() {
		const singleDimension = this._dimensions.length === 1;
		if (singleDimension && this.opened) {
			const dropdown = this.shadowRoot.querySelector('d2l-dropdown-content');
			dropdown.requestRepositionNextResize(this.shadowRoot.querySelector('.d2l-filter-container'));
		}
	}

	_setDimensionChangeEvent(dimension, change, dimensionCleared) {
		if (!this._changeEventsToDispatch.has(dimension.key)) {
			this._changeEventsToDispatch.set(dimension.key, { dimensionKey: dimension.key, cleared: false, changes: new Map() });
		}
		const dimensionChanges = this._changeEventsToDispatch.get(dimension.key);
		dimensionChanges.cleared = dimensionCleared;

		switch (dimension.type) {
			case 'd2l-filter-dimension-set':
				dimensionChanges.changes.set(change.valueKey, change);
				break;
		}
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

	_updateActiveFilters() {
		const activeFilters = [];

		this._dimensions.forEach(dimension => {
			switch (dimension.type) {
				case 'd2l-filter-dimension-set': {
					dimension.values.forEach(value => {
						if (value.selected) {
							const keyObject = { dimension: dimension.key, value: value.key };
							const text = dimension.valueOnlyActiveFilterText ? value.text : `${dimension.text}: ${value.text}`;
							activeFilters.push({ keyObject: keyObject, text: text });
						}
					});
					break;
				}
			}
		});

		this._activeFilters = activeFilters;
	}

	_updateActiveFiltersSubscriber(subscriber) {
		if (!this._activeFilters) this._updateActiveFilters();
		subscriber.updateActiveFilters(this.id, this._activeFilters);
	}

	_updateActiveFiltersSubscribers(subscribers) {
		this._updateActiveFilters();
		subscribers.forEach(subscriber => subscriber.updateActiveFilters(this.id, this._activeFilters));
	}

}

customElements.define('d2l-filter', Filter);
