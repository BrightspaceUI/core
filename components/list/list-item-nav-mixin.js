import '../colors/colors.js';
import { css } from 'lit';
import { ListItemButtonMixin } from './list-item-button-mixin.js';

export const ListItemNavMixin = superclass => class extends ListItemButtonMixin(superclass) {

	static get properties() {
		return {
			/**
			 * Whether the list item is the current page in a navigation context
			 * @type {boolean}
			 */
			current: { type: Boolean, reflect: true },
			_childCurrent: { type: Boolean, reflect: true, attribute: '_child-current' },
		};
	}

	static get styles() {

		const styles = [ css`
			.d2l-list-item-content ::slotted(*) {
				width: 100%; /* add vdiff for this case where hovering on tooltip causes the text to be wider than the button */
			}
			:host([current]) [slot="outside-control-container"] {
				margin-block: 1px;
				outline: 3px solid var(--d2l-button-focus-color, var(--d2l-color-celestine));
			}
			:host([_child-current]) [slot="outside-control-container"] {
				margin-block: 1px;
				outline: 1px solid var(--d2l-button-focus-color, var(--d2l-color-celestine-plus-1));
			}
			:host([current]) [slot="control-container"]::after,
			:host([_child-current]) [slot="control-container"]::before,
			:host([_child-current]) [slot="control-container"]::after {
				border-color: transparent;
			}
			:host([_focusing-primary-action]) .d2l-list-item-content {
				--d2l-list-item-content-text-outline: none !important;
			}

		` ];

		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.current = false;
		this._childCurrent = false;
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-list-item-nav-set-child-current', async(e) => {
			await this.updateComplete; // ensure button exists
			if (e.target === this || !this._button) return;
			this._childCurrent = e.detail.value;
		});
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		if (this.current) {
			this._button.ariaCurrent = 'page';
			this._dispatchSetChildCurrentEvent(true);
		}
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('current')) {
			if (this.current) {
				this._childCurrent = false;
				this._button.ariaCurrent = 'page';
			} else if (this._childCurrent) {
				this._button.ariaCurrent = 'location';
			} else {
				this._button.ariaCurrent = undefined;
			}

			if (changedProperties.get('current') !== undefined) {
				/** @ignore */
				this.dispatchEvent(new CustomEvent('d2l-list-item-property-change', { bubbles: true, detail: { name: 'current', value: this.current } }));
			}
		} else if (changedProperties.has('_childCurrent')) {
			if (this.current) {
				this._button.ariaCurrent = 'page';
			} else if (this._childCurrent) {
				this._button.ariaCurrent = 'location';
			} else {
				this._button.ariaCurrent = undefined;
			}
		}
	}

	_dispatchSetChildCurrentEvent(val) {
		/** @ignore */
		this.dispatchEvent(new CustomEvent('d2l-list-item-nav-set-child-current', { bubbles: true, detail: { value: val } }));
	}

	_onButtonClick(e) {
		if (!this._getDescendantClicked(e)) {
			this.current = true;
			this._childCurrent = false;
		}
	}

};
