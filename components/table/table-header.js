import { html, nothing } from 'lit';
import { SelectionHeader } from '../selection/selection-header.js';

/**
 * A header for table components containing a selection summary and selection actions.
 * @slot - Responsive container using `d2l-overflow-group` for `d2l-selection-action` elements
 */
class TableHeader extends SelectionHeader {
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

customElements.define('d2l-table-header', TableHeader);
