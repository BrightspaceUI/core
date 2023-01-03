import { css, html, LitElement, nothing } from 'lit';
import { bodyCompactStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { SelectionInfo } from './selection-mixin.js';
import { SelectionObserverMixin } from './selection-observer-mixin.js';

/**
 * A summary showing the current selected count.
 * @fires d2l-selection-observer-subscribe - Internal event
 */
class Summary extends LocalizeCoreElement(SelectionObserverMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Text to display if no items are selected
			 * @type {string}
			 */
			noSelectionText: { type: String, attribute: 'no-selection-text' },
			_summary: { state: true }
		};
	}

	static get styles() {
		return [bodyCompactStyles, css`
			:host {
				display: inline-block;
			}
			:host([hidden]) {
				display: none;
			}
			p {
				margin: 0;
			}
		`];
	}

	connectedCallback() {
		super.connectedCallback();
		window.addEventListener('d2l-list-item-expand-collapse-toggled', () => this._updateSelectSummary());
	}

	disconnectedCallback() {
		window.removeEventListener('d2l-list-item-expand-collapse-toggled', () => this._updateSelectSummary());
		super.disconnectedCallback();
	}

	render() {
		if (!this._summary) {
			return nothing;
		}
		return html`
			<p class="d2l-body-compact">${this._summary}</p>
		`;
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('_provider') || changedProperties.has('selectionInfo')) {
			this._updateSelectSummary();
		}
	}

	_updateSelectSummary() {
		if (this._provider && this._provider.selectionSingle) return;

		let count;
		if (this._provider && this._provider.selectionCountOverride !== undefined) {
			count = this._provider.selectionCountOverride;
			this._summary = this._provider.selectionCountOverride === 0 && this.noSelectionText ?
				this.noSelectionText : this.localize('components.selection.selected', 'count', count);
		} else {
			const visibleAndCollapsedRootState = this._provider.getItems()[0]._getVisibleAndCollapsedListItemState();
			let includePlus = false;
			let allSelectedItemsHidden = true;
			const visibleSelectedItems = this.selectionInfo.keys.filter(item => visibleAndCollapsedRootState.visibleItems.has(item));
			for (const selectedItem of this.selectionInfo.keys) {
				if (visibleAndCollapsedRootState.visibleItems.has(selectedItem)) {
					allSelectedItemsHidden = false;
				}
				if (visibleAndCollapsedRootState.collapsedItems.has(selectedItem) || !visibleAndCollapsedRootState.visibleItems.has(selectedItem)) {
					includePlus = true;
				}
			}

			count = this.selectionInfo.state === SelectionInfo.states.allPages ?
				this._provider.itemCount : visibleSelectedItems.length;

			if (this.selectionInfo.state === SelectionInfo.states.none && this.noSelectionText) {
				this._summary = this.noSelectionText;
			} else if (allSelectedItemsHidden) {
				this._summary = this.localize('components.selection.multiple-selected');
			} else if (includePlus) {
				this._summary = this.localize('components.selection.selected-plus', 'count', count);
			} else {
				this._summary = this.localize('components.selection.selected', 'count', count);
			}
		}
	}

}

customElements.define('d2l-selection-summary', Summary);
