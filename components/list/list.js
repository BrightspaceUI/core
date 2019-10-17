import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

export const listSelectionStates = {
	none: 0,
	indeterminate: 1,
	all: 2
};

class List extends LitElement {

	static get properties() {
		return {
			extendSeparators: { type: Boolean, reflect: true, attribute: 'extend-separators' },
			hoverEffect: {type: Boolean, attribute: 'hover-effect'},
			separators: { type: String, reflect: true }
		};
	}

	static get styles() {

		const layout = css`
			:host {
				display: block;
				--d2l-list-item-separator-bottom: initial;
				--d2l-list-item-separator-top: initial;
			}
		`;

		const specialCases = css`
			:host([separators="none"]) {
				--d2l-list-item-separator-bottom: none;
				--d2l-list-item-separator-padding-bottom: 1px;
				--d2l-list-item-separator-padding-top: 1px;
				--d2l-list-item-separator-top: none;
			}
			:host([separators="between"]) ::slotted([role="listitem"]:first-of-type) {
				--d2l-list-item-separator-padding-top: 1px;
				--d2l-list-item-separator-top: none;
			}
			:host([separators="between"]) ::slotted([role="listitem"]:last-of-type) {
				--d2l-list-item-separator-bottom: none;
				--d2l-list-item-separator-padding-bottom: 1px;
			}
			:host([hover-effect]),
			:host([extend-separators]) {
				--d2l-list-item-content-padding-side: 0.9rem;
			}
			:host([hover-effect]) ::slotted([role="listitem"]:hover) {
				--d2l-list-item-separator-bottom: initial;
				--d2l-list-item-separator-padding-bottom: initial;
				--d2l-list-item-separator-padding-top: initial;
				--d2l-list-item-separator-top: initial;
			}
			:host([hover-effect]) ::slotted([role="listitem"]) {
				--d2l-list-item-hover-background: var(--d2l-color-regolith);
			}
			:host([hover-effect]) ::slotted([role="listitem"][selected]) {
				--d2l-list-item-content-text-secondary-color: var(--d2l-color-ferrite);
				--d2l-list-item-background: rgba(232, 248, 255, 0.5);
				--d2l-list-item-separator-bottom: 1px solid var(--d2l-color-celestine);
				--d2l-list-item-separator-padding-bottom: initial;
				--d2l-list-item-separator-padding-top: initial;
				--d2l-list-item-separator-top: 1px solid var(--d2l-color-celestine);
				position: relative;
				z-index: 1;
			}
		`;

		return [layout, specialCases];
	}

	constructor() {
		super();
		this.addEventListener('d2l-list-item-selected', this._onlistItemSelected.bind(this));
	}

	getSelectedKeys() {
		const items = [...this.querySelectorAll('d2l-list-item')];
		return items && items.filter(item => item.selected).map(item => item.key);
	}

	getSelectionState() {
		const items = [...this.querySelectorAll('d2l-list-item')];
		const selectedItems = items.filter(item => item.selected);
		if (!selectedItems || selectedItems.length < 1) {
			return listSelectionStates.none;
		}

		const notSelectedItems = items.filter(item => !item.selected);
		if (notSelectedItems.length < 1) {
			return listSelectionStates.all;
		}

		return listSelectionStates.indeterminate;
	}

	render() {
		return html`
			<div role="list" class="d2l-list-container">
				<slot></slot>
			</div>
		`;
	}

	toggleSelectAll() {
		const items = [...this.querySelectorAll('d2l-list-item')];
		const notSelectedItems = items.filter(item => !item.selected);
		if (notSelectedItems.length < 1) {
			const selectedItems = items.filter(item => item.selected);
			selectedItems.forEach(item => {
				item.setSelected(false, true);
			});
		} else {
			notSelectedItems.forEach(item => {
				item.setSelected(true, true);
			});
		}
	}

	_onlistItemSelected(event) {
		this.dispatchEvent(new CustomEvent('d2l-list-selection-change', {
			detail: event.detail
		}));
		event.stopPropagation();
	}

}

customElements.define('d2l-list', List);
