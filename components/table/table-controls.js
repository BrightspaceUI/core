import '../selection/selection-select-all-pages.js';
import '../selection/selection-summary.js';
import { css, html, nothing } from 'lit';
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
			noSelection: { type: Boolean, attribute: 'no-selection' },
			_hasStickyHeaders: { type: Boolean, attribute: '_has-sticky-headers', reflect: true },
		};
	}

	static get styles() {
		return [super.styles, css`
			:host {
				--d2l-selection-controls-background-color: var(--d2l-table-controls-background-color);
				--d2l-selection-controls-shadow-display: var(--d2l-table-controls-shadow-display);
				z-index: 2; /* Must sit under d2l-table sticky-headers but over sticky columns and regular cells */
			}
			:host([no-sticky]) {
				z-index: auto;
			}
			:host([_has-sticky-headers][_scrolled]) .d2l-selection-controls-shadow {
				bottom: calc(-6px - var(--d2l-table-border-radius)); /* Extend past 6px margin and --d2l-table-border-radius */
				box-shadow: unset;
				clip: unset;
			}
		`];
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
