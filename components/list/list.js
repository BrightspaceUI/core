import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';

export const selectableListStates = {
	none: 0,
	indeterminate: 1,
	all: 2
};

class List extends LitElement {
	static get properties() {
		return {
			dividerMode: { type: String, attribute: 'divider-mode' },
			dividerExtend: { type: Boolean, attribute: 'divider-extend'},
			hoverEffect: {type: Boolean, attribute: 'hover-effect'}
		};
	}

	static get styles() {
		const layout = css`
			:host {
				display: block;
				--d2l-list-item-divider-bottom: initial;
				--d2l-list-item-divider-top: initial;
			}
		`;

		const specialCases = css`
			:host([divider-mode="none"]) {
				--d2l-list-item-divider-bottom: none;
				--d2l-list-item-divider-padding-bottom: 1px;
				--d2l-list-item-divider-padding-top: 1px;
				--d2l-list-item-divider-top: none;
			}
			:host([divider-mode="between"]) ::slotted(d2l-list-item:last-of-type) {
				--d2l-list-item-divider-bottom: none;
				--d2l-list-item-divider-padding-bottom: 1px;
			}
			:host([divider-mode="between"]) ::slotted(d2l-list-item:first-of-type) {
				--d2l-list-item-divider-padding-top: 1px;
				--d2l-list-item-divider-top: none;
			}
			:host([hover-effect]),
			:host([divider-extend]) {
				--d2l-list-item-content-padding-side: 0.9rem;
			}
			:host([hover-effect]) ::slotted(d2l-list-item:hover) {
				--d2l-list-item-divider-bottom: initial;
				--d2l-list-item-divider-padding-bottom: initial;
				--d2l-list-item-divider-padding-top: initial;
				--d2l-list-item-divider-top: initial;
			}
			:host([hover-effect]) ::slotted(d2l-list-item) {
				--d2l-list-item-hover-background: var(--d2l-color-regolith);
			}
			:host([hover-effect]) ::slotted(d2l-list-item[selected]) {
				--d2l-list-item-content-text-secondary-color: var(--d2l-color-ferrite);
				--d2l-list-item-background: rgba(232, 248, 255, 0.5);
				--d2l-list-item-divider-bottom: 1px var(--d2l-color-celestine) solid;
				--d2l-list-item-divider-padding-bottom: initial;
				--d2l-list-item-divider-padding-top: initial;
				--d2l-list-item-divider-top: 1px var(--d2l-color-celestine) solid;
				position: relative;
				z-index: 1;
			}
		`;
		return [layout, specialCases];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this._checked = {};
		this.addEventListener('d2l-list-item-checked', this._onlistItemChecked.bind(this));
	}

	itemsChecked() {
		return Object.keys(this._checked).filter(ref => this._checked[ref]);
	}

	render() {
		return html`
			<div role="list" class="d2l-list-container">
				<slot></slot>
			</div>
		`;
	}

	selectionState() {
		const checkedListItems = this.itemsChecked();
		if (!checkedListItems || checkedListItems.length < 1) {
			return selectableListStates.none;
		}

		const uncheckedListItems = this.querySelectorAll('d2l-list-item:not([checked])');
		if (uncheckedListItems.length < 1) {
			return selectableListStates.all;
		}

		return selectableListStates.indeterminate;
	}

	selectAll() {
		if (!this.selectable) {
			return;
		}
		const uncheckedListItems = this.querySelectorAll('d2l-list-item:not([checked])');
		if (uncheckedListItems.length < 1) {
			const checkedListItems = this.querySelectorAll('d2l-list-item[checked]');
			checkedListItems.forEach(listItem => {
				listItem.toggleAttribute('checked');
			});
		} else {
			uncheckedListItems.forEach(listItem => {
				listItem.toggleAttribute('checked');
			});
		}
	}

	_onlistItemChecked(event) {
		event.stopPropagation();

		this._checked[event.detail.ref] = event.detail.checked;
		this.dispatchEvent(new CustomEvent('change', {
			detail: {
				checkedItems: this.itemsChecked()
			}
		}));
	}
}

customElements.define('d2l-list', List);
