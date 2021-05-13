import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodyCompactStyles } from '../typography/styles.js';
import { LocalizeCoreElement } from '../../lang/localize-core-element.js';
import { selectionStates } from './selection-mixin.js';
import { SelectionSubscriberMixin } from './selection-subscriber-mixin.js';

/**
 * A summary showing the current selected count.
 */
class Summary extends LocalizeCoreElement(SelectionSubscriberMixin(LitElement)) {

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
		return html`
			<div class="d2l-body-compact">
				${this.selectionInfo.state === selectionStates.none ? this.noSelectionText : this.localize('components.selection.selected', 'count', this.selectionInfo.keys.length)}
			</div>
		`;
	}

}

customElements.define('d2l-selection-summary', Summary);
