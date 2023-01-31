import { css } from 'lit';
import { findComposedAncestor } from '../../helpers/dom.js';
import { SelectionControls } from '../selection/selection-controls.js';

/**
 * A header for list components containing select-all, etc.
 */
class ListHeader extends SelectionControls {
	static get properties() {
		return {
			_extendSeparator: { state: true }
		};
	}

	static get styles() {
		return [super.styles, css`
			:host {
				--d2l-selection-controls-background-color: var(--d2l-list-header-background-color);
				z-index: 6; /* must be greater than d2l-list-item-active-border */
			}
			:host([no-sticky]) {
				z-index: auto;
			}
			.d2l-list-header-extend-separator {
				padding: 0 0.9rem;
			}
		`];
	}

	constructor() {
		super();
		this._extendSeparator = false;
	}

	connectedCallback() {
		super.connectedCallback();

		const parent = findComposedAncestor(this.parentNode, node => node && node.tagName === 'D2L-LIST');
		if (parent) this._extendSeparator = parent.hasAttribute('extend-separators');
	}

	_getSelectionControlsContainerClasses() {
		return {
			...super._getSelectionControlsContainerClasses(),
			'd2l-list-header-extend-separator': this._extendSeparator
		};
	}

	_getSelectionControlsLabel() {
		return this.localize('components.list-header.label');
	}
}

customElements.define('d2l-list-header', ListHeader);
