import { css, html, LitElement } from 'lit-element/lit-element.js';
import { getNextFocusable, getPreviousFocusable } from '../../helpers/focus.js';
import { SelectionInfo, SelectionMixin } from '../selection/selection-mixin.js';

const keyCodes = {
	TAB: 9
};

export const listSelectionStates = SelectionInfo.states;

/**
 * A container for a styled list of items ("d2l-list-item"). It provides the appropriate "list" semantics as well as options for displaying separators, etc.
 * @slot - List content (e.g., `listitem`s)
 */
class List extends SelectionMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Whether to extend the separators beyond the content's edge
			 */
			extendSeparators: { type: Boolean, reflect: true, attribute: 'extend-separators' },
			/**
			 * Use grid to manage focus with arrow keys. See [Accessibility](#accessibility).
			 */
			grid: { type: Boolean },
			/**
			 * Display separators. Valid values are "all" (default), "between", "none"
			 * @type {'all'|'between'|'none'}
			 * @default "all"
			 */
			separators: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	constructor() {
		super();
		this.extendSeparators = false;
		this.grid = false;
		this._listItemChanges = [];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('d2l-list-item-selected', e => {

			// batch the changes from select-all and nested lists
			if (this._listItemChanges.length === 0) {
				setTimeout(() => {
					/** Dispatched once for a set of selection state changes (ex. select-all); event detail includes an array of objects where each object contains the `key` and `selected` state for each changed item */
					this.dispatchEvent(new CustomEvent('d2l-list-selection-changes', {
						detail: this._listItemChanges
					}));
					this._listItemChanges = [];
				}, 30);
			}
			this._listItemChanges.push(e.detail);

			setTimeout(() => {
				/** Dispatched when the selection state changes */
				this.dispatchEvent(new CustomEvent('d2l-list-selection-change', {
					bubbles: true,
					composed: true,
					detail: e.detail
				}));
			}, 0);

		});
	}

	render() {
		const role = !this.grid ? 'list' : 'application';
		return html`
			<div role="${role}" class="d2l-list-container">
				<slot name="header"></slot>
				<slot @keydown="${this._handleKeyDown}"></slot>
			</div>
		`;
	}

	getListItemCount() {
		return this._getItems().length;
	}

	getListItemIndex(item) {
		return this._getItems().indexOf(item);
	}

	getSelectedItems(includeNested) {
		let selectedItems = [];
		this._getItems().forEach(item => {
			if (item.selected) selectedItems.push(item);
			if (includeNested && item._selectionProvider) {
				selectedItems = [...selectedItems, ...item._selectionProvider.getSelectedItems(includeNested)];
			}
		});
		return selectedItems;
	}

	getSelectionInfo(includeNested) {
		const selectionInfo = super.getSelectionInfo();
		if (!includeNested) return selectionInfo;

		let keys = selectionInfo.keys;

		this._getItems().forEach(item => {
			if (item._selectionProvider) {
				keys = [...keys, ...item._selectionProvider.getSelectionInfo(true).keys];
			}
		});

		return new SelectionInfo(keys, selectionInfo.state);
	}

	_getItems() {
		const slot = this.shadowRoot.querySelector('slot:not([name])');
		if (!slot) return [];
		return slot.assignedNodes({ flatten: true }).filter((node) => {
			return node.nodeType === Node.ELEMENT_NODE && (node.role === 'listitem' || node.tagName.includes('LIST-ITEM'));
		});
	}

	_handleKeyDown(e) {
		if (!this.grid || this.slot === 'nested' || e.keyCode !== keyCodes.TAB) return;
		e.preventDefault();
		const focusable = (e.shiftKey ? getPreviousFocusable(this.shadowRoot.querySelector('slot:not([name])'))
			: getNextFocusable(this, false, true, true));
		if (focusable) focusable.focus();
	}

}

customElements.define('d2l-list', List);
