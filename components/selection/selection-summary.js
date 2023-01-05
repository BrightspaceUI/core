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
			let includePlus = false;
			if (this._provider && this._provider.getItems) {
				const lazyLoadListItems = this._provider.getItems()[0]._getFlattenedListItems().lazyLoadListItems;
				if (lazyLoadListItems.size > 0) {
					for (const selectedItemKey of this.selectionInfo.keys) {
						if (lazyLoadListItems.has(selectedItemKey)) {
							includePlus = true;
							break;
						}
					}
				}
			}

			count = this.selectionInfo.state === SelectionInfo.states.allPages ?
				this._provider.itemCount : this.selectionInfo.keys.length;

			if (this.selectionInfo.state === SelectionInfo.states.none && this.noSelectionText) {
				this._summary = this.noSelectionText;
			} else if (includePlus) {
				this._summary = this.localize('components.selection.selected-plus', 'count', count);
			} else {
				this._summary = this.localize('components.selection.selected', 'count', count);
			}
		}
	}

}

customElements.define('d2l-selection-summary', Summary);
