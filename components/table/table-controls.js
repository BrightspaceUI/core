import { css } from 'lit';
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

	static get styles() {
		return [super.styles, css`
			:host {
				--d2l-selection-controls-background-color: var(--d2l-table-controls-background-color);
				--d2l-selection-controls-shadow-display: var(--d2l-table-controls-shadow-display);
				z-index: 6; /* Must be greater than d2l-table-wrapper and d2l-scroll-wrapper */
			}
			:host([no-sticky]) {
				z-index: auto;
			}
		`];
	}

	constructor() {
		super();
		this._noSelectAll = true;
	}

	_getSelectionControlsLabel() {
		return this.localize('components.table-controls.label');
	}
}

customElements.define('d2l-table-controls', TableControls);
