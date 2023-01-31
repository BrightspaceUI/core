import '../selection/selection-select-all-pages.js';
import '../selection/selection-summary.js';
import { html, nothing } from 'lit';
import { SelectionControls } from '../selection/selection-controls.js';

/**
 * Controls for table components containing a selection summary and selection actions.
 */
class TableControls extends SelectionControls {
	static get properties() {
		return {
			/**
			 * Whether to render the selection summary
			 * @type {boolean}
			 */
			noSelection: { type: Boolean, attribute: 'no-selection' }
		};
	}

	_renderSelection() {
		return html`
			<d2l-selection-summary
				aria-hidden="true"
				no-selection-text="${this.localize('components.selection.select-all')}"
			>
			</d2l-selection-summary>
			${this.selectAllPagesAllowed ? html`<d2l-selection-select-all-pages></d2l-selection-select-all-pages>` : nothing}
		`;
	}
}

customElements.define('d2l-table-controls', TableControls);
