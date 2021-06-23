import '../colors/colors.js';
import '../button/button-icon.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-content.js';
import '../dropdown/dropdown-menu.js';
import '../hierarchical-view/hierarchical-view.js';
import '../list/list.js';
import '../list/list-item.js';
import '../loading-spinner/loading-spinner.js';
import '../menu/menu.js';
import '../menu/menu-item.js';

import { bodyCompactStyles, bodyStandardStyles } from '../typography/styles.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A filter component that contains one or more dimensions a user can filter by.
 * This component is in charge of all rendering.
 * @slot - Dimension components used by the filter to construct the different dimensions locally
 * @fires d2l-filter-change - Dispatched when a dimension's value(s) have changed
 * @fires d2l-filter-dimension-first-open - Dispatched when a dimension is opened for the first time
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
			_totalAppliedCount: { type: Number, attribute: false },
			_totalMaxCount: { type: Number, attribute: false }
		};
	}

	static get styles() {
		return [bodyCompactStyles, bodyStandardStyles, offscreenStyles, css`
			div[slot="header"] {
				padding: 0.9rem 0.3rem;
			}
			.d2l-filter-dimension-header {
				align-items: center;
				display: flex;
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
				line-height: unset;
			}

			/* Needed to "undo" the menu hover styles */
			:host(:hover) .d2l-filter-dimension-set-value-text {
				color: var(--d2l-color-ferrite);
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
		this._dimensions = [];
		this._openedDimensions = [];
		this._totalAppliedCount = 0;
		this._totalMaxCount = 0;
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

		const filterCount = this._formatFilterCount(this._totalAppliedCount, this._totalMaxCount);
		let buttonText = singleDimension ? this._dimensions[0].text : this.localize('components.filter.filters');
		if (filterCount) buttonText = `${buttonText} (${filterCount})`;

		let description = singleDimension ? this.localize('components.filter.singleDimensionDescription', { filterName: this._dimensions[0].text }) : this.localize('components.filter.filters');
		description += `. ${this.localize('components.filter.filterCountDescription', { number: this._totalAppliedCount })}`;

		const dropdownContent = singleDimension ? html`
				<d2l-dropdown-content min-width="285" max-width="420" no-padding-header no-padding>
					${header}
					${dimensions}
				</d2l-dropdown-content>`
			: html`
				<d2l-dropdown-menu min-width="285" max-width="420" no-padding-header>
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
					<span>${this._formatFilterCount(dimension.appliedCount, dimension.maxCount)}</span>
				</div>
			</d2l-menu-item>`;
		});
	}

	_buildHeader(singleDimension) {
		if (!this._activeDimensionKey && !singleDimension) return null;

		let header = null;
		if (!singleDimension) {
			const dimensionText = this._dimensions.find(dimension => dimension.key === this._activeDimensionKey).text;
			header = html`
				<div class="d2l-filter-dimension-header">
					<d2l-button-icon
						@click="${this._handleDimensionHide}"
						icon="tier1:chevron-left"
						text="${this.localize('components.menu-item-return.returnCurrentlyShowing', 'menuTitle', dimensionText)}">
					</d2l-button-icon>
					<div class="d2l-filter-dimension-header-text d2l-body-standard">${dimensionText}</div>
				</div>
			`;
		}

		return html`
			<div slot="header">
				${header}
			</div>
		`;
	}

	_createSetDimension(dimension) {
		if (dimension.loading) {
			return html`
				<d2l-loading-spinner></d2l-loading-spinner>
				<div class="d2l-offscreen" aria-busy="true" role="alert">${this.localize('components.filter.loading')}</div>
			`;
		}

		return html`
			<d2l-list
				@d2l-list-selection-change="${this._handleChangeSetDimension}"
				data-key="${dimension.key}"
				extend-separators>
				${dimension.values.map(item => html`
					<d2l-list-item
						key="${item.key}"
						selectable
						?selected="${item.selected}"
						slim>
						<div class="d2l-filter-dimension-set-value-text d2l-body-compact">${item.text}</div>
					</d2l-list-item>
				`)}
			</d2l-list>
		`;
	}

	_dispatchChangeEvent(eventDetail) {
		this.dispatchEvent(new CustomEvent('d2l-filter-change', { bubbles: true, composed: false, detail: eventDetail }));
	}

	_dispatchDimensionFirstOpenEvent(key) {
		if (!this._openedDimensions.includes(key)) {
			this.dispatchEvent(new CustomEvent('d2l-filter-dimension-first-open', { bubbles: true, composed: false, detail: { key: key } }));
			this._openedDimensions.push(key);
		}
	}

	_formatFilterCount(count, max) {
		if (count === 0) return;

		let number = count;
		if (count === max) {
			number = 'all';
		} else if (count >= 100) {
			number = 'max';
		}
		return this.localize('components.filter.filterCount', { number: number });
	}

	_getSlottedNodes(slot) {
		const dimensionTypes = ['d2l-filter-dimension-set'];
		const nodes = slot.assignedNodes({ flatten: true });
		return nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE && dimensionTypes.includes(node.tagName.toLowerCase()));
	}

	_handleChangeSetDimension(e) {
		const dimensionKey = e.target.getAttribute('data-key');
		const dimension = this._dimensions.find(dimension => dimension.key === dimensionKey);
		const valueKey = e.detail.key;
		const selected = e.detail.selected;

		if (selected) {
			dimension.appliedCount++;
			this._totalAppliedCount++;
		} else {
			dimension.appliedCount--;
			this._totalAppliedCount--;
		}

		this._dispatchChangeEvent({ dimension: dimensionKey, value: { key: valueKey, selected: selected } });
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
				shouldRecount = true;
			}
		});

		if (shouldRecount) this._setFilterCounts();
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
					const values = dimension._getValues();
					info.values = values;
					break;
				}
			}

			return info;
		});

		this._setFilterCounts();
	}

	_setFilterCounts() {
		this._totalAppliedCount = 0;
		this._totalMaxCount = 0;

		this._dimensions.forEach(dimension => {
			switch (dimension.type) {
				case 'd2l-filter-dimension-set': {
					dimension.appliedCount = dimension.values.reduce((total, value) => { return value.selected ? total + 1 : total; }, 0);
					dimension.maxCount = dimension.values.length;
					break;
				}
			}

			this._totalAppliedCount += dimension.appliedCount;
			this._totalMaxCount += dimension.maxCount;
		});
	}

	_stopPropagation(e) {
		e.stopPropagation();
	}

}

customElements.define('d2l-filter', Filter);
