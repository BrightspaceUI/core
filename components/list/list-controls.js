import { css } from 'lit';
import { findComposedAncestor } from '../../helpers/dom.js';
import { SelectionControls } from '../selection/selection-controls.js';

/**
 * Controls for list components containing select-all, etc.
 */
export class ListControls extends SelectionControls {
	static get properties() {
		return {
			_extendSeparator: { state: true }
		};
	}

	static get styles() {
		return [super.styles, css`
			:host {
				--d2l-selection-controls-background-color: var(--d2l-list-controls-background-color);
				--d2l-selection-controls-padding: var(--d2l-list-controls-padding, 18px);
				z-index: 6; /* must be greater than d2l-list-item-active-border */
			}
			:host([no-sticky]) {
				z-index: auto;
			}
			.d2l-list-controls-extend-separator {
				--d2l-selection-controls-padding: 0px; /* stylelint-disable-line length-zero-no-unit */
				padding: 0 0.9rem;
			}
			.d2l-list-controls-extend-separator-shadow {
				--d2l-selection-controls-padding: 0px; /* stylelint-disable-line length-zero-no-unit */
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
			'd2l-list-controls-extend-separator': this._extendSeparator
		};
	}

	_getSelectionControlsLabel() {
		return this.localize('components.list-controls.label');
	}

	_getSelectionControlsShadowClasses() {
		return {
			...super._getSelectionControlsShadowClasses(),
			'd2l-list-controls-extend-separator-shadow': this._extendSeparator
		};
	}
}

customElements.define('d2l-list-controls', ListControls);
