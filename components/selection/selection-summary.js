import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { SelectionInfo } from './selection-mixin.js';
import { SelectionObserverMixin } from './selection-observer-mixin.js';

/**
 * A summary showing the current selected count.
 */
class Summary extends LocalizeCoreElement(SelectionObserverMixin(LitElement)) {

	static get properties() {
		return {
			/**
			 * Text to display if no items are selected.
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
		`];
	}

	render() {
		const summary = (this.selectionInfo.state === SelectionInfo.states.none && this.noSelectionText ?
			this.noSelectionText : this.localize('components.selection.selected', 'count', this.selectionInfo.keys.length));
		return html`
			<div class="d2l-body-compact">${summary}</div>
		`;
	}

}

customElements.define('d2l-selection-summary', Summary);
