import { css, html, LitElement } from 'lit-element/lit-element.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export const listSelectionStates = {
	none: 'none',
	some: 'some',
	all: 'all'
};

class List extends LitElement {

	static get properties() {
		return {
			extendSeparators: { type: Boolean, reflect: true, attribute: 'extend-separators' },
			grid: { type: Boolean },
			separators: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				display: block;
			}
		`;
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
		const role = !this.grid ? 'list' : undefined;
		return html`
			<div role="${ifDefined(role)}" class="d2l-list-container">
				<slot></slot>
			</div>
		`;
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
		return this.shadowRoot.querySelector('slot').assignedNodes({flatten: true}).filter((node) => {
			return node.nodeType === Node.ELEMENT_NODE && (node.role === 'listitem' || node.tagName.includes('LIST-ITEM'));
		});
	}

}

customElements.define('d2l-list', List);
