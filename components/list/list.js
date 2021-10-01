import { css, html, LitElement } from 'lit-element/lit-element.js';
import { SelectionInfo, SelectionMixin } from '../selection/selection-mixin.js';

export const listSelectionStates = SelectionInfo.states;

/**
 * A container for a styled list of items ("d2l-list-item"). It provides the appropriate "list" semantics as well as options for displaying separators, etc.
 * @slot - List content (e.g., `listitem`s)
 * @fires d2l-list-selection-change - Dispatched when the selection state changes
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
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
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
				<slot name="header"></slot>
				<slot></slot>
			</div>
		`;
	}

	getListItemCount() {
		return this._getItems().length;
	}

	getListItemIndex(item) {
		return this._getItems().indexOf(item);
	}

	getSelectionInfo(includeNested) {
		const selectionInfo = super.getSelectionInfo();
		if (!includeNested) return selectionInfo;

		let keys = selectionInfo.keys;
		const nestedLists = this.querySelectorAll('d2l-list[slot="nested"]');

		nestedLists.forEach(nestedList => {
			keys = [...keys, ...nestedList.getSelectionInfo().keys];
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

}

customElements.define('d2l-list', List);
