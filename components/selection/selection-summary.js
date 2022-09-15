import { css, html, LitElement } from 'lit';
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
			noSelectionText: { type: String, attribute: 'no-selection-text' }
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
		if (this._provider && this._provider.selectionSingle) return;

		let count;
		let summary;
		if (this._provider && this._provider.selectionCountOverride !== undefined) {
			count = this._provider.selectionCountOverride;
			summary = (this._provider.selectionCountOverride === 0 && this.noSelectionText ?
				this.noSelectionText : this.localize('components.selection.selected', 'count', count));
		} else {
			count = (this.selectionInfo.state === SelectionInfo.states.allPages ?
				this._provider.itemCount : this.selectionInfo.keys.length);

			summary = (this.selectionInfo.state === SelectionInfo.states.none && this.noSelectionText ?
				this.noSelectionText : this.localize('components.selection.selected', 'count', count));
		}

		return html`
			<p class="d2l-body-compact">${summary}</p>
		`;
	}

}

customElements.define('d2l-selection-summary', Summary);
