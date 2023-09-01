import { css } from 'lit';
import { EventSubscriberController } from '../../controllers/subscriber/subscriberControllers.js';
import { findComposedAncestor } from '../../helpers/dom.js';
import { SelectionControls } from '../selection/selection-controls.js';

/**
 * Controls for list components containing select-all, etc.
 */
export class ListControls extends SelectionControls {
	static get properties() {
		return {
			_extendSeparator: { state: true },
			_siblingHasColor: { state: true }
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
			.d2l-list-controls-color {
				padding: 0 1.8rem;
			}
			.d2l-list-controls-extend-separator {
				padding: 0 0.9rem;
			}
		`];
	}

	constructor() {
		super();
		this._extendSeparator = false;
		this._siblingHasColor = false;

		this._parentChildUpdateSubscription = new EventSubscriberController(this, 'list-child-status');
	}

	connectedCallback() {
		super.connectedCallback();

		const parent = findComposedAncestor(this.parentNode, node => node && node.tagName === 'D2L-LIST');
		if (parent) this._extendSeparator = parent.hasAttribute('extend-separators');
		if (this._extendSeparator) this.style.setProperty('--d2l-selection-controls-padding', '0px');
	}

	updateSiblingHasChildren() {
		// TODO: implement this in order to have consistent spacing when nested items
	}

	updateSiblingHasColor(value) {
		this._siblingHasColor = value;
	}

	_getSelectionControlsContainerClasses() {
		return {
			...super._getSelectionControlsContainerClasses(),
			'd2l-list-controls-color': this._siblingHasColor,
			'd2l-list-controls-extend-separator': this._extendSeparator
		};
	}

	_getSelectionControlsLabel() {
		return this.localize('components.list-controls.label');
	}
}

customElements.define('d2l-list-controls', ListControls);
