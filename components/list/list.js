import { css, html, LitElement } from 'lit-element/lit-element.js';

export const listSelectionStates = {
	none: 'none',
	some: 'some',
	all: 'all'
};

/**
 * A container for a styled list of items ("d2l-list-item"). It provides the appropriate "list" semantics as well as options for displaying separators, etc.
 * @slot - List content (e.g., "listitem"s)
 * @fires d2l-list-selection-change - Dispatched when the selection state changes
 */
class List extends LitElement {

	static get properties() {
		return {
			/**
			 * Whether to extend the separators beyond the content's edge
			 */
			extendSeparators: { type: Boolean, reflect: true, attribute: 'extend-separators' },
			/**
			 * Use grid to manage focus with arrow keys
			 */
			grid: { type: Boolean },
			/**
			 * Display separators. Valid values are "all" (default), "between", "none"
			 * @type {'all'|'between'|'none'}
			 * @default "all"
			 */
			separators: { type: String, reflect: true },
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
	}

	constructor() {
		super();
		this.extendSeparators = false;
		this.grid = false;
	}

	firstUpdated() {
		this.addEventListener('d2l-list-item-selected', (e) => {
			this.dispatchEvent(new CustomEvent('d2l-list-selection-change', {
				detail: e.detail
			}));
			e.stopPropagation();
		});
	}

	render() {
		const role = !this.grid ? 'list' : 'application';
		return html`
			<div role="${role}" class="d2l-list-container">
				<slot></slot>
			</div>
		`;
	}

	getListItemCount() {
		return this._getListItems().length;
	}

	getListItemPosition(item) {
		return this._getListItems().indexOf(item);
	}

	getSelectionInfo() {
		const items = this._getItems();
		const selectedItems = items.filter(item => item.selected);

		let state = listSelectionStates.none;
		if (selectedItems.length > 0) {
			if (selectedItems.length === items.length) state = listSelectionStates.all;
			else state = listSelectionStates.some;
		}

		return {
			keys: selectedItems.map(item => item.key),
			state: state
		};
	}

	toggleSelectAll() {
		const items = this._getItems();
		const notSelectedItems = items.filter(item => !item.selected);
		if (notSelectedItems.length === 0) {
			items.forEach(item => item.setSelected(false, true));
		} else {
			notSelectedItems.forEach(item => item.setSelected(true, true));
		}
	}

	_getItems() {
		return this.shadowRoot.querySelector('slot').assignedNodes({ flatten: true }).filter((node) => {
			return node.nodeType === Node.ELEMENT_NODE && (node.role === 'listitem' || node.tagName.includes('LIST-ITEM'));
		});
	}

	_getListItems() {
		return this.shadowRoot.querySelector('slot').assignedNodes({ flatten: true }).filter((node) => node.nodeType === Node.ELEMENT_NODE);
	}

}

customElements.define('d2l-list', List);
