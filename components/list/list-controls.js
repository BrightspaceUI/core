import { css } from 'lit';
import { findComposedAncestor } from '../../helpers/dom.js';
import { SelectionControls } from '../selection/selection-controls.js';

/**
 * Controls for list components containing select-all, etc.
 */
export class ListControls extends SelectionControls {
	static get properties() {
		return {
			childHasColor: { type: Boolean, reflect: true, attribute: 'child-has-color' },
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
			:host([child-has-color]) {
				margin: 0 -0.9rem;
			}
			:host([no-sticky]) {
				z-index: auto;
			}
			.d2l-list-controls-color,
			.d2l-list-controls-extend-separator  {
				padding: 6px 1.8rem;
			}
		`];
	}

	constructor() {
		super();
		this.childHasColor = false;
		this._extendSeparator = false;
	}

	connectedCallback() {
		super.connectedCallback();

		this._selectionControlsInitialPadding = window.getComputedStyle(this).getPropertyValue('--d2l-selection-controls-padding');

		const parent = findComposedAncestor(this.parentNode, node => node && node.tagName === 'D2L-LIST');
		if (parent) this._extendSeparator = parent.hasAttribute('extend-separators');
		if (this._extendSeparator) this.style.setProperty('--d2l-selection-controls-padding', '0px');
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('childHasColor') && !this._extendSeparator) {
			if (this.childHasColor) this.style.setProperty('--d2l-selection-controls-padding', '0px');
			else this.style.setProperty('--d2l-selection-controls-padding', this._selectionControlsInitialPadding);
		}
	}

	_getSelectionControlsContainerClasses() {
		return {
			...super._getSelectionControlsContainerClasses(),
			'd2l-list-controls-color': this.childHasColor,
			'd2l-list-controls-extend-separator': this._extendSeparator
		};
	}

	_getSelectionControlsLabel() {
		return this.localize('components.list-controls.label');
	}
}

customElements.define('d2l-list-controls', ListControls);
