import '../button/button-icon.js';
import '../button/button-subtle.js';
import '../dropdown/dropdown-button-subtle.js';
import '../dropdown/dropdown-menu.js';
import '../hierarchical-view/hierarchical-view.js';
import '../inputs/input-search.js';
import '../list/list.js';
import '../list/list-item.js';
import '../menu/menu.js';
import '../menu/menu-item.js';

import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyStandardStyles } from '../typography/styles.js';
import { checkboxStyles } from '../inputs/input-checkbox.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { MenuItemSelectableMixin } from '../menu/menu-item-selectable-mixin.js';
import { menuItemSelectableStyles } from '../menu/menu-item-selectable-styles.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

/**
 * To Do
 */
class Filter extends LocalizeCoreElement(RtlMixin(LitElement)) {

	static get properties() {
		return {
			disabled: { type: String, reflect: true },
			_activeDimension: { type: Object },
			_dimensions : { type: Array }
		};
	}

	static get styles() {
		return [bodyStandardStyles, css`
			div[slot="header"] {
				padding: 18px 6px 18px;
				position: relative;
			}
			d2l-input-search {
				padding-right: 12px;
			}
			.back {
				display: flex;
				padding-bottom: 18px;
			}
			.header {
				display: flex;
				width: 100%;
				align-self: center;
				justify-content: center;
    			padding-right: 42px;
			}
			.header-container {
				display: flex;
			}
			.header-container d2l-button-subtle {
				padding-right: 6px;;
			}
		`];
	}

	constructor() {
		super();
		this.disabled = false;
		this._dimensions = [];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this._dimensionSlot = this.shadowRoot.querySelector('slot');
	}

	render() {
		const header = this._activeDimension ?
			html`
				<div class="back">
					<d2l-button-icon @click="${this._onHideDimension}" icon="tier1:chevron-left" text="Back"></d2l-button-icon>
					<div class="header d2l-body-standard">${this._activeDimension.name}</div>
				</div>
				<div class="header-container">
					<d2l-button-subtle text="Clear"></d2l-button-subtle>
					<d2l-input-search label="Search" placeholder="Search ${this._activeDimension.name}"></d2l-input-search>
				</div>
			` :
			html`<d2l-button-subtle text="Clear All"></d2l-button-subtle>`;

		const dimensions = this._getDimensions();

		return html`
			<d2l-dropdown-button-subtle
				text="Filter"
				?disabled="${this.disabled}">
				<d2l-dropdown-menu min-width="300" no-padding-header>
					<div slot="header">${header}</div>
					<d2l-menu label="Filter">
						<slot @d2l-filter-dimension-menu-item-change="${this._onMenuItemChange}" @d2l-filter-dimension-change="${this._handleSlotChange}" @slotchange="${this._handleSlotChange}"></slot>
						${dimensions}
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-button-subtle>
		`;
	}

	_buildDimension(dimension) {
		let dimensionHTML;
		switch (dimension.tagName.toLowerCase()) {
			case 'd2l-filter-dimension-menu':
				dimensionHTML = this._createMenuDimension(dimension);
				break;
			case 'd2l-filter-dimension-list':
				dimensionHTML = this._createListDimension(dimension);
				break;
		}
		return dimensionHTML;
	}

	_createListDimension(dimension) {
		const slot = dimension.shadowRoot.querySelector('slot');
		const items = slot.assignedNodes().filter(node => node.nodeType ===  Node.ELEMENT_NODE);
		return html`
			<d2l-hierarchical-view
				@d2l-hierarchical-view-show-start="${this._onShowDimension}"
				id="${dimension.name}"
			>
				<d2l-list grid>
					${items.map(item => html`
						<d2l-list-item
							@d2l-list-selection-change="${this._onListItemSelect}"
							key="${item.text}"
							selectable
							?selected="${item.selected}"
						>
							${item.text}
						</d2l-list-item>
					`)}
				</d2l-list>
			</d2l-hierarchical-view>
		`;
	}

	_createMenuDimension(dimension) {
		const slot = dimension.shadowRoot.querySelector('slot');
		const items = slot.assignedNodes().filter(node => node.nodeType ===  Node.ELEMENT_NODE);
		return html`
			<d2l-menu
				@d2l-hierarchical-view-show-start="${this._onShowDimension}"
				id="${dimension.name}"
				label="${dimension.name}"
				no-return-items
			>
				${items.map(item => html`
					<d2l-filter-menu-item-checkbox
						@d2l-menu-item-select="${this._onMenuItemSelect}"
						text="${item.text}"
						value="${item.text}"
						?selected="${item.selected}">
					</d2l-filter-menu-item-checkbox>
				`)}
			</d2l-menu>
		`;
	}

	_getDimensions() {
		return this._dimensions.map(dimension => {
			const builtDimension = this._buildDimension(dimension);
			return html`<d2l-menu-item text="${dimension.name}">
				${builtDimension}
			</d2l-menu-item>`;
		});
	}

	_getSlotItems() {
		const nodes = this._dimensionSlot.assignedNodes();
		const filteredNodes = nodes.filter((node) => {
			const isNode = node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() !== 'template';
			return isNode;
		});

		return filteredNodes;
	}

	_handleSlotChange() {
		console.log('DIMENSION SLOT CHANGE');
		this._dimensions = this._getSlotItems();
		console.log(this._dimensions);
	}

	_onHideDimension() {
		this.shadowRoot.querySelector(`#${this._activeDimension.name}`).hide();
		this._activeDimension = null;
	}

	_onListItemSelect(e) {
		console.log(e);
		const dimension = this._dimensions.find(dimension => {
			return dimension.name === e.target.parentNode.id;
		});
		const slot = dimension.shadowRoot.querySelector('slot');
		const items = slot.assignedNodes().filter(node => node.nodeType ===  Node.ELEMENT_NODE);
		const item = items.find(item => item.text === e.target.value);
		item.selected = !item.selected;
		console.log('fire event');
		// Fire change event
	}

	_onMenuItemChange(e) {
		console.log(e);
		const dimension = this.shadowRoot.querySelector(`#${e.target.parentNode.name}`);
		const item = dimension.querySelector(`d2l-filter-menu-item-checkbox[value="${e.target.text}"]`);
		if (item.selected !== e.detail.selected) {
			console.log('update');
			item.selected = e.detail.selected;
			// or this._handleSlotChange();
		} else {
			console.log('no update');
		}
		// Do we fire change event? I think no, because not user initiated...
	}

	_onMenuItemSelect(e) {
		const dimension = this._dimensions.find(dimension => {
			return dimension.name === e.target.parentNode.id;
		});
		const slot = dimension.shadowRoot.querySelector('slot');
		const items = slot.assignedNodes().filter(node => node.nodeType ===  Node.ELEMENT_NODE);
		const item = items.find(item => item.text === e.target.value);
		item.selected = !item.selected;
		console.log('fire event');
		// Fire change event
	}

	_onShowDimension(e) {
		this._activeDimension = this._dimensions.find(dimension => {
			return dimension.name === e.detail.sourceView.id;
		});
	}

}

customElements.define('d2l-filter', Filter);

/**
 * A menu item component used for selection. Multiple checkboxes can be selected at once.
 * @fires click - Dispatched when the link is clicked
 * @fires d2l-menu-item-change - Dispatched when the selected menu item changes
 * @fires d2l-menu-item-select - Dispatched when the menu item is selected
 * @fires d2l-menu-item-visibility-change - Dispatched when the visibility of the menu item changes
 */
class FilterMenuItemCheckbox extends RtlMixin(MenuItemSelectableMixin(LitElement)) {

	static get styles() {
		return [checkboxStyles, menuItemSelectableStyles, css`
			.d2l-input-checkbox-text {
				color: var(--d2l-color-ferrite);
				display: inline-block;
				font-size: 0.8rem;
				font-weight: 400;
				margin-left: 0.5rem;
				vertical-align: top;
				white-space: normal;
			}

			:host([dir="rtl"]) .d2l-input-checkbox-text {
				margin-left: 0;
				margin-right: 0.5rem;
			}

			label {
				pointer-events: none;
			}

			:host(:focus) .d2l-input-checkbox,
			:host(:hover) .d2l-input-checkbox {
				border-color: var(--d2l-color-celestine);
				border-width: 2px;
				outline-width: 0;
			}
		`];
	}

	constructor() {
		super();
		this.role = 'menuitemcheckbox';
	}

	firstUpdated() {
		super.firstUpdated();
		this.addEventListener('d2l-menu-item-select', this._onSelectCheckbox);
	}

	render() {
		return html`
			<label>
				<span class="d2l-input-checkbox-wrapper d2l-skeletize">
					<input
						class="d2l-input-checkbox"
						.checked="${this.selected}"
						tabindex="-1"
						type="checkbox"
						.value="${this.value}">
				</span>
				<span class="d2l-input-checkbox-text d2l-skeletize">${this.text}</span>
			</label>
		`;
	}

	_onSelectCheckbox(e) {
		this.selected = !this.selected;
		this.__onSelect(e);
	}
}

customElements.define('d2l-filter-menu-item-checkbox', FilterMenuItemCheckbox);
