import '../button/button-icon.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-menu.js';
import '../hierarchical-view/hierarchical-view.js';
import '../list/list.js';
import '../list/list-item.js';
import '../menu/menu.js';
import '../menu/menu-item.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyStandardStyles } from '../typography/styles.js';
import { getFirstFocusableDescendant } from '../../helpers/focus.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * A filter component that contains one or more dimensions a user can filter by.
 * This component is in charge of all rendering.
 * @slot - Dimension components used by the filter to construct the different dimensions locally
 * @fires d2l-filter-change - Dispatched when a dimension's value(s) have changed
 */
class Filter extends LocalizeCoreElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Disables the dropdown opener for the filter
			 */
			disabled: { type: String, reflect: true },
			_activeDimensionKey: { type: String },
			_dimensions : { type: Map }
		};
	}

	static get styles() {
		return [bodyStandardStyles, css`
			div[slot="header"] {
				padding: 18px 6px;
			}
			.d2l-filter-dimension-header {
				align-items: center;
				display: flex;
				width: 100%;
			}
			.d2l-filter-dimension-header-text {
				padding-right: calc(2rem + 2px);
				text-align: center;
				width: 100%;
			}
			:host([dir="rtl"]) .d2l-filter-dimension-header-text {
				padding-left: calc(2rem + 2px);
				padding-right: 0;
			}

			.d2l-filter-dimension-value-text {
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		`];
	}

	constructor() {
		super();
		this.disabled = false;
		this._dimensions = new Map();
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._dimensionsSlot = this.shadowRoot.querySelector('slot');

		// Prevent these events from bubbling out of the filter
		this.addEventListener('d2l-hierarchical-view-hide-complete', this._stopPropagation);
		this.addEventListener('d2l-hierarchical-view-hide-start', this._stopPropagation);
		this.addEventListener('d2l-hierarchical-view-show-complete', this._stopPropagation);
		this.addEventListener('d2l-hierarchical-view-show-start', this._stopPropagation);
		this.addEventListener('d2l-hierarchical-view-resize', this._stopPropagation);
	}

	render() {
		let header = null;
		if (this._activeDimensionKey) {
			const dimensionText = this._dimensions.get(this._activeDimensionKey).text;
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

		const dimensions = this._buildDimensions();

		return html`
			<d2l-dropdown-button-subtle
				@d2l-dropdown-close="${this._handleDropdownClose}"
				@d2l-dropdown-open="${this._stopPropagation}"
				@d2l-dropdown-position="${this._stopPropagation}"
				text="${this.localize('components.filter.filters')}"
				?disabled="${this.disabled}">
				<d2l-dropdown-menu min-width="285" max-width="420" no-padding-header>
					<div slot="header">${header}</div>
					<d2l-menu label="${this.localize('components.filter.filters')}">
						<slot
							@d2l-filter-dimension-data-change="${this._handleDataChangeListDimension}"
							@d2l-filter-dimension-value-data-change="${this._handleDataChangeListDimensionValue}"
							@d2l-filter-dimension-slot-change="${this._handleSlotChange}"
							@slotchange="${this._handleSlotChange}"
						></slot>
						${dimensions}
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-button-subtle>
		`;
	}

	_buildDimension(dimension) {
		let dimensionHTML;
		switch (dimension.tagName.toLowerCase()) {
			case 'd2l-filter-dimension':
				dimensionHTML = this._createListDimension(dimension);
				break;
		}
		return html`
			<d2l-hierarchical-view
				@d2l-hierarchical-view-show-complete="${this._handleDimensionShowComplete}"
				@d2l-hierarchical-view-show-start="${this._handleDimensionShowStart}"
				id="${dimension.key}">

				${dimensionHTML}
			</d2l-hierarchical-view>
		`;
	}

	_buildDimensions() {
		return Array.from(this._dimensions.values(), (dimension) => {
			const builtDimension = this._buildDimension(dimension);
			return html`<d2l-menu-item text="${dimension.text}">
				${builtDimension}
			</d2l-menu-item>`;
		});
	}

	_createListDimension(dimension) {
		const slot = dimension.shadowRoot.querySelector('slot');
		const items = slot.assignedNodes().filter(node => node.nodeType ===  Node.ELEMENT_NODE);
		return html`
			<d2l-list
				@d2l-list-selection-change="${this._handleChangeListDimension}"
				extend-separators>

				${items.map(item => html`
					<d2l-list-item
						key="${item.key}"
						selectable
						?selected="${item.selected}"
						slim>

						<div class="d2l-filter-dimension-value-text">${item.text}</div>
					</d2l-list-item>
				`)}
			</d2l-list>
		`;
	}

	_dispatchChangeEvent(eventDetail) {
		this.dispatchEvent(new CustomEvent('d2l-filter-change', { bubbles: false, composed: false, detail: eventDetail }));
	}

	_handleChangeListDimension(e) {
		const dimensionKey = e.composedPath()[0].parentNode.id;
		const valueKey = e.detail.key;
		const selected = e.detail.selected;

		// Update the corresponding d2l-filter-dimension-value to keep them in sync
		const dimension = this._dimensions.get(dimensionKey);
		const slot = dimension.shadowRoot.querySelector('slot');
		const items = slot.assignedNodes().filter(node => node.nodeType ===  Node.ELEMENT_NODE);
		const item = items.find(item => item.key === valueKey);
		item.selected = selected;

		this._dispatchChangeEvent({ dimension: dimensionKey, value: { key: valueKey, selected: selected } });
	}

	_handleDataChangeListDimension(e) {
		const dimension = this.shadowRoot.getElementById(e.target.key);
		const changes = e.detail.changes;
		if (changes.has('text')) {
			const menuItem = dimension.parentNode;
			if (menuItem.text !== changes.get('text')) {
				this.requestUpdate();
				return;
			}
		}
	}

	_handleDataChangeListDimensionValue(e) {
		const dimension = this.shadowRoot.getElementById(e.target.parentNode.key);
		const value = dimension.querySelector(`[key="${e.target.key}"]`);
		const changes = e.detail.changes;

		if (changes.has('text')) {
			const text = value.querySelector('.d2l-filter-dimension-value-text');
			if (text.innerText !== changes.get('text')) {
				text.innerText = changes.get('text');
			}
		}
		if (changes.has('selected')) {
			if (value.selected !== changes.get('selected')) {
				value.selected = changes.get('selected');
			}
		}
	}

	_handleDimensionHide() {
		this.shadowRoot.querySelector(`#${this._activeDimensionKey}`).hide();
		this._activeDimensionKey = null;
	}

	_handleDimensionShowComplete() {
		const dimension = this.shadowRoot.querySelector(`#${this._activeDimensionKey}`);
		const focusable = getFirstFocusableDescendant(dimension);
		if (focusable) {
			focusable.focus();
		}
	}

	_handleDimensionShowStart(e) {
		this._activeDimensionKey = e.detail.sourceView.id;
	}

	_handleDropdownClose(e) {
		this._activeDimensionKey = null;
		this._stopPropagation(e);
	}

	_handleSlotChange() {
		const nodes = this._dimensionsSlot.assignedNodes();
		const filteredNodes = nodes.filter((node) => {
			const isNode = node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'template';
			return isNode;
		});

		this._dimensions = new Map(filteredNodes.map(node => [node.key, node]));
	}

	_stopPropagation(e) {
		e.stopPropagation();
	}

}

customElements.define('d2l-filter', Filter);
